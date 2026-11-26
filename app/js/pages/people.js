// People page: how many Indonesians there are, how fast that is changing, who they are and where they live.
import { renderTopic } from './topic-page.js';
import { trendSentence } from '../insights.js';
import { latestOf, seriesOf } from '../data-store.js';

export const title = 'People';

export const render = () =>
  renderTopic({
    topic: 'people',
    title: 'Who lives in Indonesia',
    lede: 'The fourth most populous country is still growing, but more slowly each decade, and it is becoming older and more urban.',
    headline: ['SP.POP.TOTL', 'SP.POP.GROW', 'SP.URB.TOTL.IN.ZS', 'SP.DYN.TFRT.IN'],
    notes: () => {
      const young = latestOf('SP.POP.0014.TO.ZS');
      const old = latestOf('SP.POP.65UP.TO.ZS');
      const gap = latestOf('SP.DYN.CBRT.IN').value - latestOf('SP.DYN.CDRT.IN').value;
      return [
        trendSentence('SP.POP.TOTL'),
        `Growth has slowed from ${seriesOf('SP.POP.GROW')[0].value}% a year in 2000 to ${latestOf('SP.POP.GROW').value}% in ${latestOf('SP.POP.GROW').year}.`,
        trendSentence('SP.URB.TOTL.IN.ZS'),
        `Children aged 0–14 are ${young.value}% of people in ${young.year}; those aged 65 and over are ${old.value}%, up from ${seriesOf('SP.POP.65UP.TO.ZS')[0].value}% in 2000.`,
        `Births outnumber deaths by ${gap.toFixed(1)} per 1,000 people in ${latestOf('SP.DYN.CBRT.IN').year}, which is what still drives natural increase.`,
      ];
    },
    panels: [
      { title: 'Population and growth', lede: 'Total residents, or the yearly pace of change.', mode: 'pick', codes: ['SP.POP.TOTL', 'SP.POP.GROW', 'EN.POP.DNST'], area: true },
      { title: 'Age structure', lede: 'Young and old as a share of all people.', mode: 'together', codes: ['SP.POP.0014.TO.ZS', 'SP.POP.65UP.TO.ZS'] },
      { title: 'Births and deaths', lede: 'Per 1,000 people each year.', mode: 'together', codes: ['SP.DYN.CBRT.IN', 'SP.DYN.CDRT.IN'] },
      { title: 'Urban share and fertility', lede: 'Moving to cities, having fewer children.', mode: 'pick', codes: ['SP.URB.TOTL.IN.ZS', 'SP.DYN.TFRT.IN'], area: true },
    ],
  });
