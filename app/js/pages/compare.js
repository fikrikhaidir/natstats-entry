// Compare page: Indonesia against nine countries on any shared indicator (ranked bars), plus a bubble chart
// of income per person against life expectancy, internet use or any other indicator.
import { COUNTRIES, INDICATORS } from '../catalog.js';
import { loadTopics, peerData } from '../data-store.js';
import { h } from '../dom.js';
import { formatValue, shorten } from '../format.js';
import { bubbleScatter } from '../charts/bubble-scatter.js';
import { rankedBars } from '../charts/ranked-bars.js';
import { csvButton } from '../ui/data-table.js';
import { pageHeader } from '../ui/page-header.js';
import { sourceChip } from '../ui/source-chip.js';
import { tabs } from '../ui/tabs.js';
import { ordinal, peerPlace } from '../insights.js';

export const title = 'Compare countries';

const CHOICES = [
  ['SP.POP.TOTL', 'Population'],
  ['NY.GDP.MKTP.CD', 'GDP'],
  ['NY.GDP.PCAP.CD', 'Income per person'],
  ['NY.GDP.MKTP.KD.ZG', 'Growth'],
  ['FP.CPI.TOTL.ZG', 'Inflation'],
  ['SL.UEM.TOTL.ZS', 'Unemployment'],
  ['SP.DYN.LE00.IN', 'Life expectancy'],
  ['SP.DYN.TFRT.IN', 'Fertility'],
  ['SH.DYN.MORT', 'Child mortality'],
  ['SP.URB.TOTL.IN.ZS', 'Urban share'],
  ['IT.NET.USER.ZS', 'Internet'],
  ['EN.GHG.CO2.PC.CE.AR5', 'CO₂ per person'],
  ['AG.LND.FRST.ZS', 'Forest'],
  ['SE.SEC.ENRR', 'Secondary school'],
  ['EG.FEC.RNEW.ZS', 'Renewable energy'],
];

const LOW_IS_BETTER = new Set(['SH.DYN.MORT', 'SL.UEM.TOTL.ZS', 'FP.CPI.TOTL.ZG']);

// "GDP per person" keeps its acronym, "Income per person" drops its capital in mid-sentence.
const plain = (label) => (/^[A-Z]{2}/.test(label) ? label : label[0].toLowerCase() + label.slice(1));

function rowsFor(code) {
  return Object.entries(peerData())
    .filter(([, data]) => data[code])
    .map(([id, data]) => ({ id, label: COUNTRIES[id].name, value: data[code][0], year: data[code][1], highlight: id === 'IDN' }));
}

function rankingCard() {
  let code = 'NY.GDP.PCAP.CD';
  const body = h('div', { class: 'rank-body' });
  const draw = () => {
    const ind = INDICATORS[code];
    const rows = rowsFor(code);
    const spot = peerPlace(code, { lowIsBetter: false });
    body.replaceChildren(
      h('p', { class: 'standing' }, h('b', {}, `Indonesia ranks ${ordinal(spot.place)} of ${spot.of}`), ` on ${plain(ind.label)} (highest first). `, ind.definition),
      rankedBars(rows, (v) => formatValue(ind, v, { short: true })),
      h('footer', { class: 'stat-foot' }, sourceChip(ind, rows[0].year), h('span', { class: 'foot-note' }, 'Years differ by country: each bar shows its latest year.')),
    );
  };
  const select = h('select', { class: 'select', 'aria-label': 'Indicator', onchange: (event) => { code = event.target.value; draw(); } },
    CHOICES.map(([id, label]) => h('option', { value: id, selected: id === code }, label)));
  const card = h('section', { class: 'card panel' },
    h('header', { class: 'panel-head' }, h('div', {}, h('h3', {}, 'Ranking'), h('p', { class: 'lede' }, 'Pick an indicator to rank all ten countries.')), h('div', { class: 'panel-controls' }, select, csvButton('country-comparison.csv', () => [['Country', 'Indicator', 'Value', 'Year'], ...Object.entries(peerData()).flatMap(([id, data]) => CHOICES.filter(([c]) => data[c]).map(([c, name]) => [COUNTRIES[id].name, name, data[c][0], data[c][1]]))]))),
    body);
  draw();
  return card;
}

function bubbleCard() {
  const yChoices = CHOICES.filter(([id]) => ['SP.DYN.LE00.IN', 'IT.NET.USER.ZS', 'SH.DYN.MORT', 'SP.URB.TOTL.IN.ZS', 'SP.DYN.TFRT.IN'].includes(id));
  let code = 'SP.DYN.LE00.IN';
  const body = h('div', { class: 'bubble-body' });
  const draw = () => {
    const ind = INDICATORS[code];
    const dots = Object.entries(peerData()).filter(([, d]) => d[code]).map(([id, d]) => ({ label: COUNTRIES[id].short, x: d['NY.GDP.PCAP.CD'][0], y: d[code][0], size: d['SP.POP.TOTL'][0], highlight: id === 'IDN' }));
    body.replaceChildren(
      bubbleScatter({ dots, xFormat: (v) => `US$${shorten(v, { decimals: 0 })}`, yFormat: (v) => `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })}${ind.suffix.startsWith('%') ? '%' : ''}`, xTitle: 'GDP per person, US$ (log scale)', yTitle: `${ind.label}${ind.suffix ? ` (${ind.suffix.trim()})` : ''}`, label: `${ind.label} against income per person` }),
      h('footer', { class: 'stat-foot' }, sourceChip(ind, 2024), h('span', { class: 'foot-note' }, 'Bubble area is population. Wealthier countries sit further right.')),
    );
  };
  draw();
  return h('section', { class: 'card panel' },
    h('header', { class: 'panel-head' }, h('div', {}, h('h3', {}, 'Income against outcomes'), h('p', { class: 'lede' }, 'Does a higher income per person go with better results?')),
      tabs(yChoices.map(([id, label]) => ({ id, label })), code, (id) => { code = id; draw(); }, 'Outcome')),
    body);
}

export async function render() {
  await loadTopics('peers');
  return h('div', { class: 'view' },
    pageHeader({ kicker: 'Compare', title: 'Indonesia and nine other countries', lede: 'Its Southeast Asian neighbours, the other giants of the developing world, and two rich economies for scale.', chips: ['10 countries', '15 indicators', 'Latest year for each'] }),
    bubbleCard(),
    rankingCard());
}
