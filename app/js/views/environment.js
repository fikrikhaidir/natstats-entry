// Environment & digital page: energy, emissions, forests, and how fast Indonesia came online.
import { renderTopic } from './topic-page.js';
import { trendSentence } from '../insights.js';
import { latestOf, seriesOf } from '../data-store.js';

export const title = 'Environment & digital';

export const render = () =>
  renderTopic({
    topic: 'environment',
    title: 'Energy, emissions and getting online',
    lede: 'Nearly everyone has electricity and most people are online. Emissions per person have doubled since 2000 and the renewable share has fallen.',
    headline: ['IT.NET.USER.ZS', 'EG.ELC.ACCS.ZS', 'EN.GHG.CO2.PC.CE.AR5', 'AG.LND.FRST.ZS'],
    notes: () => [
      trendSentence('IT.NET.USER.ZS'),
      `There were ${latestOf('IT.CEL.SETS.P2').value} mobile subscriptions per 100 people in ${latestOf('IT.CEL.SETS.P2').year}; some people hold more than one SIM.`,
      trendSentence('EN.GHG.CO2.PC.CE.AR5'),
      `Renewables were ${latestOf('EG.FEC.RNEW.ZS').value}% of final energy in ${latestOf('EG.FEC.RNEW.ZS').year} against ${seriesOf('EG.FEC.RNEW.ZS')[0].value}% in 2000, as traditional biomass use gave way to fossil fuels and electricity.`,
      `Forest cover was ${latestOf('AG.LND.FRST.ZS').value}% of land in ${latestOf('AG.LND.FRST.ZS').year}.`,
    ],
    panels: [
      { title: 'Going online', lede: 'Internet users and mobile subscriptions.', mode: 'pick', codes: ['IT.NET.USER.ZS', 'IT.CEL.SETS.P2'], area: true },
      { title: 'Energy access and mix', lede: 'Electricity access and the renewable share of energy.', mode: 'together', codes: ['EG.ELC.ACCS.ZS', 'EG.FEC.RNEW.ZS'] },
      { title: 'Emissions and energy use', lede: 'Per person.', mode: 'pick', codes: ['EN.GHG.CO2.PC.CE.AR5', 'EG.USE.PCAP.KG.OE'], area: true },
      { title: 'Forest', lede: 'Share of land area under forest.', mode: 'pick', codes: ['AG.LND.FRST.ZS'], area: true },
    ],
  });
