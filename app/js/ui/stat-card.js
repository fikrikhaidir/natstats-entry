// The headline figure card: label, value, change since an earlier year, a sparkline and the source chip.
// Hover, focus or tap slides up the definition and the original compiler ("shift card" reveal).
import { INDICATORS } from '../catalog.js';
import { seriesOf, latestOf, lookBack } from '../data-store.js';
import { h } from '../dom.js';
import { formatChange, formatValue } from '../format.js';
import { sparkline } from '../charts/sparkline.js';
import { sourceChip } from './source-chip.js';

// "72.8%" with the rest of the unit ("of people", "years", "per 1,000") set small beside it.
function valueParts(ind, value) {
  const number = formatValue({ ...ind, suffix: '' }, value, { short: true });
  if (ind.suffix.startsWith('%')) return [`${number}%`, ind.suffix.length > 1 ? h('small', {}, ind.suffix.slice(1)) : null];
  return [number, ind.suffix ? h('small', {}, ind.suffix) : null];
}

/** options: { size: 'hero' | 'wide' | 'small', color, yearsBack } */
export function statCard(code, { size = 'small', color = 'var(--c1)', yearsBack = 10, href } = {}) {
  const ind = INDICATORS[code];
  const last = latestOf(code);
  const before = lookBack(code, yearsBack);
  const change = before && before.year !== last.year ? `${formatChange(ind, before.value, last.value)} since ${before.year}` : '';

  const card = h(
    href ? 'a' : 'article',
    { class: `card stat stat-${size}`, tabindex: '0', ...(href ? { href } : {}) },
    h('header', { class: 'stat-head' }, h('span', { class: 'stat-label' }, ind.label), h('span', { class: 'stat-year' }, String(last.year))),
    h('p', { class: 'stat-value' }, ...valueParts(ind, last.value)),
    h('p', { class: 'stat-change' }, change),
    h('div', { class: 'stat-spark' }, sparkline(seriesOf(code), { color })),
    h('footer', { class: 'stat-foot' }, sourceChip(ind, last.year)),
    h('div', { class: 'stat-reveal', 'aria-hidden': 'true' }, h('p', {}, ind.definition), h('small', {}, `${ind.compiler} · ${ind.code}`)),
  );
  card.addEventListener('click', (event) => {
    if (!href) card.classList.toggle('is-open');
    else event.stopPropagation();
  });
  return card;
}
