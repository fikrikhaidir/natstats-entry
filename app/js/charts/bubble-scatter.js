// Bubble scatter for the compare page: income per person (log scale) against another indicator,
// bubble area proportional to population, each bubble labelled with its country.
import { h, svg } from '../dom.js';
import { niceTicks, onResize } from './shared.js';

/** dots: [{ label, x, y, size, highlight? }]; xFormat / yFormat turn axis numbers into text. */
export function bubbleScatter({ dots, xFormat, yFormat, xTitle, yTitle, height = 360, label }) {
  const wrap = h('div', { class: 'chart', role: 'img', 'aria-label': label });
  const xs = dots.map((d) => Math.log10(d.x));
  const yTicks = niceTicks(Math.min(...dots.map((d) => d.y)) * 0.95, Math.max(...dots.map((d) => d.y)) * 1.02, 4);
  const maxSize = Math.max(...dots.map((d) => d.size));
  const xTicks = [1000, 3000, 10000, 30000, 100000].filter((t) => Math.log10(t) >= Math.min(...xs) - 0.25 && Math.log10(t) <= Math.max(...xs) + 0.25);

  function draw(width) {
    const pad = { l: 46, r: 34, t: 34, b: 46 };
    const lo = Math.min(...xs, Math.log10(xTicks[0])) - 0.08;
    const hi = Math.max(...xs, Math.log10(xTicks.at(-1))) + 0.08;
    const x = (value) => pad.l + ((Math.log10(value) - lo) / (hi - lo)) * (width - pad.l - pad.r);
    const y = (value) => pad.t + (1 - (value - yTicks[0]) / (yTicks.at(-1) - yTicks[0])) * (height - pad.t - pad.b);
    const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, width, height, class: 'chart-svg' });
    for (const t of yTicks) {
      root.append(svg('line', { x1: pad.l, x2: width - pad.r, y1: y(t), y2: y(t), class: 'gridline' }));
      root.append(svg('text', { x: pad.l - 8, y: y(t) + 4, class: 'tick', 'text-anchor': 'end', text: yFormat(t) }));
    }
    for (const t of xTicks) {
      root.append(svg('line', { x1: x(t), x2: x(t), y1: pad.t, y2: height - pad.b, class: 'gridline grid-v' }));
      root.append(svg('text', { x: x(t), y: height - pad.b + 16, class: 'tick', 'text-anchor': 'middle', text: xFormat(t) }));
    }
    root.append(svg('text', { x: (pad.l + width - pad.r) / 2, y: height - 6, class: 'axis-title', 'text-anchor': 'middle', text: xTitle }));
    root.append(svg('text', { x: 6, y: 12, class: 'axis-title', text: yTitle }));
    // Labels go above or below their bubble in turn (ordered left to right) so neighbours stay readable.
    const order = [...dots].sort((p, q) => p.x - q.x);
    for (const dot of [...dots].sort((p, q) => q.size - p.size)) {
      const r = 6 + Math.sqrt(dot.size / maxSize) * 18;
      const cx = x(dot.x);
      const cy = y(dot.y);
      const home = dots.find((d) => d.highlight);
      const nextToHome = !dot.highlight && home && Math.abs(Math.log10(dot.x / home.x)) < 0.12; // neighbours of the highlighted bubble go above it
      const above = dot.highlight ? false : nextToHome || order.indexOf(dot) % 2 === 1;
      const place = { x: Math.min(cx, width - 30), y: above ? cy - r - 6 : cy + r + 14, anchor: 'middle' };
      root.append(
        svg('g', { class: dot.highlight ? 'bubble is-home' : 'bubble' },
          svg('title', { text: `${dot.label}: ${xFormat(dot.x)} per person, ${yFormat(dot.y)}` }),
          svg('circle', { cx, cy, r }),
          svg('text', { x: place.x, y: place.y, 'text-anchor': place.anchor, text: dot.label })),
      );
    }
    wrap.replaceChildren(root);
  }

  requestAnimationFrame(onResize(wrap, draw));
  return wrap;
}
