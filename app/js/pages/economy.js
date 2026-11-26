// Economy page: size and income, growth and prices, trade, and what the economy is made of.
import { renderTopic } from './topic-page.js';
import { extremes, trendSentence } from '../insights.js';
import { latestOf, seriesOf } from '../data-store.js';

export const title = 'Economy';

export const render = () =>
  renderTopic({
    topic: 'economy',
    title: 'How the economy is doing',
    lede: 'A US$1.4 trillion economy that has grown for two decades bar the 2020 shock, with services overtaking industry as its biggest sector.',
    headline: ['NY.GDP.MKTP.CD', 'NY.GDP.PCAP.CD', 'NY.GDP.MKTP.KD.ZG', 'FP.CPI.TOTL.ZG'],
    notes: () => {
      const growth = seriesOf('NY.GDP.MKTP.KD.ZG');
      const low = extremes('NY.GDP.MKTP.KD.ZG').low;
      const peak = extremes('FP.CPI.TOTL.ZG').high;
      return [
        trendSentence('NY.GDP.MKTP.CD'),
        trendSentence('NY.GDP.PCAP.CD'),
        `Growth ran between ${Math.min(...growth.filter((p) => p.year !== low.year).map((p) => p.value))}% and ${Math.max(...growth.map((p) => p.value))}% in most years; the weakest year was ${low.year} at ${low.value}%.`,
        `Inflation peaked at ${peak.value}% in ${peak.year} and was ${latestOf('FP.CPI.TOTL.ZG').value}% in ${latestOf('FP.CPI.TOTL.ZG').year}.`,
        `Exports were ${latestOf('NE.EXP.GNFS.ZS').value}% of GDP in ${latestOf('NE.EXP.GNFS.ZS').year}, down from ${seriesOf('NE.EXP.GNFS.ZS')[0].value}% in 2000: growth leans more on domestic demand.`,
      ];
    },
    panels: [
      { title: 'Output and income', lede: 'GDP in current US dollars, or per person.', mode: 'pick', codes: ['NY.GDP.MKTP.CD', 'NY.GDP.PCAP.CD'], area: true },
      { title: 'Growth', lede: 'Yearly change in real GDP.', mode: 'pick', codes: ['NY.GDP.MKTP.KD.ZG', 'FP.CPI.TOTL.ZG'] },
      { title: 'Trade', lede: 'Exports and imports as a share of GDP.', mode: 'together', codes: ['NE.EXP.GNFS.ZS', 'NE.IMP.GNFS.ZS'] },
      { title: 'What the economy is made of', lede: 'Value added by sector, rescaled to 100% of the three sectors.', mode: 'stack', codes: ['NV.AGR.TOTL.ZS', 'NV.IND.TOTL.ZS', 'NV.SRV.TOTL.ZS'], labels: { 'NV.AGR.TOTL.ZS': 'Agriculture', 'NV.IND.TOTL.ZS': 'Industry', 'NV.SRV.TOTL.ZS': 'Services' } },
      { title: 'Foreign direct investment', lede: 'Net inflows as a share of GDP.', mode: 'pick', codes: ['BX.KLT.DINV.WD.GD.ZS'], area: true },
    ],
  });
