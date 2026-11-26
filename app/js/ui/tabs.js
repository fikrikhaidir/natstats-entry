// Segmented control with a sliding highlight, used to switch chart series, ranges and views.
import { h } from '../dom.js';

/** items: [{ id, label }]; onChange(id) runs after the selection moves. Returns the element (with .select(id)). */
export function tabs(items, activeId, onChange, label = 'Options') {
  const buttons = new Map();
  const slider = h('span', { class: 'tabs-slider', 'aria-hidden': 'true' });
  const root = h('div', { class: 'tabs', role: 'tablist', 'aria-label': label }, slider);

  function place(id) {
    for (const [key, button] of buttons) {
      button.setAttribute('aria-selected', String(key === id));
      button.tabIndex = key === id ? 0 : -1;
    }
    const active = buttons.get(id);
    if (active && active.offsetWidth) {
      slider.classList.add('is-placed'); // animate only after the first real measurement
      slider.style.width = `${active.offsetWidth}px`;
      slider.style.transform = `translateX(${active.offsetLeft - 3}px)`;
    }
  }

  for (const item of items) {
    const button = h('button', { type: 'button', role: 'tab', class: 'tab', onclick: () => select(item.id) }, item.label);
    buttons.set(item.id, button);
    root.append(button);
  }
  root.addEventListener('keydown', (event) => {
    const ids = items.map((item) => item.id);
    const now = ids.findIndex((id) => buttons.get(id).tabIndex === 0);
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = ids[(now + step + ids.length) % ids.length];
    select(next);
    buttons.get(next).focus();
  });

  function select(id) {
    place(id);
    onChange(id);
  }
  root.select = place;
  // Position the slider once the control is in the page and has a width.
  new ResizeObserver(() => place([...buttons].find(([, b]) => b.tabIndex === 0)?.[0] ?? activeId)).observe(root);
  place(activeId);
  return root;
}
