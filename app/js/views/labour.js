// Work & poverty page: who has a job, in which sector, and how many live below the extreme poverty line.
import { renderTopic } from './topic-page.js';
import { trendSentence } from '../insights.js';
import { latestOf, seriesOf } from '../data-store.js';

export const title = 'Work & poverty';

export const render = () =>
  renderTopic({
    topic: 'labour',
    title: 'Jobs, pay-packets and poverty',
    lede: 'Unemployment is low and farm work is shrinking as jobs move to factories and services. Extreme poverty has fallen sharply.',
    headline: ['SL.UEM.TOTL.ZS', 'SL.TLF.CACT.ZS', 'SL.TLF.CACT.FE.ZS', 'SI.POV.DDAY'],
    notes: () => {
      const gap = latestOf('SL.TLF.CACT.ZS').value - latestOf('SL.TLF.CACT.FE.ZS').value;
      return [
        trendSentence('SL.UEM.TOTL.ZS'),
        `Agriculture employed ${seriesOf('SL.AGR.EMPL.ZS')[0].value}% of workers in 2000 and ${latestOf('SL.AGR.EMPL.ZS').value}% in ${latestOf('SL.AGR.EMPL.ZS').year}; services now employ ${latestOf('SL.SRV.EMPL.ZS').value}%.`,
        `Women's participation (${latestOf('SL.TLF.CACT.FE.ZS').value}%) trails the overall rate by ${gap.toFixed(1)} points.`,
        `${trendSentence('SI.POV.DDAY')} The line is US$3.00 a day in 2021 prices.`,
        'Employment figures are ILO modelled estimates, so they can differ from the national labour force survey.',
      ];
    },
    panels: [
      { title: 'Unemployment', lede: 'Share of the labour force looking for work.', mode: 'pick', codes: ['SL.UEM.TOTL.ZS'], area: true },
      { title: 'Taking part in work', lede: 'Labour force participation, all adults and women.', mode: 'together', codes: ['SL.TLF.CACT.ZS', 'SL.TLF.CACT.FE.ZS'], labels: { 'SL.TLF.CACT.ZS': 'All adults', 'SL.TLF.CACT.FE.ZS': 'Women' } },
      { title: 'Where people work', lede: 'Share of jobs by sector.', mode: 'stack', codes: ['SL.AGR.EMPL.ZS', 'SL.IND.EMPL.ZS', 'SL.SRV.EMPL.ZS'], labels: { 'SL.AGR.EMPL.ZS': 'Agriculture', 'SL.IND.EMPL.ZS': 'Industry', 'SL.SRV.EMPL.ZS': 'Services' } },
      { title: 'Extreme poverty', lede: 'People living on less than US$3.00 a day.', mode: 'pick', codes: ['SI.POV.DDAY'], area: true },
    ],
  });
