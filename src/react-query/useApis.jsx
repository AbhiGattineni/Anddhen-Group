import axios from 'axios';
import { getActiveProvider, PROVIDERS } from 'src/services/connector';
import { firebaseAdapter } from 'src/services/connector/adapters/firebaseAdapter';
import { resolveDjangoUrl } from 'src/services/connector/registry';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// When the Firebase provider is active and the URL maps to a known resource,
// serve the request from Firestore via the connector; otherwise fall back to the
// legacy Django (axios) call so nothing regresses for unmapped/irregular URLs.
const isFirebase = () => getActiveProvider() === PROVIDERS.FIREBASE;

export const fetchData = async url => {
  if (isFirebase()) {
    const r = resolveDjangoUrl('GET', url);
    if (r && r.op === 'list') return firebaseAdapter.list(r.resource);
    if (r && r.op === 'get') return firebaseAdapter.get(r.resource, r.id);
  }
  const response = await axios.get(`${API_BASE_URL}${url}`);
  return response.data;
};

export const addData = async (url, newData) => {
  if (isFirebase()) {
    const r = resolveDjangoUrl('POST', url);
    if (r && r.op === 'create') return firebaseAdapter.create(r.resource, newData);
  }
  const response = await axios.post(`${API_BASE_URL}${url}`, newData);
  return response.data;
};

export const updateData = async (url, updatedData) => {
  if (isFirebase()) {
    const r = resolveDjangoUrl('PUT', url);
    if (r && r.op === 'update') return firebaseAdapter.update(r.resource, r.id, updatedData);
  }
  const response = await axios.put(`${API_BASE_URL}${url}`, updatedData);
  return response.data;
};

export const deleteData = async url => {
  if (isFirebase()) {
    const r = resolveDjangoUrl('DELETE', url);
    if (r && r.op === 'remove') {
      await firebaseAdapter.remove(r.resource, r.id);
      return url;
    }
  }
  await axios.delete(`${API_BASE_URL}${url}`);
  return url;
};
