// Overview: the whole country on one screen. A population hero, headline figure cards, a peer snapshot
// and a door into each topic page.
import { COUNTRIES, INDICATORS, TOPICS } from '../catalog.js';
import { latestOf, loadEverything, peerData, seriesOf } from '../data-store.js';
import { h } from '../dom.js';
import { axisShort, formatValue } from '../format.js';
import { lineChart } from '../charts/line-chart.js';
import { rankedBars } from '../charts/ranked-bars.js';
import { TOPIC_PATH, hrefTo } from '../routes.js';
import { icon } from '../ui/icons.js';
import { pageHeader } from '../ui/page-header.js';
import { sourceChip } from '../ui/source-chip.js';
import { statCard } from '../ui/stat-card.js';
import { tabs } from '../ui/tabs.js';

export const title = 'Overview';

const TILE_FIGURE = {
  people: 'SP.URB.TOTL.IN.ZS',
  economy: 'NY.GDP.MKTP.KD.ZG',
  labour: 'SL.UEM.TOTL.ZS',
  wellbeing: 'SP.DYN.LE00.IN',
  environment: 'IT.NET.USER.ZS',
};

function heroCard() {
  const pop = INDICATORS['SP.POP.TOTL'];
  const last = latestOf('SP.POP.TOTL');
  const first = seriesOf('SP.POP.TOTL')[0];
  const chartSlot = h('div', { class: 'hero-chart' });
  const show = (code) => {
    const ind = INDICATORS[code];
    chartSlot.replaceChildren(
      lineChart({
        series: [{ label: ind.label, points: seriesOf(code) }],
        format: (v) => formatValue(ind, v),
        axisFormat: (v) => (ind.kind === 'big' ? `${ind.prefix}${axisShort(v)}` : `${ind.prefix}${v.toLocaleString('en-US')}`),
        area: true,
        height: 140,
        label: `${ind.label}, ${first.year} to ${last.year}`,
      }),
    );
  };
  show('SP.POP.TOTL');
  return h(
    'section',
    { class: 'card hero' },
    h('div', { class: 'hero-top' },
      h('div', {},
        h('p', { class: 'stat-label' }, 'Population, mid-', last.year),
        h('p', { class: 'hero-value' }, formatValue(pop, last.value), h('small', {}, ' people')),
        h('p', { class: 'stat-change' }, `Up from ${formatValue(pop, first.value)} in ${first.year}`)),
      tabs([{ id: 'SP.POP.TOTL', label: 'Population' }, { id: 'NY.GDP.MKTP.CD', label: 'GDP' }, { id: 'NY.GDP.PCAP.CD', label: 'Income' }], 'SP.POP.TOTL', show, 'Chart')),
    chartSlot,
    h('footer', { class: 'stat-foot' }, sourceChip(pop, last.year), h('span', { class: 'foot-note' }, 'Hover or use ← → on the chart')),
  );
}

function peerCard() {
  const code = 'NY.GDP.PCAP.CD';
  const ind = INDICATORS[code];
  const items = Object.entries(peerData()).map(([id, data]) => ({ label: COUNTRIES[id].short, value: data[code][0], year: data[code][1], highlight: id === 'IDN' }));
  return h(
    'section',
    { class: 'card peer-card' },
    h('header', { class: 'panel-head' }, h('div', {}, h('h3', {}, 'Income per person, ten countries'), h('p', { class: 'lede' }, 'GDP per person, current US$'))),
    rankedBars(items, (v) => formatValue(ind, v)),
    h('footer', { class: 'stat-foot' }, sourceChip(ind, items[0].year), h('a', { class: 'link', href: hrefTo('/compare') }, 'Compare on any indicator ', icon('arrow', 14))),
  );
}

function topicTiles() {
  return h(
    'section',
    { class: 'grid grid-tiles', 'aria-label': 'Topics' },
    TOPICS.map((topic) => {
      const ind = INDICATORS[TILE_FIGURE[topic.id]];
      const last = latestOf(ind.code);
      return h(
        'a',
        { class: 'card tile', href: hrefTo(TOPIC_PATH[topic.id]) },
        h('h3', {}, topic.title, icon('arrow', 16)),
        h('p', {}, topic.blurb),
        h('p', { class: 'tile-fig' }, h('b', {}, formatValue(ind, last.value)), h('span', {}, ` ${ind.label.toLowerCase()}, ${last.year}`)),
      );
    }),
  );
}

export async function render() {
  await loadEverything();
  const updated = '2026-11';
  return h(
    'div',
    { class: 'view' },
    pageHeader({
      title: 'Indonesia in numbers',
      lede: 'Population, economy, work, health and environment: every figure with its source and year.',
      chips: [`World Bank data release ${updated}`, 'Latest year: 2025', 'Compared with 9 countries'],
    }),
    h(
      'section',
      { class: 'bento', 'aria-label': 'Headline figures' },
      heroCard(),
      statCard('NY.GDP.MKTP.CD', { color: 'var(--c2)', size: 'small' }),
      statCard('NY.GDP.PCAP.CD', { color: 'var(--c3)', size: 'small' }),
      statCard('SP.DYN.LE00.IN', { color: 'var(--c4)', size: 'small' }),
      statCard('IT.NET.USER.ZS', { color: 'var(--c5)', size: 'small' }),
      statCard('FP.CPI.TOTL.ZG', { color: 'var(--c2)', size: 'small' }),
      statCard('SL.UEM.TOTL.ZS', { color: 'var(--c3)', size: 'small' }),
      statCard('SP.DYN.TFRT.IN', { color: 'var(--c4)', size: 'small' }),
      statCard('SI.POV.DDAY', { color: 'var(--c5)', size: 'small' }),
    ),
    h('div', { class: 'split' }, peerCard(), topicTiles()),
  );
}
