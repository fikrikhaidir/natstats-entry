// Data explorer: pick any indicator and a year range, read it as a chart, a table or a CSV file.
// The chosen indicator lives in the address (#/explorer?i=SP.POP.TOTL) so a view can be shared.
import { INDICATORS, TOPICS, indicatorsOfTopic } from '../catalog.js';
import { loadEverything, seriesOf } from '../data-store.js';
import { h } from '../dom.js';
import { axisShort, formatChange, formatValue } from '../format.js';
import { lineChart } from '../charts/line-chart.js';
import { csvButton, dataTable } from '../ui/data-table.js';
import { pageHeader } from '../ui/page-header.js';
import { sourceChip } from '../ui/source-chip.js';
import { tabs } from '../ui/tabs.js';

export const title = 'Data explorer';

export async function render({ query }) {
  await loadEverything();
  const state = { code: INDICATORS[query.get('i')] ? query.get('i') : 'NY.GDP.PCAP.CD', from: 0, to: 9999, view: 'chart' };
  const out = h('div', { class: 'explorer-out' });
  const fromSel = h('select', { class: 'select', 'aria-label': 'From year', onchange: (e) => { state.from = Number(e.target.value); draw(); } });
  const toSel = h('select', { class: 'select', 'aria-label': 'To year', onchange: (e) => { state.to = Number(e.target.value); draw(); } });

  const picker = h('select', { class: 'select select-wide', 'aria-label': 'Indicator', onchange: (e) => { state.code = e.target.value; state.from = 0; state.to = 9999; history.replaceState(null, '', `#/explorer?i=${state.code}`); fillYears(); draw(); } },
    TOPICS.map((topic) => h('optgroup', { label: topic.title }, indicatorsOfTopic(topic.id).map((ind) => h('option', { value: ind.code, selected: ind.code === state.code }, ind.label)))));

  function fillYears() {
    const years = seriesOf(state.code).map((p) => p.year);
    state.from = years[0];
    state.to = years.at(-1);
    fromSel.replaceChildren(...years.map((y) => h('option', { value: y, selected: y === state.from }, y)));
    toSel.replaceChildren(...years.map((y) => h('option', { value: y, selected: y === state.to }, y)));
  }

  function draw() {
    const ind = INDICATORS[state.code];
    const all = seriesOf(state.code);
    const points = all.filter((p) => p.year >= state.from && p.year <= state.to);
    if (points.length < 2) {
      out.replaceChildren(h('p', { class: 'notice' }, 'Choose a start year before the end year.'));
      return;
    }
    const first = points[0];
    const last = points.at(-1);
    const high = points.reduce((a, b) => (b.value > a.value ? b : a));
    const low = points.reduce((a, b) => (b.value < a.value ? b : a));
    const stat = (label, value, note) => h('div', { class: 'mini-stat' }, h('span', {}, label), h('b', {}, value), h('small', {}, note));
    const body =
      state.view === 'table'
        ? dataTable([{ label: 'Year', align: 'left' }, { label: ind.label }], [...points].reverse().map((p) => [String(p.year), formatValue(ind, p.value)]), ind.label)
        : lineChart({ series: [{ label: ind.label, points }], format: (v) => formatValue(ind, v), axisFormat: (v) => (ind.kind === 'big' ? `${ind.prefix}${axisShort(v)}` : `${ind.prefix}${v.toLocaleString('en-US', { maximumFractionDigits: 1 })}${ind.suffix.startsWith('%') ? '%' : ''}`), area: true, label: `${ind.label}, ${first.year} to ${last.year}` });
    out.replaceChildren(
      h('div', { class: 'mini-stats' },
        stat(`${last.year}`, formatValue(ind, last.value), 'latest in range'),
        stat('Change', formatChange(ind, first.value, last.value) || 'n/a', `${first.year} to ${last.year}`),
        stat('Highest', formatValue(ind, high.value), String(high.year)),
        stat('Lowest', formatValue(ind, low.value), String(low.year))),
      body,
      h('p', { class: 'source-line' }, h('b', {}, 'Definition '), ind.definition),
      h('p', { class: 'source-line' }, h('b', {}, 'Source '), `${ind.source}; World Bank indicator ${ind.code}; ${all.length} yearly values from ${all[0].year} to ${all.at(-1).year}.`),
    );
    exportRows = [['Year', ind.label, 'Source', 'Indicator code'], ...points.map((p) => [p.year, p.value, ind.source, ind.code])];
    heading.replaceChildren(h('h3', {}, ind.label), h('p', { class: 'lede' }, ind.definition), sourceChip(ind, all.at(-1).year));
  }

  let exportRows = [];
  const heading = h('div', {});
  fillYears();
  const card = h('section', { class: 'card panel' },
    h('header', { class: 'panel-head' }, heading,
      h('div', { class: 'panel-controls' },
        tabs([{ id: 'chart', label: 'Chart' }, { id: 'table', label: 'Table' }], 'chart', (id) => { state.view = id; draw(); }, 'View'),
        csvButton('nusa-numbers-indicator.csv', () => exportRows))),
    h('div', { class: 'explorer-controls' },
      h('label', {}, h('span', {}, 'Indicator'), picker),
      h('label', {}, h('span', {}, 'From'), fromSel),
      h('label', {}, h('span', {}, 'To'), toSel)),
    out);
  draw();
  return h('div', { class: 'view' }, pageHeader({ kicker: 'Explorer', title: 'Every indicator, every year', lede: `${Object.keys(INDICATORS).length} indicators for Indonesia, 2000 onwards. Pick one, narrow the years, then read it as a chart or table or download the CSV.`, chips: ['Shareable link', 'CSV export'] }), card);
}
