// Takes the screenshots listed in shots.json from the running site with headless Chrome over the DevTools protocol.
// Each entry: { file, path, viewport: { width, height }, ready?: css selector, scrollTo?: css selector, click?: css selector }.
// Usage: node serve.ts --port 8137   (another terminal)   then   node tools/capture-shots.mjs [baseUrl] [chromePath]
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = process.argv[2] ?? 'http://127.0.0.1:8137/';
const chrome = process.argv[3] ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const shots = JSON.parse(readFileSync(process.env.SHOTS_FILE ?? join(root, 'shots.json'), 'utf8'));
const outDir = process.env.SHOTS_OUT ?? join(root, 'screenshots'); // overridden for scratch previews
const profile = join(root, '.chrome-profile');
const port = 9335;
const MAX_BYTES = 250 * 1024;

mkdirSync(outDir, { recursive: true });
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pageSocket() {
  for (let i = 0; i < 60; i++) {
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const tab = tabs.find((t) => t.type === 'page');
      if (tab) return tab.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(250);
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await pageSocket());
await new Promise((resolve) => (ws.onopen = resolve));
let nextId = 0;
const pending = new Map();
ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) pending.get(data.id)(data);
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, (data) => (data.error ? reject(new Error(`${method}: ${data.error.message}`)) : resolve(data.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

try {
  await send('Page.enable');
  for (const shot of shots) {
    const { width, height } = shot.viewport;
    const phone = width < 600;
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: phone });
    await send('Page.navigate', { url: `${base}${shot.path}` });
    await sleep(900);
    await evaluate(`new Promise((ok) => { const t0 = Date.now(); (function wait() { if (document.querySelector(${JSON.stringify(shot.ready ?? '.chart-svg')}) || Date.now() - t0 > 6000) ok(); else setTimeout(wait, 100); })(); })`);
    if (shot.click) await evaluate(`document.querySelector(${JSON.stringify(shot.click)})?.click()`);
    if (shot.scrollTo) await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(shot.scrollTo)}); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - ${shot.scrollOffset ?? 70}); })()`);
    await sleep(700);
    let quality = 86;
    let data;
    do {
      ({ data } = await send('Page.captureScreenshot', { format: 'jpeg', quality, captureBeyondViewport: false }));
      quality -= 6;
    } while (Buffer.byteLength(data, 'base64') * 0.75 > MAX_BYTES && quality > 40);
    writeFileSync(join(outDir, shot.file), Buffer.from(data, 'base64'));
    console.log(`${shot.file}: ${Math.round((data.length * 0.75) / 1024)} KiB at ${width}x${height}`);
  }
} finally {
  ws.close();
  proc.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
