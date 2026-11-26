// Tiny DOM helpers: h() builds HTML elements, svg() builds SVG elements, clear() empties a node.

function appendKids(parent, kids) {
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    parent.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
}

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  appendKids(el, kids);
  return el;
}

export function svg(tag, props, ...kids) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'text') el.textContent = value;
    else el.setAttribute(key, value);
  }
  appendKids(el, kids);
  return el;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}
