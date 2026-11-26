// Health & learning page: how long people live, child survival and nutrition, school and the money spent on both.
import { renderTopic } from './topic-page.js';
import { trendSentence } from '../insights.js';
import { latestOf, seriesOf } from '../data-store.js';

export const title = 'Health & learning';

export const render = () =>
  renderTopic({
    topic: 'wellbeing',
    title: 'Health, nutrition and school',
    lede: 'Children now survive far more often and stay in school longer, though stunting remains common and spending is modest.',
    headline: ['SP.DYN.LE00.IN', 'SH.DYN.MORT', 'SH.STA.STNT.ZS', 'SE.SEC.ENRR'],
    notes: () => [
      trendSentence('SP.DYN.LE00.IN'),
      trendSentence('SH.DYN.MORT'),
      `${trendSentence('SH.STA.STNT.ZS')} Surveys are not annual, so the line has gaps.`,
      `Health spending was ${latestOf('SH.XPD.CHEX.GD.ZS').value}% of GDP in ${latestOf('SH.XPD.CHEX.GD.ZS').year}; education spending ${latestOf('SE.XPD.TOTL.GD.ZS').value}% in ${latestOf('SE.XPD.TOTL.GD.ZS').year} (the education series changed definition in 2016).`,
      `Adult literacy reached ${latestOf('SE.ADT.LITR.ZS').value}% in ${latestOf('SE.ADT.LITR.ZS').year}, up from ${seriesOf('SE.ADT.LITR.ZS')[0].value}% in ${seriesOf('SE.ADT.LITR.ZS')[0].year}.`,
    ],
    panels: [
      { title: 'Living longer', lede: 'Life expectancy at birth.', mode: 'pick', codes: ['SP.DYN.LE00.IN'], area: true },
      { title: 'Child survival', lede: 'Deaths per 1,000 live births.', mode: 'together', codes: ['SH.DYN.MORT', 'SP.DYN.IMRT.IN'], labels: { 'SH.DYN.MORT': 'Under five', 'SP.DYN.IMRT.IN': 'Under one' } },
      { title: 'Nutrition and literacy', lede: 'Child stunting, adult literacy.', mode: 'pick', codes: ['SH.STA.STNT.ZS', 'SE.ADT.LITR.ZS'] },
      { title: 'School enrolment', lede: 'Gross secondary enrolment.', mode: 'pick', codes: ['SE.SEC.ENRR'], area: true },
      { title: 'Public and private spending', lede: 'Health and education as a share of GDP.', mode: 'together', codes: ['SH.XPD.CHEX.GD.ZS', 'SE.XPD.TOTL.GD.ZS'], labels: { 'SH.XPD.CHEX.GD.ZS': 'Health', 'SE.XPD.TOTL.GD.ZS': 'Education' } },
    ],
  });
