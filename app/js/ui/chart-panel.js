// A chart card used on every topic page: title, optional indicator picker, 10-year/all-years range,
// chart/table switch, CSV download and the source line. Modes:
//   'pick'     one chart, tabs choose which indicator
//   'together' several indicators as lines on one chart
//   'stack'    shares that add up to 100%, as stacked columns
import { INDICATORS } from '../catalog.js';
import { seriesOf } from '../data-store.js';
import { h } from '../dom.js';
import { formatValue, shorten } from '../format.js';
import { lineChart } from '../charts/line-chart.js';
import { stackedColumns } from '../charts/stacked-columns.js';
import { csvButton, dataTable } from './data-table.js';
import { sourceLine } from './source-chip.js';
import { tabs } from './tabs.js';

const axisFor = (ind) => (value) => (ind.kind === 'big' ? shorten(value, { decimals: 0 }).replace(/^/, ind.prefix) : `${ind.prefix}${value.toLocaleString('en-US', { maximumFractionDigits: ind.decimals > 0 ? 1 : 0 })}${ind.suffix.startsWith('%') ? '%' : ''}`);

function trim(points, range) {
  return range === 'all' ? points : points.filter((p) => p.year > points.at(-1).year - Number(range));
}

export function chartPanel({ title, lede, mode = 'pick', codes, area = false, labels = {} }) {
  const state = { code: codes[0], range: 'all', view: 'chart' };
  const body = h('div', { class: 'panel-body' });
  const nameOf = (code) => labels[code] ?? INDICATORS[code].label;

  function activeCodes() {
    return mode === 'pick' ? [state.code] : codes;
  }

  function rowsForTable() {
    const lists = activeCodes().map((code) => trim(seriesOf(code), state.range));
    const years = [...new Set(lists.flat().map((p) => p.year))].sort((a, b) => b - a);
    return years.map((year) => [String(year), ...activeCodes().map((code, i) => { const p = lists[i].find((q) => q.year === year); return p ? formatValue(INDICATORS[code], p.value) : 'n/a'; })]);
  }

  function draw() {
    const shown = activeCodes();
    const first = INDICATORS[shown[0]];
    let content;
    if (state.view === 'table') {
      content = dataTable([{ label: 'Year', align: 'left' }, ...shown.map((code) => ({ label: nameOf(code) }))], rowsForTable(), `${title}, by year`);
    } else if (mode === 'stack') {
      content = stackedColumns({ series: shown.map((code) => ({ label: nameOf(code), points: trim(seriesOf(code), state.range) })), format: (v) => formatValue(first, v), label: title });
    } else {
      content = lineChart({
        series: shown.map((code) => ({ label: nameOf(code), points: trim(seriesOf(code), state.range) })),
        format: (v) => formatValue(INDICATORS[shown[0]], v),
        axisFormat: axisFor(first),
        area: area && shown.length === 1,
        label: `${title}: ${shown.map(nameOf).join(', ')}`,
      });
    }
    const years = Math.max(...shown.map((code) => seriesOf(code).at(-1).year));
    body.replaceChildren(content, sourceLine(shown, years), h('p', { class: 'source-line' }, [...new Set(shown.map((code) => INDICATORS[code].compiler))].join(' · ')));
  }

  const controls = h('div', { class: 'panel-controls' });
  if (mode === 'pick' && codes.length > 1) {
    controls.append(tabs(codes.map((code) => ({ id: code, label: nameOf(code) })), state.code, (id) => { state.code = id; draw(); }, 'Indicator'));
  }
  controls.append(
    tabs([{ id: 'all', label: 'All years' }, { id: '10', label: '10 years' }], 'all', (id) => { state.range = id; draw(); }, 'Range'),
    tabs([{ id: 'chart', label: 'Chart' }, { id: 'table', label: 'Table' }], 'chart', (id) => { state.view = id; draw(); }, 'View'),
    csvButton(`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`, () => [['Year', ...activeCodes().map(nameOf)], ...rowsForTable().reverse()]),
  );

  const panel = h('section', { class: 'card panel' }, h('header', { class: 'panel-head' }, h('div', {}, h('h3', {}, title), lede && h('p', { class: 'lede' }, lede)), controls), body);
  draw();
  return panel;
}
