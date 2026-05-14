import { get, post, put, del } from './api';

/**
 * Plant catalog (marketplace) & user's plant collection API
 * TODO: connect to backend when ready
 */

// ── Public catalog ──────────────────────────────────────────
export const apiGetPlants       = ()       => get('/plants');
export const apiGetPlantById    = (id)     => get(`/plants/${id}`);

// ── My plants (requires auth) ────────────────────────────────
export const apiGetMyPlants     = ()       => get('/my-plants');
export const apiAddMyPlant      = (data)   => post('/my-plants', data);
export const apiGetMyPlantById  = (id)     => get(`/my-plants/${id}`);
export const apiUpdateMyPlant   = (id, d)  => put(`/my-plants/${id}`, d);
export const apiDeleteMyPlant   = (id)     => del(`/my-plants/${id}`);
