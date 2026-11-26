// Loads the data files on demand (each topic is its own module, fetched with a literal import())
// and hands out series as [{ year, value }] lists with the gaps removed.
import { INDICATORS } from './catalog.js';

const loaders = {
  people: () => import('../data/people.js'),
  economy: () => import('../data/economy.js'),
  labour: () => import('../data/labour.js'),
  wellbeing: () => import('../data/wellbeing.js'),
  environment: () => import('../data/environment.js'),
  peers: () => import('../data/peers.js'),
};

const modules = new Map();
const seriesByCode = new Map();

async function loadOne(name) {
  if (modules.has(name)) return modules.get(name);
  const mod = await loaders[name]();
  modules.set(name, mod);
  if (mod.series) {
    for (const [code, values] of Object.entries(mod.series)) {
      const points = [];
      values.forEach((value, i) => {
        if (value != null) points.push({ year: mod.firstYear + i, value });
      });
      seriesByCode.set(code, points);
    }
  }
  return mod;
}

export const loadTopics = (...names) => Promise.all(names.map(loadOne));
export const loadEverything = () => loadTopics(...Object.keys(loaders));

// Only valid after the indicator's topic has been loaded.
export const seriesOf = (code) => seriesByCode.get(code) ?? [];
export const latestOf = (code) => seriesOf(code).at(-1) ?? null;
export const peerData = () => modules.get('peers').peers;
export const dataUpdated = () => modules.get('economy')?.updated ?? '';

export function pointAt(code, year) {
  return seriesOf(code).find((point) => point.year === year) ?? null;
}

// The value closest to `year` years before the latest one (for "since 2014" style comparisons).
export function lookBack(code, yearsBack) {
  const points = seriesOf(code);
  const last = points.at(-1);
  if (!last) return null;
  const target = last.year - yearsBack;
  let best = null;
  for (const point of points) if (point.year <= target) best = point;
  return best ?? points[0];
}

export function topicsNeeded(codes) {
  return [...new Set(codes.map((code) => INDICATORS[code].topic))];
}
