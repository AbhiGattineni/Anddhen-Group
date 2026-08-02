/**
 * Connector facade — resource-based data access that delegates to the active
 * provider's adapter. Import `connector` anywhere (hooks, components, react-query).
 *
 *   connector.list('subsidiaries')
 *   connector.get('consultants', id)
 *   connector.create('transactions', data)
 *   connector.update('packages', id, data)
 *   connector.remove('products', id)
 *
 * The active provider is a module-level value kept in sync by DataProviderProvider,
 * so both React and non-React callers resolve the same adapter. Default is 'django'
 * (Phase 1 — behavior-identical to the pre-connector code path).
 */
import { PROVIDERS } from './types';
import { djangoAdapter } from './adapters/djangoAdapter';
import { firebaseAdapter } from './adapters/firebaseAdapter';

const ADAPTERS = {
  [PROVIDERS.DJANGO]: djangoAdapter,
  [PROVIDERS.FIREBASE]: firebaseAdapter,
};

let activeProvider = PROVIDERS.FIREBASE;

export function setActiveProvider(provider) {
  if (!ADAPTERS[provider]) throw new Error(`[connector] unknown provider "${provider}"`);
  activeProvider = provider;
}

export function getActiveProvider() {
  return activeProvider;
}

const adapter = () => ADAPTERS[activeProvider];

export const connector = {
  list: (resource, opts) => adapter().list(resource, opts),
  get: (resource, id) => adapter().get(resource, id),
  byField: (resource, field, value) => adapter().byField(resource, field, value),
  create: (resource, data, id) => adapter().create(resource, data, id),
  update: (resource, id, data) => adapter().update(resource, id, data),
  remove: (resource, id) => adapter().remove(resource, id),
  query: (resource, opts) => adapter().query(resource, opts),
  uploadFile: (path, file) => adapter().uploadFile(path, file),
  callFunction: (name, payload) => adapter().callFunction(name, payload),
};

export { PROVIDERS };
export default connector;
