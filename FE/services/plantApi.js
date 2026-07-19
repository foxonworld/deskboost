import { get, post, put, del } from "./api";
import { normalizeMarketplaceImages } from "./marketplaceImages";
import { normalizeMarketplaceCategory } from "./marketplaceCatalog";

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

const healthStatusMap = {
  healthy: "healthy",
  needswater: "needs-water",
  "needs-water": "needs-water",
  needs_water: "needs-water",
  warning: "needs-water",
  issue: "issue",
  critical: "issue",
};

const normalizeHealthStatus = (...values) => {
  const raw = firstValue(...values);
  const key = String(raw || "healthy").trim().toLowerCase();
  return healthStatusMap[key] || key || "healthy";
};

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

export const normalizeMarketplacePlant = (plant = {}) => {
  const imageState = normalizeMarketplaceImages(plant);
  const categoryRaw = plant.category ?? plant.Category ?? "";
  return {
    ...plant,
    id: firstValue(plant.id, plant.Id),
    name: firstValue(plant.name, plant.Name),
    description: firstValue(plant.description, plant.Description),
    image: imageState.primaryImage,
    imageUrl: imageState.primaryImage,
    images: imageState.images,
    primaryImage: imageState.primaryImage,
    price: plant.price ?? parsePrice(firstValue(plant.priceText, plant.PriceText)),
    priceText: firstValue(plant.priceText, plant.PriceText),
    category: normalizeMarketplaceCategory(categoryRaw),
    categoryRaw,
    careLevel: firstValue(plant.careLevel, plant.CareLevel),
    light: firstValue(plant.light, plant.Light),
    water: firstValue(plant.water, plant.Water),
    attributesJson: firstValue(plant.attributesJson, plant.AttributesJson),
    contactUrl: firstValue(plant.contactUrl, plant.ContactUrl),
    tags: plant.tags || [firstValue(plant.careLevel, plant.CareLevel), firstValue(plant.light, plant.Light)].filter(Boolean),
    difficulty: plant.difficulty || firstValue(plant.careLevel, plant.CareLevel),
    status: statusMap[String(plant.status || "active").toLowerCase()] || plant.status || "Active",
    ownershipCode: firstValue(plant.ownershipCode, plant.OwnershipCode, plant.plantCode, plant.PlantCode),
    ownershipStatus: firstValue(plant.ownershipStatus, plant.OwnershipStatus, plant.claimStatus, plant.ClaimStatus),
    isClaimed: parseBoolean(firstValue(plant.isClaimed, plant.IsClaimed, plant.claimedAt, plant.ClaimedAt)),
  };
};

export const normalizeMyPlant = (plant = {}) => ({
  ...plant,
  id: firstValue(plant.id, plant.Id),
  marketplaceItemId: firstValue(plant.marketplaceItemId, plant.MarketplaceItemId),
  claimCodeId: firstValue(plant.claimCodeId, plant.ClaimCodeId),
  nickname: plant.nickname || plant.Nickname || plant.name || plant.Name,
  name: plant.name || plant.Name || plant.nickname || plant.Nickname,
  species: firstValue(plant.species, plant.Species, plant.speciesName, plant.SpeciesName),
  location: firstValue(plant.location, plant.Location),
  image: firstValue(plant.image, plant.imageUrl, plant.ImageUrl),
  imageUrl: firstValue(plant.imageUrl, plant.ImageUrl, plant.image),
  status: normalizeHealthStatus(plant.status, plant.Status, plant.lastCondition, plant.LastCondition),
  statusSource: firstValue(plant.statusSource, plant.StatusSource, "unknown"),
  statusUpdatedAt: firstValue(plant.statusUpdatedAt, plant.StatusUpdatedAt),
  lastWateredAt: firstValue(plant.lastWateredAt, plant.LastWateredAt),
  lastDiagnosisAt: firstValue(plant.lastDiagnosisAt, plant.LastDiagnosisAt),
  careLevel: firstValue(plant.careLevel, plant.CareLevel),
  light: firstValue(plant.light, plant.Light),
  water: firstValue(plant.water, plant.Water),
  lastCondition: firstValue(plant.lastCondition, plant.LastCondition),
  wateringCycleDays: Number(firstValue(plant.wateringCycleDays, plant.WateringCycleDays, 0)),
  notes: firstValue(plant.notes, plant.Notes),
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
  get("/marketplace-items", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeMarketplacePlant),
  }));

export const getMarketplacePlant = (id) =>
  get(`/marketplace-items/${id}`).then(normalizeMarketplacePlant);

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
export const getPlantCareProfile = (id) => get(`/my-plants/${id}/care-profile`).then((data) => ({
  ...data,
  plant: normalizeMyPlant(data?.plant),
}));
export const updateMyPlant = (id, payload) =>
  put(`/my-plants/${id}`, toMyPlantPayload(payload)).then(normalizeMyPlant);
export const deleteMyPlant = (id) => del(`/my-plants/${id}`);
export const getClaimPreview = (code) =>
  get("/my-plants/claim-preview", { code }).then((data) => {
    const marketplaceItem = firstValue(data?.marketplaceItem, data?.MarketplaceItem, null);
    return {
      ...data,
      valid: Boolean(firstValue(data?.valid, data?.Valid, false)),
      codeStatus: firstValue(data?.codeStatus, data?.CodeStatus),
      marketplaceItem: marketplaceItem ? normalizeMarketplacePlant(marketplaceItem) : null,
    };
  });
export const claimMyPlant = (payload) =>
  post("/my-plants/claim", payload).then(normalizeMyPlant);

// Backward-compatible aliases during MVP cleanup.
export const apiGetPlants = getCatalogPlants;
export const apiGetPlantById = getCatalogPlant;
export const apiGetMyPlants = getMyPlants;
export const apiAddMyPlant = createMyPlant;
export const apiGetMyPlantById = getMyPlant;
export const apiUpdateMyPlant = updateMyPlant;
export const apiDeleteMyPlant = deleteMyPlant;
