// Horizontal ranked bars in plain HTML: one row per country, the highlighted one picked out.
import { h } from '../dom.js';

/** items: [{ label, value, year, highlight? }]; format(value) -> string. Sorted high to low. */
export function rankedBars(items, format, { ascending = false } = {}) {
  const rows = items.filter((item) => item.value != null).sort((a, b) => (ascending ? a.value - b.value : b.value - a.value));
  const top = Math.max(...rows.map((row) => Math.abs(row.value)), 1e-9);
  return h(
    'ol',
    { class: 'ranked' },
    rows.map((row, i) =>
      h(
        'li',
        { class: row.highlight ? 'is-home' : '' },
        h('span', { class: 'rank-n' }, String(i + 1)),
        h('span', { class: 'rank-label' }, row.label),
        h('span', { class: 'rank-track' }, h('span', { class: 'rank-fill', style: { width: `${Math.max(1.5, (Math.abs(row.value) / top) * 100)}%` } })),
        h('span', { class: 'rank-value' }, format(row.value), h('small', {}, ` ${row.year}`)),
      ),
    ),
  );
}
