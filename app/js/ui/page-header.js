// The title block at the top of every page.
import { h } from '../dom.js';

export function pageHeader({ kicker, title, lede, chips = [] }) {
  return h(
    'header',
    { class: 'page-head' },
    kicker && h('p', { class: 'kicker' }, kicker),
    h('h1', {}, title),
    lede && h('p', { class: 'page-lede' }, lede),
    chips.length > 0 && h('div', { class: 'chip-row' }, chips.map((text) => h('span', { class: 'chip' }, text))),
  );
}
