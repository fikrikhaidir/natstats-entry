// A short confirmation pill at the bottom of the screen ("CSV downloaded").
import { h } from '../dom.js';

let timer;
export function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = h('div', { class: 'toast', role: 'status' }, message);
  document.body.append(el);
  clearTimeout(timer);
  timer = setTimeout(() => el.remove(), 2600);
}
