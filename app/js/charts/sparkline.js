// A tiny trend line for stat cards: stretches to its container, no axes, last point marked.
import { svg } from '../dom.js';

export function sparkline(points, { color = 'var(--c1)', fill = true } = {}) {
  const W = 120;
  const H = 36;
  const values = points.map((p) => p.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const x = (i) => 2 + (i / Math.max(1, points.length - 1)) * (W - 8);
  const y = (v) => 4 + (1 - (v - lo) / span) * (H - 10);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join('');
  const last = points.length - 1;
  return svg(
    'svg',
    { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', class: 'sparkline', 'aria-hidden': 'true' },
    fill && svg('path', { d: `${path}L${x(last)} ${H}L${x(0)} ${H}Z`, fill: color, class: 'spark-area' }),
    svg('path', { d: path, stroke: color, class: 'spark-line', 'vector-effect': 'non-scaling-stroke' }),
    svg('circle', { cx: x(last), cy: y(points[last].value), r: 2.6, fill: color }),
  );
}
