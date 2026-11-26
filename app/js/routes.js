// The site map: each route's path, nav label and the lazily loaded view module that draws it.
// Views are fetched with literal import() calls so the first load stays small.
export const ROUTES = [
  { path: '/', label: 'Overview', icon: 'grid', load: () => import('./views/overview.js') },
  { path: '/people', label: 'People', icon: 'people', load: () => import('./views/people.js') },
  { path: '/economy', label: 'Economy', icon: 'coin', load: () => import('./views/economy.js') },
  { path: '/work', label: 'Work & poverty', icon: 'work', load: () => import('./views/labour.js') },
  { path: '/health', label: 'Health & learning', icon: 'heart', load: () => import('./views/wellbeing.js') },
  { path: '/environment', label: 'Environment & digital', icon: 'leaf', load: () => import('./views/environment.js') },
  { path: '/compare', label: 'Compare countries', icon: 'bars', load: () => import('./views/compare.js') },
  { path: '/explorer', label: 'Data explorer', icon: 'search', load: () => import('./views/explorer.js') },
  { path: '/sources', label: 'Sources & method', icon: 'book', load: () => import('./views/sources.js') },
];

export const TOPIC_PATH = { people: '/people', economy: '/economy', labour: '/work', wellbeing: '/health', environment: '/environment' };

export const hrefTo = (path, query) => `#${path}${query ? `?${new URLSearchParams(query)}` : ''}`;
