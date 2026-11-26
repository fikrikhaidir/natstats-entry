// Bubble scatter for the compare page: income per person (log scale) against another indicator,
// bubble area proportional to population, each bubble labelled with its country.
import { h, svg } from '../dom.js';
import { niceTicks, onResize } from './shared.js';

/** dots: [{ label, x, y, size, highlight? }]; xFormat / yFormat turn axis numbers into text. */
export function bubbleScatter({ dots, xFormat, yFormat, xTitle, yTitle, height = 360, label }) {
  const wrap = h('div', { class: 'chart', role: 'img', 'aria-label': label });
  const xs = dots.map((d) => Math.log10(d.x));
  const yTicks = niceTicks(Math.min(...dots.map((d) => d.y)) * 0.95, Math.max(...dots.map((d) => d.y)) * 1.02, 4);
  const maxSize = Math.max(...dots.map((d) => d.size));
  const xTicks = [1000, 3000, 10000, 30000, 100000].filter((t) => Math.log10(t) >= Math.min(...xs) - 0.25 && Math.log10(t) <= Math.max(...xs) + 0.25);

  function draw(width) {
    const pad = { l: 46, r: 34, t: 34, b: 46 };
    const lo = Math.min(...xs, Math.log10(xTicks[0])) - 0.08;
    const hi = Math.max(...xs, Math.log10(xTicks.at(-1))) + 0.08;
    const x = (value) => pad.l + ((Math.log10(value) - lo) / (hi - lo)) * (width - pad.l - pad.r);
    const y = (value) => pad.t + (1 - (value - yTicks[0]) / (yTicks.at(-1) - yTicks[0])) * (height - pad.t - pad.b);
    const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, width, height, class: 'chart-svg' });
    for (const t of yTicks) {
      root.append(svg('line', { x1: pad.l, x2: width - pad.r, y1: y(t), y2: y(t), class: 'gridline' }));
      root.append(svg('text', { x: pad.l - 8, y: y(t) + 4, class: 'tick', 'text-anchor': 'end', text: yFormat(t) }));
    }
    for (const t of xTicks) {
      root.append(svg('line', { x1: x(t), x2: x(t), y1: pad.t, y2: height - pad.b, class: 'gridline grid-v' }));
      root.append(svg('text', { x: x(t), y: height - pad.b + 16, class: 'tick', 'text-anchor': 'middle', text: xFormat(t) }));
    }
    root.append(svg('text', { x: (pad.l + width - pad.r) / 2, y: height - 6, class: 'axis-title', 'text-anchor': 'middle', text: xTitle }));
    root.append(svg('text', { x: 6, y: 12, class: 'axis-title', text: yTitle }));
    // Every label is tried in several spots around its bubble (below, above, right, left, then further out)
    // and takes the first one that touches no other bubble and no label already placed.
    const circles = dots.map((dot) => ({ dot, cx: x(dot.x), cy: y(dot.y), r: 6 + Math.sqrt(dot.size / maxSize) * 18 }));
    const boxes = [];
    const hitsCircle = (box, c) => {
      const nx = Math.max(box.x0, Math.min(c.cx, box.x1));
      const ny = Math.max(box.y0, Math.min(c.cy, box.y1));
      return (nx - c.cx) ** 2 + (ny - c.cy) ** 2 < (c.r + 2) ** 2;
    };
    const hitsBox = (a, b) => a.x0 < b.x1 + 2 && a.x1 > b.x0 - 2 && a.y0 < b.y1 + 2 && a.y1 > b.y0 - 2;
    const placed = new Map();
    for (const me of [...circles].sort((p, q) => q.r - p.r)) {
      const w = me.dot.label.length * 6.4;
      const spots = [];
      spots.push({ cx: me.cx, base: me.cy + me.r + 13 }, { cx: me.cx, base: me.cy - me.r - 5 });
      spots.push({ cx: me.cx - me.r - 6 - w / 2, base: me.cy + 4 }, { cx: me.cx + me.r + 6 + w / 2, base: me.cy + 4 });
      for (const gap of [17, 29]) spots.push({ cx: me.cx, base: me.cy + me.r + gap + 8 }, { cx: me.cx, base: me.cy - me.r - gap });
      let best = null;
      for (const spot of spots) {
        const cx = Math.max(pad.l + w / 2, Math.min(spot.cx, width - 6 - w / 2));
        const box = { x0: cx - w / 2, x1: cx + w / 2, y0: spot.base - 11, y1: spot.base + 3 };
        const cost = circles.filter((c) => c !== me && hitsCircle(box, c)).length + boxes.filter((b) => hitsBox(box, b)).length * 2 + (box.y0 < 18 || box.y1 > height - pad.b + 4 ? 3 : 0);
        if (!best || cost < best.cost) best = { cost, box, cx, base: spot.base };
        if (cost === 0) break;
      }
      boxes.push(best.box);
      placed.set(me.dot, best);
    }
    for (const { dot, cx, cy, r } of circles) {
      const spot = placed.get(dot);
      root.append(
        svg('g', { class: dot.highlight ? 'bubble is-home' : 'bubble' },
          svg('title', { text: `${dot.label}: ${xFormat(dot.x)} per person, ${yFormat(dot.y)}` }),
          svg('circle', { cx, cy, r }),
          svg('text', { x: spot.cx, y: spot.base, 'text-anchor': 'middle', text: dot.label })),
      );
    }
    wrap.replaceChildren(root);
  }

  requestAnimationFrame(onResize(wrap, draw));
  return wrap;
}
