// A plain data table plus a CSV download, so every chart can be read as numbers and taken away.
import { h } from '../dom.js';
import { toCsv } from '../format.js';
import { toast } from './toast.js';

/** columns: [{ label, align? }]; rows: arrays of display strings. */
export function dataTable(columns, rows, caption) {
  return h(
    'div',
    { class: 'table-wrap' },
    h(
      'table',
      { class: 'data-table' },
      h('caption', { class: 'sr-only' }, caption),
      h('thead', {}, h('tr', {}, columns.map((c) => h('th', { scope: 'col', class: c.align === 'left' ? 'left' : '' }, c.label)))),
      h('tbody', {}, rows.map((row) => h('tr', {}, row.map((cell, i) => h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, cell))))),
    ),
  );
}

export function downloadCsv(filename, rows) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const link = h('a', { href: URL.createObjectURL(blob), download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  toast(`Downloaded ${filename}`);
}

export function csvButton(filename, buildRows) {
  return h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => downloadCsv(filename, buildRows()) }, 'Download CSV');
}
