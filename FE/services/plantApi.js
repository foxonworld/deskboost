import { get, post, put, del } from "./api";

const statusMap = {
  active: "Active",
  hidden: "Hidden",
  inactive: "Hidden",
  archived: "Hidden",
  "out-of-stock": "Out of Stock",
  out_of_stock: "Out of Stock",
};

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.data || []);
const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const parsePrice = (priceText) => {
  if (!priceText) return 0;
  const value = Number(String(priceText).replace(/[^\d]/g, ""));
  return Number.isFinite(value) ? value : 0;
};

export const normalizeMarketplacePlant = (plant = {}) => ({
  ...plant,
  image: plant.image || plant.imageUrl,
  imageUrl: plant.imageUrl || plant.image,
  price: plant.price ?? parsePrice(plant.priceText),
  priceText: plant.priceText,
  category: plant.category || "Trong nhà",
  tags: plant.tags || [plant.careLevel, plant.light].filter(Boolean),
  difficulty: plant.difficulty || plant.careLevel,
  status: statusMap[String(plant.status || "active").toLowerCase()] || plant.status || "Active",
  ownershipCode: firstValue(plant.ownershipCode, plant.OwnershipCode, plant.plantCode, plant.PlantCode),
  ownershipStatus: firstValue(plant.ownershipStatus, plant.OwnershipStatus, plant.claimStatus, plant.ClaimStatus),
  isClaimed: parseBoolean(firstValue(plant.isClaimed, plant.IsClaimed, plant.claimedAt, plant.ClaimedAt)),
});

export const normalizeMyPlant = (plant = {}) => ({
  ...plant,
  nickname: plant.nickname || plant.name,
  name: plant.name || plant.nickname,
  image: plant.image || plant.imageUrl,
  imageUrl: plant.imageUrl || plant.image,
  ownershipCode: firstValue(plant.ownershipCode, plant.OwnershipCode, plant.plantCode, plant.PlantCode),
  ownershipStatus: firstValue(plant.ownershipStatus, plant.OwnershipStatus, plant.claimStatus, plant.ClaimStatus),
  isClaimed: parseBoolean(firstValue(plant.isClaimed, plant.IsClaimed, plant.claimedAt, plant.ClaimedAt)),
});

const toMyPlantPayload = (payload = {}) => ({
  name: payload.name || payload.nickname,
  species: payload.species,
  location: payload.location,
  imageUrl: payload.imageUrl,
  status: payload.status,
  notes: payload.notes,
});

export const getMarketplacePlants = (params) =>
  get("/marketplace-plants", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeMarketplacePlant),
  }));

export const getMarketplacePlant = (id) =>
  get(`/marketplace-plants/${id}`).then(normalizeMarketplacePlant);

export const getCatalogPlants = getMarketplacePlants;
export const getCatalogPlant = getMarketplacePlant;

export const getMyPlants = () =>
  get("/my-plants").then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeMyPlant),
  }));
export const createMyPlant = (payload) =>
  post("/my-plants", toMyPlantPayload(payload)).then(normalizeMyPlant);
export const getMyPlant = (id) => get(`/my-plants/${id}`).then(normalizeMyPlant);
export const updateMyPlant = (id, payload) =>
  put(`/my-plants/${id}`, toMyPlantPayload(payload)).then(normalizeMyPlant);
export const deleteMyPlant = (id) => del(`/my-plants/${id}`);

// Backward-compatible aliases during MVP cleanup.
export const apiGetPlants = getCatalogPlants;
export const apiGetPlantById = getCatalogPlant;
export const apiGetMyPlants = getMyPlants;
export const apiAddMyPlant = createMyPlant;
export const apiGetMyPlantById = getMyPlant;
export const apiUpdateMyPlant = updateMyPlant;
export const apiDeleteMyPlant = deleteMyPlant;
