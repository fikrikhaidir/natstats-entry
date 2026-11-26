// Builds the sidebar (desktop) / scrolling pill bar (phone) from the route list and marks the active page.
import { h } from '../dom.js';
import { ROUTES, hrefTo } from '../routes.js';
import { icon } from './icons.js';

export function buildNavigation(container) {
  const links = ROUTES.map((route) =>
    h('a', { class: 'nav-link', href: hrefTo(route.path), 'data-path': route.path }, icon(route.icon), h('span', {}, route.label)),
  );
  container.replaceChildren(...links);
  return (activePath) => {
    for (const link of links) {
      const on = link.dataset.path === activePath;
      link.classList.toggle('is-active', on);
      if (on) {
        link.setAttribute('aria-current', 'page');
        link.scrollIntoView({ inline: 'center', block: 'nearest' });
      } else link.removeAttribute('aria-current');
    }
  };
}
