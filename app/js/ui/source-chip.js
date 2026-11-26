// The small "source · year" pill under every figure: who compiled it and which year it describes.
import { h } from '../dom.js';

export function sourceChip(ind, year) {
  return h('span', { class: 'chip chip-source', title: `${ind.source} · indicator ${ind.code}` }, h('i', { class: 'chip-dot' }), `World Bank WDI · ${year}`);
}

// A line of text for captions: "Source: World Bank WDI, UN Population Division; indicator SP.POP.TOTL; data to 2024".
export function sourceLine(codes, years) {
  const names = codes.join(', ');
  return h('p', { class: 'source-line' }, h('b', {}, 'Source '), `World Bank, World Development Indicators (${names}), data to ${years}.`);
}
