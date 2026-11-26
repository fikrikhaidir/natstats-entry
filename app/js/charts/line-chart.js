// Multi-series line chart (optionally with a filled area) drawn as SVG at the container's width,
// with a hover/keyboard crosshair that lists every series' value for the year under the pointer.
import { h, svg } from '../dom.js';
import { SERIES_COLORS, legend, makeTooltip, niceTicks, onResize } from './shared.js';

/**
 * options: { series: [{ label, color?, points: [{ year, value }] }], format(value) -> string,
 *            axisFormat?(value), height?, area?, label }
 */
export function lineChart(options) {
  const { series, format, axisFormat = format, height = 280, area = false } = options;
  const wrap = h('div', { class: 'chart', role: 'img', 'aria-label': options.label ?? 'Line chart', tabindex: '0' });
  const canvas = h('div', { class: 'chart-canvas' });
  const tooltip = makeTooltip(canvas);
  wrap.append(canvas);
  if (series.length > 1) wrap.prepend(legend(series));

  const all = series.flatMap((s) => s.points);
  const years = [...new Set(all.map((p) => p.year))].sort((a, b) => a - b);
  const values = all.map((p) => p.value);
  const lo = Math.min(...values, 0);
  const hi = Math.max(...values);
  const ticks = niceTicks(lo, hi, 4);
  const yMin = ticks[0];
  const yMax = ticks.at(-1);

  function draw(width) {
    const pad = { l: 8, r: 14, t: 12, b: 26 };
    const labelW = Math.max(...ticks.map((t) => axisFormat(t).length)) * 6.6 + 10;
    pad.l = labelW;
    const w = width;
    const x = (year) => pad.l + ((year - years[0]) / Math.max(1, years.at(-1) - years[0])) * (w - pad.l - pad.r);
    const y = (value) => pad.t + (1 - (value - yMin) / (yMax - yMin)) * (height - pad.t - pad.b);
    const root = svg('svg', { viewBox: `0 0 ${w} ${height}`, width: w, height, class: 'chart-svg' });

    for (const t of ticks) {
      root.append(svg('line', { x1: pad.l, x2: w - pad.r, y1: y(t), y2: y(t), class: 'gridline' }));
      root.append(svg('text', { x: pad.l - 8, y: y(t) + 4, class: 'tick', 'text-anchor': 'end', text: axisFormat(t) }));
    }
    const every = Math.max(1, Math.ceil(years.length / Math.max(2, Math.floor((w - pad.l) / 64))));
    years.forEach((year, i) => {
      if ((years.length - 1 - i) % every === 0) {
        root.append(svg('text', { x: x(year), y: height - 6, class: 'tick', 'text-anchor': i === 0 ? 'start' : i === years.length - 1 ? 'end' : 'middle', text: year }));
      }
    });

    series.forEach((s, i) => {
      const color = s.color ?? SERIES_COLORS[i];
      const path = s.points.map((p, j) => `${j ? 'L' : 'M'}${x(p.year).toFixed(1)} ${y(p.value).toFixed(1)}`).join('');
      if (area) {
        const first = s.points[0];
        const last = s.points.at(-1);
        root.append(svg('path', { d: `${path}L${x(last.year).toFixed(1)} ${y(yMin)}L${x(first.year).toFixed(1)} ${y(yMin)}Z`, fill: color, class: 'area' }));
      }
      root.append(svg('path', { d: path, stroke: color, class: 'line' }));
      const end = s.points.at(-1);
      root.append(svg('circle', { cx: x(end.year), cy: y(end.value), r: 3.5, fill: color, class: 'end-dot' }));
    });

    const cross = svg('line', { y1: pad.t, y2: height - pad.b, class: 'cross', visibility: 'hidden' });
    const dots = series.map((s, i) => svg('circle', { r: 4.5, fill: s.color ?? SERIES_COLORS[i], class: 'hover-dot', visibility: 'hidden' }));
    root.append(cross, ...dots);

    const move = (year) => {
      const px = x(year);
      cross.setAttribute('x1', px);
      cross.setAttribute('x2', px);
      cross.setAttribute('visibility', 'visible');
      const rows = [];
      series.forEach((s, i) => {
        const point = s.points.find((p) => p.year === year);
        dots[i].setAttribute('visibility', point ? 'visible' : 'hidden');
        if (point) {
          dots[i].setAttribute('cx', px);
          dots[i].setAttribute('cy', y(point.value));
          rows.push({ label: s.label, text: format(point.value), color: s.color ?? SERIES_COLORS[i] });
        }
      });
      if (rows.length) tooltip.show(px, pad.t + 20, String(year), rows);
    };
    const leave = () => {
      cross.setAttribute('visibility', 'hidden');
      dots.forEach((d) => d.setAttribute('visibility', 'hidden'));
      tooltip.hide();
    };
    root.addEventListener('pointermove', (event) => {
      const box = root.getBoundingClientRect();
      const guess = years[0] + ((event.clientX - box.left - pad.l) / (w - pad.l - pad.r)) * (years.at(-1) - years[0]);
      move(years.reduce((best, year) => (Math.abs(year - guess) < Math.abs(best - guess) ? year : best)));
    });
    root.addEventListener('pointerleave', leave);
    let index = years.length - 1;
    wrap.onkeydown = (event) => {
      if (event.key === 'ArrowLeft') index = Math.max(0, index - 1);
      else if (event.key === 'ArrowRight') index = Math.min(years.length - 1, index + 1);
      else if (event.key === 'Escape') return leave();
      else return;
      event.preventDefault();
      move(years[index]);
    };
    wrap.onblur = leave;
    canvas.querySelector('svg')?.remove();
    canvas.prepend(root);
  }

  const start = onResize(wrap, draw);
  requestAnimationFrame(start);
  return wrap;
}
