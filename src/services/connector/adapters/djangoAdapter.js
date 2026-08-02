/**
 * Django adapter — reproduces the app's existing axios REST behavior exactly,
 * routed through the resource registry. Selecting the "django" provider must be
 * behavior-identical to the pre-connector code path.
 */
import axios from 'axios';
import { getResource, FUNCTIONS } from '../registry';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const url = path => `${API_BASE_URL}${path}`;

function requirePath(resource, op, builder, arg) {
  if (!builder) {
    throw new Error(`[django] resource "${resource}" has no "${op}" endpoint`);
  }
  return url(builder(arg));
}

export const djangoAdapter = {
  async list(resource /*, opts */) {
    const { django } = getResource(resource);
    const res = await axios.get(requirePath(resource, 'list', django.list));
    return res.data;
  },

  async get(resource, id) {
    const { django } = getResource(resource);
    const res = await axios.get(requirePath(resource, 'detail', django.detail, id));
    return res.data;
  },

  // Server-side "by <field>" lookups (e.g. /get_status_by_id/:id) that Django
  // implements as a filtered list. The field name is implicit in the endpoint;
  // only the value is sent. Mirrors firebaseAdapter.byField (which uses a where()).
  async byField(resource, _field, value) {
    const { django } = getResource(resource);
    const res = await axios.get(requirePath(resource, 'detail', django.detail, value));
    return res.data;
  },

  async create(resource, data) {
    const { django } = getResource(resource);
    const res = await axios.post(requirePath(resource, 'create', django.create), data);
    return res.data;
  },

  async update(resource, id, data) {
    const { django } = getResource(resource);
    const res = await axios.put(requirePath(resource, 'update', django.update, id), data);
    return res.data;
  },

  async remove(resource, id) {
    const { django } = getResource(resource);
    await axios.delete(requirePath(resource, 'remove', django.remove, id));
  },

  // Django has no generic query language; filtering is done per-endpoint.
  // For parity we fetch the list and let the caller filter, unless a resource
  // exposes a dedicated filter endpoint via django.extra.filter.
  async query(resource, opts = {}) {
    const { django } = getResource(resource);
    if (django.extra && django.extra.filter) {
      const res = await axios.get(url(django.extra.filter()), { params: opts.params });
      return res.data;
    }
    return this.list(resource, opts);
  },

  async uploadFile(_path, file) {
    // Django stores files via multipart on the owning resource endpoint; callers
    // that need this pass FormData through create/update instead. Kept for parity.
    throw new Error('[django] uploadFile is handled inline via multipart create/update');
  },

  async callFunction(name, payload) {
    const def = FUNCTIONS[name];
    if (!def) throw new Error(`[django] unknown function "${name}"`);
    const res = await axios.post(url(def.django()), payload);
    return res.data;
  },
};
