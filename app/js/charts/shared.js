// Helpers every chart uses: round axis ticks, a legend, and a tooltip that follows the pointer.
import { h } from '../dom.js';

export const SERIES_COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)'];

// Round-number ticks covering [min, max]: niceTicks(0, 283) -> [0, 100, 200, 300].
export function niceTicks(min, max, count = 4) {
  if (min === max) max = min + 1;
  const rough = (max - min) / count;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power;
  const start = Math.floor(min / step) * step;
  const ticks = [];
  for (let v = start; v < max + step * 0.999; v += step) ticks.push(Math.round(v / step) * step);
  return ticks;
}

export function legend(series) {
  return h(
    'ul',
    { class: 'legend' },
    series.map((s, i) => h('li', {}, h('i', { style: { background: s.color ?? SERIES_COLORS[i] } }), s.label)),
  );
}

// Positions a floating box inside `wrap`, flipping to the left of the pointer near the right edge.
export function makeTooltip(wrap) {
  const tip = h('div', { class: 'chart-tip', role: 'status', hidden: true });
  wrap.append(tip);
  return {
    show(x, y, title, rows) {
      tip.replaceChildren(
        h('b', {}, title),
        ...rows.map((row) =>
          h('span', {}, h('i', { style: { background: row.color } }), `${row.label}: `, h('strong', {}, row.text)),
        ),
      );
      tip.hidden = false;
      const room = wrap.clientWidth - x; // wrap is the chart canvas the tooltip sits in
      tip.style.left = `${room < tip.offsetWidth + 24 ? x - tip.offsetWidth - 12 : x + 12}px`;
      tip.style.top = `${Math.max(0, y - 12)}px`;
    },
    hide() {
      tip.hidden = true;
    },
  };
}

// Calls draw(width) now and whenever the container's width changes.
export function onResize(wrap, draw) {
  let last = 0;
  const run = () => {
    const width = Math.round(wrap.clientWidth);
    if (width && width !== last) {
      last = width;
      draw(width);
    }
  };
  new ResizeObserver(run).observe(wrap);
  return run;
}
