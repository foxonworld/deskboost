import { get, post, put, del } from "./api";

export const getCatalogPlants = (params) => get("/plants", params);
export const getCatalogPlant = (id) => get(`/plants/${id}`);

export const getMyPlants = () => get("/my-plants");
export const createMyPlant = (payload) => post("/my-plants", payload);
export const getMyPlant = (id) => get(`/my-plants/${id}`);
export const updateMyPlant = (id, payload) => put(`/my-plants/${id}`, payload);
export const deleteMyPlant = (id) => del(`/my-plants/${id}`);

// Backward-compatible aliases during MVP cleanup.
export const apiGetPlants = getCatalogPlants;
export const apiGetPlantById = getCatalogPlant;
export const apiGetMyPlants = getMyPlants;
export const apiAddMyPlant = createMyPlant;
export const apiGetMyPlantById = getMyPlant;
export const apiUpdateMyPlant = updateMyPlant;
export const apiDeleteMyPlant = deleteMyPlant;
