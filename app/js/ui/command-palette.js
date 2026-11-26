// Ctrl/⌘+K (or "/") opens a search over every page and every indicator; Enter jumps to it.
import { INDICATORS } from '../catalog.js';
import { h } from '../dom.js';
import { ROUTES, hrefTo } from '../routes.js';

const entries = [
  ...ROUTES.map((route) => ({ title: route.label, hint: 'Page', href: hrefTo(route.path), words: route.label })),
  ...Object.values(INDICATORS).map((ind) => ({
    title: ind.label,
    hint: `${ind.code}`,
    href: hrefTo('/explorer', { i: ind.code }),
    words: `${ind.label} ${ind.code} ${ind.topic} ${ind.definition}`,
  })),
];

export function setupPalette(openButton) {
  const input = h('input', { type: 'search', class: 'palette-input', placeholder: 'Jump to a page or an indicator…', 'aria-label': 'Search pages and indicators', autocomplete: 'off' });
  const list = h('ul', { class: 'palette-list', role: 'listbox' });
  const dialog = h('dialog', { class: 'palette', 'aria-label': 'Search' }, h('div', { class: 'palette-box' }, input, list, h('p', { class: 'palette-foot' }, '↑ ↓ to move · Enter to open · Esc to close')));
  document.body.append(dialog);
  let shown = [];
  let cursor = 0;

  function paint() {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = entries.filter((entry) => terms.every((term) => entry.words.toLowerCase().includes(term))).slice(0, 9);
    cursor = Math.min(cursor, Math.max(0, shown.length - 1));
    list.replaceChildren(
      ...shown.map((entry, i) =>
        h('li', { role: 'option', 'aria-selected': String(i === cursor) }, h('a', { href: entry.href, onclick: () => dialog.close() }, h('span', {}, entry.title), h('small', {}, entry.hint))),
      ),
    );
    if (!shown.length) list.append(h('li', { class: 'palette-empty' }, 'Nothing matches that search.'));
  }

  const open = () => {
    input.value = '';
    cursor = 0;
    paint();
    dialog.showModal();
    input.focus();
  };
  input.addEventListener('input', () => {
    cursor = 0;
    paint();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') cursor = Math.min(shown.length - 1, cursor + 1);
    else if (event.key === 'ArrowUp') cursor = Math.max(0, cursor - 1);
    else if (event.key === 'Enter' && shown[cursor]) {
      location.hash = shown[cursor].href;
      dialog.close();
      return;
    } else return;
    event.preventDefault();
    paint();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  openButton.addEventListener('click', open);
  document.addEventListener('keydown', (event) => {
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName ?? '');
    if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
      event.preventDefault();
      open();
    }
  });
}
