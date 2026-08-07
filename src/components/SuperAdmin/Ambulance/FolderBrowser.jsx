import React, { useCallback, useEffect, useState } from 'react';
import { listStorage } from 'src/services/ambulance/ambulance';
import { SafeImg, Lightbox, useLightbox } from './shared';

/** Browse the ambulance Storage bucket (violations/, detections/, heartbeats/, …). */
export default function FolderBrowser() {
  const [prefix, setPrefix] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewer = useLightbox();

  const load = useCallback(async (pfx, pageToken = null) => {
    setLoading(true);
    setError('');
    try {
      const r = await listStorage(pfx, pageToken);
      setFolders(pageToken ? f => [...f, ...r.folders] : r.folders);
      setFiles(pageToken ? f => [...f, ...r.files] : r.files);
      setToken(r.nextPageToken);
    } catch (e) {
      setError(e.message || 'Could not list storage');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(prefix);
  }, [prefix, load]);

  const crumbs = prefix.split('/').filter(Boolean);
  // the viewer steps through images only, so non-image files don't break paging
  const images = files.filter(f => f.isImage);

  return (
    <div className="amb-card">
      <div className="amb-card-head d-flex align-items-center gap-2 flex-wrap">
        <i className="bi bi-folder2-open text-primary" />
        <button className="amb-crumb" onClick={() => setPrefix('')}>
          storage
        </button>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span className="text-muted">/</span>
            <button
              className="amb-crumb"
              onClick={() => setPrefix(crumbs.slice(0, i + 1).join('/') + '/')}
            >
              {c}
            </button>
          </React.Fragment>
        ))}
        {loading && <span className="spinner-border spinner-border-sm ms-1" />}
      </div>

      <p className="text-muted small">
        Retention: <code>violations/</code> photos are kept forever; <code>detections/</code> and{' '}
        <code>heartbeats/</code> photos are deleted by the device after about a day.
      </p>

      {error && <div className="alert alert-warning py-2">{error}</div>}

      {folders.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          {folders.map(f => (
            <button key={f} className="amb-folder-chip" onClick={() => setPrefix(f)}>
              <i className="bi bi-folder-fill me-1" />
              {f.slice(prefix.length).replace(/\/$/, '')}
            </button>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="row g-2">
          {files.map(f => {
            const imgIndex = images.findIndex(i => i.name === f.name);
            const inner = (
              <>
                {f.isImage ? (
                  <SafeImg src={f.url} alt={f.shortName} className="amb-thumb" />
                ) : (
                  <div className="amb-file-icon">
                    <i className="bi bi-file-earmark" />
                  </div>
                )}
                <div className="amb-photo-meta">
                  <span className="amb-file-name">{f.shortName}</span>
                </div>
              </>
            );
            return (
              <div className="col-6 col-md-3 col-xl-2" key={f.name}>
                {f.isImage ? (
                  <button
                    className="amb-photo w-100"
                    onClick={() => viewer.open(imgIndex)}
                    title={f.shortName}
                    type="button"
                  >
                    {inner}
                  </button>
                ) : (
                  <a
                    className="amb-photo"
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    title={f.shortName}
                  >
                    {inner}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewer.isOpen && (
        <Lightbox
          items={images}
          index={viewer.index}
          onClose={viewer.close}
          onIndex={viewer.setIndex}
        />
      )}

      {!loading && folders.length === 0 && files.length === 0 && !error && (
        <p className="text-muted mb-0">Empty folder.</p>
      )}

      {token && (
        <button
          className="btn btn-sm btn-outline-primary mt-3"
          disabled={loading}
          onClick={() => load(prefix, token)}
        >
          Load more
        </button>
      )}
    </div>
  );
}
