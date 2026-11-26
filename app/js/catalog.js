// The catalogue: every indicator the site shows (World Bank code, label, how to format it, who compiled it)
// and the topic pages they belong to. The numbers themselves live in app/series/, one file per topic.

const WDI = 'World Bank WDI';

export const TOPICS = [
  { id: 'people', title: 'People', blurb: 'Population size, growth, age structure and where people live.' },
  { id: 'economy', title: 'Economy', blurb: 'Output, income, prices, trade and what the economy is made of.' },
  { id: 'labour', title: 'Work & poverty', blurb: 'Jobs, unemployment, who works where and extreme poverty.' },
  { id: 'wellbeing', title: 'Health & learning', blurb: 'Life expectancy, child survival, nutrition, schooling.' },
  { id: 'environment', title: 'Environment & digital', blurb: 'Energy, emissions, forests and getting online.' },
];

// code, topic, label, kind (big | plain), decimals, prefix, suffix, unit, compiler, definition
const ROWS = [
  ['SP.POP.TOTL', 'people', 'Population', 'big', 1, '', '', 'count', 'UN Population Division; national statistical offices', 'All residents regardless of legal status, mid-year estimate.'],
  ['SP.POP.GROW', 'people', 'Population growth', 'plain', 2, '', '%', 'percent', 'UN Population Division', 'Annual percentage change of the mid-year population.'],
  ['SP.URB.TOTL.IN.ZS', 'people', 'Urban population', 'plain', 1, '', '%', 'percent', 'UN World Urbanization Prospects', 'Share of people living in areas defined as urban by the national statistics office.'],
  ['SP.DYN.TFRT.IN', 'people', 'Fertility rate', 'plain', 2, '', ' births/woman', 'rate', 'UN Population Division; national statistical offices', 'Births a woman would have in her lifetime at current age-specific rates.'],
  ['SP.POP.0014.TO.ZS', 'people', 'Population aged 0–14', 'plain', 1, '', '%', 'percent', 'UN Population Division', 'Children aged 0 to 14 as a share of the total population.'],
  ['SP.POP.65UP.TO.ZS', 'people', 'Population aged 65+', 'plain', 1, '', '%', 'percent', 'UN Population Division', 'People aged 65 and over as a share of the total population.'],
  ['EN.POP.DNST', 'people', 'Population density', 'plain', 0, '', ' per km²', 'rate', 'FAO land area; World Bank population estimates', 'People per square kilometre of land area.'],
  ['SP.DYN.CBRT.IN', 'people', 'Birth rate', 'plain', 1, '', ' per 1,000', 'rate', 'UN Population Division', 'Live births per 1,000 people in a year.'],
  ['SP.DYN.CDRT.IN', 'people', 'Death rate', 'plain', 1, '', ' per 1,000', 'rate', 'UN Population Division', 'Deaths per 1,000 people in a year.'],

  ['NY.GDP.MKTP.CD', 'economy', 'GDP', 'big', 2, 'US$', '', 'count', 'National statistical offices; World Bank and OECD national accounts files', 'Gross domestic product at market prices, current US dollars.'],
  ['NY.GDP.PCAP.CD', 'economy', 'GDP per person', 'plain', 0, 'US$', '', 'count', 'National statistical offices; World Bank and OECD national accounts files', 'GDP divided by mid-year population, current US dollars.'],
  ['NY.GDP.MKTP.KD.ZG', 'economy', 'GDP growth', 'plain', 1, '', '%', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Annual growth of GDP at constant prices.'],
  ['FP.CPI.TOTL.ZG', 'economy', 'Inflation', 'plain', 1, '', '%', 'percent', 'IMF International Financial Statistics', 'Annual change in consumer prices.'],
  ['NE.EXP.GNFS.ZS', 'economy', 'Exports of goods and services', 'plain', 1, '', '% of GDP', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Value of exports as a share of GDP.'],
  ['NE.IMP.GNFS.ZS', 'economy', 'Imports of goods and services', 'plain', 1, '', '% of GDP', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Value of imports as a share of GDP.'],
  ['BX.KLT.DINV.WD.GD.ZS', 'economy', 'Foreign direct investment', 'plain', 1, '', '% of GDP', 'percent', 'IMF International Financial Statistics and Balance of Payments databases', 'Net inflows of foreign direct investment as a share of GDP.'],
  ['NV.AGR.TOTL.ZS', 'economy', 'Agriculture, value added', 'plain', 1, '', '% of GDP', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Farming, forestry and fishing as a share of GDP.'],
  ['NV.IND.TOTL.ZS', 'economy', 'Industry, value added', 'plain', 1, '', '% of GDP', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Mining, manufacturing, construction and utilities as a share of GDP.'],
  ['NV.SRV.TOTL.ZS', 'economy', 'Services, value added', 'plain', 1, '', '% of GDP', 'percent', 'National statistical offices; World Bank and OECD national accounts files', 'Trade, transport, finance, public and other services as a share of GDP.'],

  ['SL.UEM.TOTL.ZS', 'labour', 'Unemployment', 'plain', 1, '', '%', 'percent', 'ILO modelled estimates', 'Share of the labour force without work but available and looking for it.'],
  ['SL.TLF.CACT.ZS', 'labour', 'Labour force participation', 'plain', 1, '', '%', 'percent', 'ILO modelled estimates', 'People aged 15+ who work or look for work, as a share of that age group.'],
  ['SL.TLF.CACT.FE.ZS', 'labour', 'Female labour force participation', 'plain', 1, '', '%', 'percent', 'ILO modelled estimates', 'Women aged 15+ who work or look for work, as a share of women that age.'],
  ['SL.AGR.EMPL.ZS', 'labour', 'Employed in agriculture', 'plain', 1, '', '% of jobs', 'percent', 'ILO modelled estimates', 'Share of all employment that is in agriculture.'],
  ['SL.IND.EMPL.ZS', 'labour', 'Employed in industry', 'plain', 1, '', '% of jobs', 'percent', 'ILO modelled estimates', 'Share of all employment that is in industry.'],
  ['SL.SRV.EMPL.ZS', 'labour', 'Employed in services', 'plain', 1, '', '% of jobs', 'percent', 'ILO modelled estimates', 'Share of all employment that is in services.'],
  ['SI.POV.DDAY', 'labour', 'Extreme poverty', 'plain', 1, '', '%', 'percent', 'World Bank Poverty and Inequality Platform', 'Share of people living below the international poverty line (US$3.00 a day, 2021 prices).'],

  ['SP.DYN.LE00.IN', 'wellbeing', 'Life expectancy at birth', 'plain', 1, '', ' years', 'years', 'UN Population Division; national statistical offices', 'Years a newborn would live if current mortality patterns held.'],
  ['SP.DYN.IMRT.IN', 'wellbeing', 'Infant mortality', 'plain', 1, '', ' per 1,000', 'rate', 'UN Inter-agency Group for Child Mortality Estimation', 'Deaths of babies under one year per 1,000 live births.'],
  ['SH.DYN.MORT', 'wellbeing', 'Under-5 mortality', 'plain', 1, '', ' per 1,000', 'rate', 'UN Inter-agency Group for Child Mortality Estimation', 'Deaths of children under five per 1,000 live births.'],
  ['SH.XPD.CHEX.GD.ZS', 'wellbeing', 'Health spending', 'plain', 1, '', '% of GDP', 'percent', 'WHO Global Health Expenditure Database', 'Public and private health spending as a share of GDP.'],
  ['SH.STA.STNT.ZS', 'wellbeing', 'Child stunting', 'plain', 1, '', '%', 'percent', 'UNICEF, WHO and World Bank child malnutrition estimates', 'Children under five whose height is far below the norm for their age.'],
  ['SE.ADT.LITR.ZS', 'wellbeing', 'Adult literacy', 'plain', 1, '', '%', 'percent', 'UNESCO Institute for Statistics', 'People aged 15+ who can read and write a short simple statement.'],
  ['SE.SEC.ENRR', 'wellbeing', 'Secondary school enrolment', 'plain', 1, '', '% gross', 'percent', 'UNESCO Institute for Statistics', 'Students enrolled in secondary school as a share of the age group (can exceed 100%).'],
  ['SE.XPD.TOTL.GD.ZS', 'wellbeing', 'Education spending', 'plain', 1, '', '% of GDP', 'percent', 'UNESCO Institute for Statistics', 'Government spending on education as a share of GDP.'],

  ['EN.GHG.CO2.PC.CE.AR5', 'environment', 'CO₂ emissions per person', 'plain', 2, '', ' t', 'count', 'EDGAR (European Commission JRC) via WDI', 'Tonnes of carbon dioxide per person, excluding land use change and forestry.'],
  ['EG.ELC.ACCS.ZS', 'environment', 'Access to electricity', 'plain', 1, '', '%', 'percent', 'World Bank ESMAP, SDG 7.1.1 electrification dataset', 'Share of the population with electricity at home.'],
  ['EG.FEC.RNEW.ZS', 'environment', 'Renewable share of energy', 'plain', 1, '', '%', 'percent', 'IEA Energy Statistics', 'Renewables as a share of final energy consumption.'],
  ['AG.LND.FRST.ZS', 'environment', 'Forest area', 'plain', 1, '', '% of land', 'percent', 'FAO Global Forest Resources Assessment', 'Land under natural or planted trees at least 5 m tall.'],
  ['IT.NET.USER.ZS', 'environment', 'Internet users', 'plain', 1, '', '% of people', 'percent', 'International Telecommunication Union', 'People who used the internet in the last three months.'],
  ['IT.CEL.SETS.P2', 'environment', 'Mobile subscriptions', 'plain', 0, '', ' per 100', 'rate', 'International Telecommunication Union', 'Active mobile-cellular subscriptions per 100 people.'],
  ['EG.USE.PCAP.KG.OE', 'environment', 'Energy use per person', 'plain', 0, '', ' kg oil eq.', 'count', 'IEA', 'Primary energy use per person in kilograms of oil equivalent.'],
];

export const INDICATORS = Object.fromEntries(
  ROWS.map(([code, topic, label, kind, decimals, prefix, suffix, unit, compiler, definition]) => [
    code,
    { code, topic, label, kind, decimals, prefix, suffix, unit, source: `${WDI} · ${compiler}`, compiler, definition },
  ]),
);

export const topicOf = (id) => TOPICS.find((topic) => topic.id === id);
export const indicatorsOfTopic = (id) => Object.values(INDICATORS).filter((ind) => ind.topic === id);

export const COUNTRIES = {
  IDN: { name: 'Indonesia', short: 'Indonesia' },
  IND: { name: 'India', short: 'India' },
  VNM: { name: 'Viet Nam', short: 'Viet Nam' },
  THA: { name: 'Thailand', short: 'Thailand' },
  PHL: { name: 'Philippines', short: 'Philippines' },
  MYS: { name: 'Malaysia', short: 'Malaysia' },
  BRA: { name: 'Brazil', short: 'Brazil' },
  NGA: { name: 'Nigeria', short: 'Nigeria' },
  JPN: { name: 'Japan', short: 'Japan' },
  USA: { name: 'United States', short: 'U.S.' },
};
