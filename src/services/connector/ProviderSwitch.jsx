/**
 * ProviderSwitch — the visible "Firebase | Django" toggle. Drop it into an admin
 * header or settings panel. Reads/writes the persisted active data provider.
 */
import React from 'react';
import { useDataProvider, PROVIDERS } from './ProviderContext';

export default function ProviderSwitch({ className = '' }) {
  const { provider, setProvider } = useDataProvider();

  return (
    <div className={`btn-group btn-group-sm ${className}`} role="group" aria-label="Data source">
      <button
        type="button"
        className={`btn ${provider === PROVIDERS.FIREBASE ? 'btn-warning' : 'btn-outline-secondary'}`}
        onClick={() => setProvider(PROVIDERS.FIREBASE)}
      >
        <i className="bi bi-fire me-1" /> Firebase
      </button>
      <button
        type="button"
        className={`btn ${provider === PROVIDERS.DJANGO ? 'btn-success' : 'btn-outline-secondary'}`}
        onClick={() => setProvider(PROVIDERS.DJANGO)}
      >
        <i className="bi bi-server me-1" /> Django
      </button>
    </div>
  );
}
