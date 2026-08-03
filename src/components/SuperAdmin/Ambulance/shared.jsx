import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const fmt = v => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleString() : '—';
};

export const fmtTime = v => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleTimeString() : '—';
};

export const ago = d => {
  if (!d) return 'never';
  const min = Math.floor((Date.now() - d.getTime()) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ${min % 60} min ago`;
  return `${Math.floor(h / 24)} d ago`;
};

/** Grey "photo expired" placeholder — detections/heartbeats images are deleted
 *  by the device after ~1 day while their Firestore docs remain. */
export const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <text x="50%" y="46%" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#94a3b8">&#128247;</text>
      <text x="50%" y="72%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#64748b">photo expired</text>
    </svg>`
  );

/** <img> that swaps to the placeholder when the Storage object is gone. */
export function SafeImg({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? PLACEHOLDER : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

SafeImg.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};
