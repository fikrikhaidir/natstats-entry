// Shared layout of the five topic pages: header, headline figures, "what the numbers say" notes, chart panels.
import { INDICATORS, topicOf } from '../catalog.js';
import { loadTopics, latestOf } from '../data-store.js';
import { h } from '../dom.js';
import { chartPanel } from '../ui/chart-panel.js';
import { pageHeader } from '../ui/page-header.js';
import { statCard } from '../ui/stat-card.js';

const COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)'];

/** config: { topic, kicker, title, lede, headline: [codes], panels: [chartPanel options], notes(): [string] } */
export async function renderTopic(config) {
  await loadTopics(config.topic, 'peers');
  const topic = topicOf(config.topic);
  const newest = Math.max(...Object.values(INDICATORS).filter((ind) => ind.topic === config.topic).map((ind) => latestOf(ind.code)?.year ?? 0));
  return h(
    'div',
    { class: 'view' },
    pageHeader({ kicker: topic.title, title: config.title, lede: config.lede, chips: [`Data to ${newest}`, 'World Bank WDI', 'Indonesia'] }),
    h('section', { class: 'grid grid-stats', 'aria-label': 'Headline figures' }, config.headline.map((code, i) => statCard(code, { color: COLORS[i % 4] }))),
    h(
      'section',
      { class: 'card notes' },
      h('h2', {}, 'What the numbers say'),
      h('ul', {}, config.notes().map((line) => h('li', {}, line))),
    ),
    h('section', { class: 'grid grid-panels' }, config.panels.map((panel) => chartPanel(panel))),
  );
}
