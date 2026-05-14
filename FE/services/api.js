/**
 * Base API utility for DeskBoost.
 * All service files import from here.
 *
 * Set VITE_API_URL in .env.local to point to your backend.
 * Default: http://localhost:8080/api
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token')
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
});

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
};

export const get  = (path) =>
  fetch(`${BASE}${path}`, { headers: getHeaders() }).then(handle);

export const post = (path, body) =>
  fetch(`${BASE}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handle);

export const put  = (path, body) =>
  fetch(`${BASE}${path}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handle);

export const del  = (path) =>
  fetch(`${BASE}${path}`, { method: 'DELETE', headers: getHeaders() }).then(handle);
