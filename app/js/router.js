// Hash router: "#/economy?i=NY.GDP.PCAP.CD" -> the economy view, with the query handed to it.
import { h, clear } from './dom.js';
import { ROUTES } from './routes.js';

export function readLocation() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(search) };
}

export function startRouter(outlet, onNavigate) {
  async function render() {
    const { path, query } = readLocation();
    const route = ROUTES.find((r) => r.path === path) ?? ROUTES[0];
    onNavigate(route);
    outlet.setAttribute('aria-busy', 'true');
    try {
      const view = await route.load();
      const page = await view.render({ query });
      document.title = `${view.title} · Nusa Numbers`;
      clear(outlet).append(page);
    } catch (error) {
      clear(outlet).append(h('section', { class: 'card notice' }, h('h2', {}, 'This page could not load'), h('p', {}, String(error.message ?? error))));
    }
    outlet.removeAttribute('aria-busy');
    window.scrollTo(0, 0);
    outlet.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', render);
  return render();
}
