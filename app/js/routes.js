// The site map: each route's path, nav label and the lazily loaded view module that draws it.
// Views are fetched with literal import() calls so the first load stays small.
export const ROUTES = [
  { path: '/', label: 'Overview', icon: 'grid', load: () => import('./pages/overview.js') },
  { path: '/people', label: 'People', icon: 'people', load: () => import('./pages/people.js') },
  { path: '/economy', label: 'Economy', icon: 'coin', load: () => import('./pages/economy.js') },
  { path: '/work', label: 'Work & poverty', icon: 'work', load: () => import('./pages/labour.js') },
  { path: '/health', label: 'Health & learning', icon: 'heart', load: () => import('./pages/wellbeing.js') },
  { path: '/environment', label: 'Environment & digital', icon: 'leaf', load: () => import('./pages/environment.js') },
  { path: '/compare', label: 'Compare countries', icon: 'bars', load: () => import('./pages/compare.js') },
  { path: '/explorer', label: 'Data explorer', icon: 'search', load: () => import('./pages/explorer.js') },
  { path: '/sources', label: 'Sources & method', icon: 'book', load: () => import('./pages/sources.js') },
];

export const TOPIC_PATH = { people: '/people', economy: '/economy', labour: '/work', wellbeing: '/health', environment: '/environment' };

export const hrefTo = (path, query) => `#${path}${query ? `?${new URLSearchParams(query)}` : ''}`;
