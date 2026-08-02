/**
 * ProviderContext — holds the active data provider ('firebase' | 'django'),
 * persisted to localStorage. This backs the visible "Firebase | Django" switch.
 *
 * Default resolution order:
 *   1. localStorage('anddhen.dataProvider')  (user's last choice)
 *   2. REACT_APP_DATA_PROVIDER                (build-time default)
 *   3. 'firebase'                             (migration landed — Firebase is primary;
 *                                              Django only via explicit env/switch)
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { PROVIDERS } from './types';
import { setActiveProvider } from './index';

const STORAGE_KEY = 'anddhen.dataProvider';

function resolveInitial() {
  const stored = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
  if (stored === PROVIDERS.FIREBASE || stored === PROVIDERS.DJANGO) return stored;
  const env = process.env.REACT_APP_DATA_PROVIDER;
  if (env === PROVIDERS.FIREBASE || env === PROVIDERS.DJANGO) return env;
  return PROVIDERS.FIREBASE;
}

const ProviderContext = createContext({ provider: PROVIDERS.DJANGO, setProvider: () => {} });

export function DataProviderProvider({ children }) {
  const [provider, setProviderState] = useState(resolveInitial);

  // Keep the module-level facade in sync so non-React callers resolve correctly.
  useEffect(() => {
    setActiveProvider(provider);
  }, [provider]);

  const value = useMemo(
    () => ({
      provider,
      setProvider: next => {
        window.localStorage.setItem(STORAGE_KEY, next);
        setProviderState(next);
      },
    }),
    [provider]
  );

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

DataProviderProvider.propTypes = {
  children: PropTypes.node,
};

export const useDataProvider = () => useContext(ProviderContext);
export { PROVIDERS };
