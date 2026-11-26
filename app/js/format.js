// Number formatting for every figure on the site. Each indicator in catalog.js names a `kind`
// (how big numbers are shortened) plus a prefix, suffix and number of decimals.

const group = (value, decimals) =>
  value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const SCALES = [
  [1e12, ' trillion'],
  [1e9, ' billion'],
  [1e6, ' million'],
];

const SHORT_SCALES = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
];

// 283487931 -> "283.5 million" (long) or "283.5M" (short, for axes and tight cards).
export function shorten(value, { long = false, decimals = 1 } = {}) {
  const abs = Math.abs(value);
  for (const [limit, label] of long ? SCALES : SHORT_SCALES) {
    if (abs >= limit) return group(value / limit, decimals) + label;
  }
  return group(value, abs >= 100 ? 0 : decimals);
}

// Format a value of one indicator, e.g. formatValue(ind, 5.05) -> "5.1%".
export function formatValue(ind, value, { short = false } = {}) {
  if (value == null || Number.isNaN(value)) return 'n/a';
  const { kind, decimals = 1, prefix = '', suffix = '' } = ind;
  let body;
  if (kind === 'big') body = shorten(value, { long: !short, decimals });
  else body = group(value, decimals);
  return `${prefix}${body}${suffix}`;
}

// Signed change, used for "since 2000" style captions.
export function formatChange(ind, from, to) {
  if (from == null || to == null) return '';
  if (ind.unit === 'percent' || ind.unit === 'rate') {
    const diff = to - from;
    return `${diff >= 0 ? '+' : '−'}${group(Math.abs(diff), 1)} pts`;
  }
  if (from === 0) return '';
  const pct = ((to - from) / Math.abs(from)) * 100;
  return `${pct >= 0 ? '+' : '−'}${group(Math.abs(pct), Math.abs(pct) >= 100 ? 0 : 1)}%`;
}

export const toCsv = (rows) =>
  rows.map((row) => row.map((cell) => (/[",\n]/.test(String(cell)) ? `"${String(cell).replaceAll('"', '""')}"` : cell)).join(',')).join('\n');
