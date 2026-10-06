/**
 * Pull the text out of a PDF statement, in the browser, as reading-order lines.
 *
 * pdf.js hands back positioned text fragments; statements are tables, so we
 * rebuild rows by grouping fragments that share a baseline and joining them
 * left to right. Nothing is uploaded — the file is read locally.
 */
import * as pdfjs from 'pdfjs-dist';

// Served as-is from public/ (copied there by config-overrides.js on every
// build/start). Bundling it through webpack would run it through Babel, which
// breaks the pre-built worker.
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

export class StatementReadError extends Error {}

/** Group positioned text items into lines (top to bottom, left to right). */
export function itemsToLines(items) {
  const rows = [];
  items
    .filter(it => it.str && it.str.trim())
    .forEach(it => {
      const x = it.transform[4];
      const y = it.transform[5];
      const h = Math.abs(it.transform[3]) || it.height || 8;
      let row = rows.find(r => Math.abs(r.y - y) <= Math.max(2, h * 0.35));
      if (!row) {
        row = { y, parts: [] };
        rows.push(row);
      }
      row.parts.push({ x, w: it.width || 0, str: it.str });
    });
  return rows
    .sort((a, b) => b.y - a.y)
    .map(r => {
      const parts = r.parts.sort((a, b) => a.x - b.x);
      let line = '';
      let end = null;
      parts.forEach(p => {
        // A visible gap between fragments is a column break: keep a wide space
        // so "DESCRIPTION   12.34" never fuses into "DESCRIPTION12.34".
        if (end !== null) line += p.x - end > 6 ? '   ' : p.x - end > 0.5 ? ' ' : '';
        line += p.str;
        end = p.x + p.w;
      });
      return line.replace(/\s+$/, '');
    })
    .filter(Boolean);
}

/** Read a File/ArrayBuffer and return { lines, pageCount }. */
export async function readPdfLines(data) {
  const buffer = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
  let doc;
  try {
    doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
  } catch (err) {
    if (err?.name === 'PasswordException') {
      throw new StatementReadError(
        'This PDF is password-protected. Download an unlocked copy from your bank and try again.'
      );
    }
    throw new StatementReadError('This file could not be opened as a PDF.');
  }
  const lines = [];
  const pageCount = doc.numPages;
  for (let i = 1; i <= pageCount; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    lines.push(...itemsToLines(content.items));
  }
  await doc.destroy();
  if (!lines.length) {
    throw new StatementReadError(
      'No text found in this PDF — it may be a scanned image. Use the statement PDF downloaded from your bank’s website.'
    );
  }
  return { lines, pageCount };
}
