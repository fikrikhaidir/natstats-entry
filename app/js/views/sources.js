// Sources & method: where every number comes from, how it was handled, what to be careful about,
// and a full indicator register with codes, compilers and the years covered.
import { INDICATORS, TOPICS, indicatorsOfTopic } from '../catalog.js';
import { dataUpdated, loadEverything, seriesOf } from '../data-store.js';
import { h } from '../dom.js';
import { toast } from '../ui/toast.js';
import { dataTable } from '../ui/data-table.js';
import { pageHeader } from '../ui/page-header.js';

export const title = 'Sources & method';

const cite = (updated) => `World Bank. World Development Indicators, data release ${updated}. Presented by Nusa Numbers (independent), accessed November 2026.`;

export async function render() {
  await loadEverything();
  const updated = dataUpdated();
  const rows = TOPICS.flatMap((topic) =>
    indicatorsOfTopic(topic.id).map((ind) => {
      const pts = seriesOf(ind.code);
      return [ind.label, ind.code, ind.compiler, `${pts[0].year}–${pts.at(-1).year}`, ind.definition];
    }),
  );
  return h('div', { class: 'view' },
    pageHeader({ kicker: 'Sources & method', title: 'Where the numbers come from', lede: 'Open data, shown as published. This page says what was used, what was done to it and where to be careful.', chips: [`WDI release ${updated}`, `${Object.keys(INDICATORS).length} indicators`, 'Open licence CC BY 4.0'] }),
    h('section', { class: 'grid grid-two' },
      h('article', { class: 'card prose' }, h('h2', {}, 'Method'),
        h('ul', {},
          h('li', {}, 'All figures come from the World Bank’s World Development Indicators (WDI), which gathers series compiled by the agencies named beside each indicator.'),
          h('li', {}, 'Nothing is adjusted: values are the published ones, rounded for display. Missing years stay missing and show as gaps, never as zero.'),
          h('li', {}, 'Money is in current US dollars unless a label says otherwise, so it moves with exchange rates and inflation.'),
          h('li', {}, 'On the compare page each country shows its latest available year, so years can differ a little. The year sits beside every bar.'),
          h('li', {}, 'Nusa Numbers is an independent presentation. It is not Statistics Indonesia (BPS) and does not replace official releases.'))),
      h('article', { class: 'card prose' }, h('h2', {}, 'Read with care'),
        h('ul', {},
          h('li', {}, 'The newest years are often estimates or projections and are revised in later releases.'),
          h('li', {}, 'Labour and demographic figures are modelled by the ILO and the UN, so they can differ from national surveys and censuses.'),
          h('li', {}, 'Poverty is measured at US$3.00 a day in 2021 prices, an international line, not Indonesia’s national poverty line.'),
          h('li', {}, 'Education spending changes definition in 2016. Do not read the drop as a cut.'),
          h('li', {}, 'Stunting, literacy and similar survey-based series are not annual; the charts connect the years that exist.')),
        h('h2', {}, 'How to cite'),
        h('p', { class: 'cite' }, cite(updated)),
        h('button', { class: 'btn', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(cite(updated)); toast('Citation copied'); } catch { toast('Select the citation text to copy it'); } } }, 'Copy citation'))),
    h('section', { class: 'card' },
      h('div', { class: 'panel-head' }, h('div', {}, h('h2', {}, 'Indicator register'), h('p', { class: 'lede' }, 'Every indicator on the site, with its World Bank code and the years it covers.'))),
      dataTable([{ label: 'Indicator', align: 'left' }, { label: 'Code' }, { label: 'Compiled by' }, { label: 'Years' }, { label: 'Definition' }], rows, 'Indicator register')));
}
