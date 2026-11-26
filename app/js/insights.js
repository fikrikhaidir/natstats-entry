// Plain-language sentences computed from the data itself, so the words on a page can never drift
// from the numbers beside them.
import { INDICATORS } from './catalog.js';
import { latestOf, pointAt, seriesOf, peerData } from './data-store.js';
import { formatChange, formatValue } from './format.js';

const PEER_ORDER = ['IDN', 'IND', 'VNM', 'THA', 'PHL', 'MYS', 'BRA', 'NGA', 'JPN', 'USA'];

// "GDP per person was US$4,876 in 2024, +62% since 2014."
export function trendSentence(code, fromYear) {
  const ind = INDICATORS[code];
  const last = latestOf(code);
  const first = fromYear ? pointAt(code, fromYear) ?? seriesOf(code).find((p) => p.year >= fromYear) : seriesOf(code)[0];
  const now = formatValue(ind, last.value);
  if (!first || first.year === last.year) return `${ind.label} was ${now} in ${last.year}.`;
  return `${ind.label} was ${now} in ${last.year}, against ${formatValue(ind, first.value)} in ${first.year} (${formatChange(ind, first.value, last.value)}).`;
}

// Where Indonesia stands among the ten countries on the compare page: { place, of, best, bestName }.
export function peerPlace(code, { lowIsBetter = false } = {}) {
  const peers = peerData();
  const rows = PEER_ORDER.map((id) => ({ id, point: peers[id]?.[code] })).filter((row) => row.point);
  rows.sort((a, b) => (lowIsBetter ? a.point[0] - b.point[0] : b.point[0] - a.point[0]));
  const place = rows.findIndex((row) => row.id === 'IDN') + 1;
  return { place, of: rows.length, top: rows[0] };
}

export const ordinal = (n) => `${n}${['th', 'st', 'nd', 'rd'][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10 < 4 ? n % 10 : 0]}`;

// Peak and trough years of a series, for notes such as "highest in 2005".
export function extremes(code) {
  const points = seriesOf(code);
  const high = points.reduce((a, b) => (b.value > a.value ? b : a));
  const low = points.reduce((a, b) => (b.value < a.value ? b : a));
  return { high, low };
}
