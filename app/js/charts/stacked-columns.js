// Stacked columns, one per year, for shares that add up to about 100% (sectors, jobs by sector).
import { h, svg } from '../dom.js';
import { SERIES_COLORS, legend, makeTooltip, onResize } from './shared.js';

/** series: [{ label, points: [{ year, value }] }] (values are percentages); height in px. */
export function stackedColumns({ series, format, label, height = 260 }) {
  const wrap = h('div', { class: 'chart', role: 'img', 'aria-label': label });
  const canvas = h('div', { class: 'chart-canvas' });
  const tooltip = makeTooltip(canvas);
  wrap.append(legend(series), canvas);
  const years = series[0].points.map((p) => p.year).filter((year) => series.every((s) => s.points.some((p) => p.year === year)));
  const valueOf = (s, year) => s.points.find((p) => p.year === year).value;

  function draw(width) {
    const pad = { l: 38, r: 6, t: 8, b: 24 };
    const slot = (width - pad.l - pad.r) / years.length;
    const barW = Math.max(3, slot * 0.72);
    const y = (pct) => pad.t + (1 - pct / 100) * (height - pad.t - pad.b);
    const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, width, height, class: 'chart-svg' });
    for (const t of [0, 25, 50, 75, 100]) {
      root.append(svg('line', { x1: pad.l, x2: width - pad.r, y1: y(t), y2: y(t), class: 'gridline' }));
      root.append(svg('text', { x: pad.l - 7, y: y(t) + 4, class: 'tick', 'text-anchor': 'end', text: `${t}%` }));
    }
    const every = Math.max(1, Math.ceil(years.length / Math.max(2, Math.floor((width - pad.l) / 52))));
    years.forEach((year, i) => {
      const left = pad.l + slot * i + (slot - barW) / 2;
      let base = 0;
      series.forEach((s, k) => {
        const total = series.reduce((sum, other) => sum + valueOf(other, year), 0);
        const share = (valueOf(s, year) / total) * 100;
        root.append(svg('rect', { x: left, width: barW, y: y(base + share), height: Math.max(0, y(base) - y(base + share)), fill: SERIES_COLORS[k], class: 'col' }));
        base += share;
      });
      if ((years.length - 1 - i) % every === 0) {
        root.append(svg('text', { x: left + barW / 2, y: height - 6, class: 'tick', 'text-anchor': 'middle', text: year }));
      }
    });
    root.addEventListener('pointermove', (event) => {
      const box = root.getBoundingClientRect();
      const i = Math.min(years.length - 1, Math.max(0, Math.floor((event.clientX - box.left - pad.l) / slot)));
      const year = years[i];
      tooltip.show(pad.l + slot * i + slot / 2, event.clientY - box.top, String(year), series.map((s, k) => ({ label: s.label, text: format(valueOf(s, year)), color: SERIES_COLORS[k] })));
    });
    root.addEventListener('pointerleave', () => tooltip.hide());
    canvas.querySelector('svg')?.remove();
    canvas.prepend(root);
  }

  requestAnimationFrame(onResize(wrap, draw));
  return wrap;
}
