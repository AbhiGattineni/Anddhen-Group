import React from 'react';

export const ExtensionDetails = () => {
  return (
    <div
      className="card mb-4"
      style={{
        border: '2px solid #f76c2f',
        borderRadius: '0.5rem',
      }}
    >
      <div className="card-body">
        <h5 className="card-title main-heading">🌟 Chrome Extension: Word Highlighter</h5>
        <p className="card-text">
          Make your job search easier! This extension highlights key skills and roles on job
          platforms like LinkedIn using color-coded highlights — so you can quickly focus on what
          matters most.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/word-highlighter/nheocgebdfhdfknfppfhfcgijedcepae?authuser=0&hl=en"
          className="btn btn-warning shadow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Extension
        </a>
      </div>
    </div>
  );
};
