const fs = require('fs');
const path = require('path');

// The pdf.js worker (used by the Statement Analyzer, /ati/finance-data) must be
// served untouched: bundling it runs it through Babel and breaks it. Copy the
// installed version into public/ so it always matches the pdfjs-dist package.
function copyPdfWorker() {
  const src = path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
  const dest = path.join(__dirname, 'public/pdf.worker.min.mjs');
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
}

module.exports = function override(config) {
  copyPdfWorker();
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react/jsx-runtime': 'react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
    },
  };
  return config;
};
