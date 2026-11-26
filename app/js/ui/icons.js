// Small 20px line icons (stroke-only, drawn for this site) keyed by name.
import { svg } from '../dom.js';

const PATHS = {
  grid: 'M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z',
  people: 'M7 9a3 3 0 100-6 3 3 0 000 6zM1.5 17c0-3 2.5-5 5.5-5s5.500 2 5.500 5M14 8.500a2.500 2.500 0 100-5M15 12c2.200.4 3.500 2.200 3.500 5',
  coin: 'M10 18a8 8 0 100-16 8 8 0 000 16zM12.500 7.200c-.5-.8-1.400-1.200-2.500-1.200-1.400 0-2.500.8-2.500 2 0 3 5 1.500 5 4.200 0 1.200-1.100 2-2.500 2-1.100 0-2.100-.5-2.600-1.300M10 4.500V6M10 14v1.500',
  work: 'M3 7h14v9H3zM7 7V4.500h6V7M3 11.500h14',
  heart: 'M10 17s-7-4.200-7-9.200C3 5.500 4.700 4 6.600 4c1.400 0 2.700.8 3.400 2 .7-1.200 2-2 3.400-2C15.300 4 17 5.500 17 7.800 17 12.800 10 17 10 17z',
  leaf: 'M4 16C4 8 9 3.500 17 3c0 8-4.500 13-12.500 13M4 16c2-4 5-6.500 8-8',
  bars: 'M3 17V9h3.500v8zM8.300 17V3h3.500v14zM13.500 17v-5H17v5z',
  search: 'M8.500 14.500a6 6 0 100-12 6 6 0 000 12zM13 13l4.500 4.500',
  book: 'M4 3.500h9a2 2 0 012 2V17H6a2 2 0 01-2-2zM4 15a2 2 0 012-2h9',
  sun: 'M10 14a4 4 0 100-8 4 4 0 000 8zM10 1.500v2M10 16.500v2M1.500 10h2M16.500 10h2M4 4l1.400 1.400M14.600 14.600L16 16M16 4l-1.400 1.400M5.400 14.600L4 16',
  moon: 'M16.500 11.500A7 7 0 118.500 3.500a5.500 5.500 0 008 8z',
  download: 'M10 3v10M6 9.500l4 4 4-4M3.500 16.500h13',
  arrow: 'M4 10h12M11 5l5 5-5 5',
};

export function icon(name, size = 18) {
  return svg('svg', { viewBox: '0 0 20 20', width: size, height: size, class: 'icon', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, svg('path', { d: PATHS[name] ?? PATHS.grid }));
}
