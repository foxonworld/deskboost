import { del, get, patch, post, put } from "./api";

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.data || []);
const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

export const normalizeAdminSummary = (summary = {}) => ({
  users: Number(firstValue(summary.users, summary.Users, 0)),
  userPlants: Number(firstValue(summary.userPlants, summary.UserPlants, 0)),
  marketplacePlants: Number(firstValue(summary.marketplaceItems, summary.MarketplaceItems, summary.marketplacePlants, summary.MarketplacePlants, 0)),
  aiDialogs: Number(firstValue(summary.aiDialogs, summary.AiDialogs, 0)),
  aiConfigured: Boolean(firstValue(summary.aiConfigured, summary.AiConfigured, false)),
  source: "backend",
});

export const normalizeAdminUser = (user = {}) => ({
  ...user,
  id: firstValue(user.id, user.Id),
  name: firstValue(user.name, user.Name, user.fullName, user.FullName, user.email, user.Email),
  email: firstValue(user.email, user.Email),
  role: firstValue(user.role, user.Role),
  status: firstValue(user.status, user.Status),
  avatarUrl: firstValue(user.avatarUrl, user.AvatarUrl),
  phone: firstValue(user.phone, user.Phone),
  createdAt: firstValue(user.createdAt, user.CreatedAt),
});

export const normalizeAdminUserPlant = (plant = {}) => ({
  ...plant,
  id: firstValue(plant.id, plant.Id),
  userId: firstValue(plant.userId, plant.UserId),
  userEmail: firstValue(plant.userEmail, plant.UserEmail),
  userName: firstValue(plant.userName, plant.UserName, plant.userEmail, plant.UserEmail),
  marketplaceItemId: firstValue(plant.marketplaceItemId, plant.MarketplaceItemId),
  marketplaceItemName: firstValue(plant.marketplaceItemName, plant.MarketplaceItemName),
  claimCodeId: firstValue(plant.claimCodeId, plant.ClaimCodeId),
  claimCode: firstValue(plant.claimCode, plant.ClaimCode),
  name: firstValue(plant.name, plant.Name),
  nickname: firstValue(plant.nickname, plant.Nickname),
  species: firstValue(plant.species, plant.Species, plant.speciesName, plant.SpeciesName),
  location: firstValue(plant.location, plant.Location),
  status: firstValue(plant.status, plant.Status),
  careLevel: firstValue(plant.careLevel, plant.CareLevel),
  light: firstValue(plant.light, plant.Light),
  water: firstValue(plant.water, plant.Water),
  notes: firstValue(plant.notes, plant.Notes),
  ownershipCode: firstValue(plant.ownershipCode, plant.OwnershipCode),
  ownershipStatus: firstValue(plant.ownershipStatus, plant.OwnershipStatus),
  isClaimed: Boolean(firstValue(plant.isClaimed, plant.IsClaimed, false)),
  claimedAt: firstValue(plant.claimedAt, plant.ClaimedAt),
  createdAt: firstValue(plant.createdAt, plant.CreatedAt),
  updatedAt: firstValue(plant.updatedAt, plant.UpdatedAt),
});

export const normalizeAdminAiDialog = (dialog = {}) => ({
  ...dialog,
  id: firstValue(dialog.id, dialog.Id),
  userId: firstValue(dialog.userId, dialog.UserId),
  userName: firstValue(dialog.userName, dialog.UserName, dialog.fullName, dialog.FullName),
  userEmail: firstValue(dialog.userEmail, dialog.UserEmail, dialog.email, dialog.Email),
  plantId: firstValue(dialog.plantId, dialog.PlantId),
  plantName: firstValue(dialog.plantName, dialog.PlantName),
  title: firstValue(dialog.title, dialog.Title),
  lastMessage: firstValue(dialog.lastMessage, dialog.LastMessage),
  createdAt: firstValue(dialog.createdAt, dialog.CreatedAt),
  updatedAt: firstValue(dialog.updatedAt, dialog.UpdatedAt),
});

export const normalizePlantSpecies = (species = {}) => ({
  ...species,
  id: firstValue(species.id, species.Id),
  name: firstValue(species.name, species.Name),
  vietnameseName: firstValue(species.vietnameseName, species.VietnameseName),
  description: firstValue(species.description, species.Description),
  careInstructions: firstValue(species.careInstructions, species.CareInstructions),
  commonDiseases: firstValue(species.commonDiseases, species.CommonDiseases),
  imageUrl: firstValue(species.imageUrl, species.ImageUrl),
  isActive: Boolean(firstValue(species.isActive, species.IsActive, true)),
  createdAt: firstValue(species.createdAt, species.CreatedAt),
  updatedAt: firstValue(species.updatedAt, species.UpdatedAt),
});

export const normalizeAdminMarketplacePlant = (plant = {}) => ({
  ...plant,
  id: firstValue(plant.id, plant.Id),
  name: firstValue(plant.name, plant.Name),
  description: firstValue(plant.description, plant.Description),
  imageUrl: firstValue(plant.imageUrl, plant.ImageUrl),
  priceText: firstValue(plant.priceText, plant.PriceText),
  category: firstValue(plant.category, plant.Category),
  careLevel: firstValue(plant.careLevel, plant.CareLevel),
  light: firstValue(plant.light, plant.Light),
  water: firstValue(plant.water, plant.Water),
  attributesJson: firstValue(plant.attributesJson, plant.AttributesJson),
  contactUrl: firstValue(plant.contactUrl, plant.ContactUrl),
  status: firstValue(plant.status, plant.Status),
});

export const normalizeAdminPlantInventory = (plant = {}) => ({
  ...plant,
  id: firstValue(plant.id, plant.Id),
  marketplaceItemId: firstValue(plant.marketplaceItemId, plant.MarketplaceItemId),
  plantSpeciesId: firstValue(plant.plantSpeciesId, plant.PlantSpeciesId),
  name: firstValue(plant.name, plant.Name),
  speciesName: firstValue(plant.speciesName, plant.SpeciesName),
  imageUrl: firstValue(plant.imageUrl, plant.ImageUrl),
  location: firstValue(plant.location, plant.Location),
  wateringCycleDays: Number(firstValue(plant.wateringCycleDays, plant.WateringCycleDays, 0)),
  notes: firstValue(plant.notes, plant.Notes),
  ownershipCode: firstValue(plant.ownershipCode, plant.OwnershipCode),
  ownershipStatus: firstValue(plant.ownershipStatus, plant.OwnershipStatus),
  isClaimed: Boolean(firstValue(plant.isClaimed, plant.IsClaimed, false)),
  claimedAt: firstValue(plant.claimedAt, plant.ClaimedAt),
  userId: firstValue(plant.userId, plant.UserId),
  userEmail: firstValue(plant.userEmail, plant.UserEmail),
  claimCodeId: firstValue(plant.claimCodeId, plant.ClaimCodeId),
  claimCodeStatus: firstValue(plant.claimCodeStatus, plant.ClaimCodeStatus),
  createdAt: firstValue(plant.createdAt, plant.CreatedAt),
  updatedAt: firstValue(plant.updatedAt, plant.UpdatedAt),
});

export const normalizeAdminFeedback = (feedback = {}) => ({
  ...feedback,
  id: firstValue(feedback.id, feedback.Id),
  marketplaceItemId: firstValue(feedback.marketplaceItemId, feedback.MarketplaceItemId),
  customerAlias: firstValue(feedback.customerAlias, feedback.CustomerAlias),
  rating: Number(firstValue(feedback.rating, feedback.Rating, 0)),
  comment: firstValue(feedback.comment, feedback.Comment),
  purchaseChannel: firstValue(feedback.purchaseChannel, feedback.PurchaseChannel),
  publicImageUrls: firstValue(feedback.publicImageUrls, feedback.PublicImageUrls, []),
  evidenceImageUrls: firstValue(feedback.evidenceImageUrls, feedback.EvidenceImageUrls, []),
  evidenceNote: firstValue(feedback.evidenceNote, feedback.EvidenceNote),
  isVerified: Boolean(firstValue(feedback.isVerified, feedback.IsVerified, false)),
  verifiedAt: firstValue(feedback.verifiedAt, feedback.VerifiedAt),
  sourceType: firstValue(feedback.sourceType, feedback.SourceType),
  createdAt: firstValue(feedback.createdAt, feedback.CreatedAt),
  updatedAt: firstValue(feedback.updatedAt, feedback.UpdatedAt),
});

export const normalizeAdminAiConfigStatus = (status = {}) => ({
  provider: firstValue(status.provider, status.Provider),
  configured: Boolean(firstValue(status.configured, status.Configured, false)),
  lastCheckedAt: firstValue(status.lastCheckedAt, status.LastCheckedAt),
  source: "backend",
});

export const getAdminSummary = () =>
  get("/admin/summary").then(normalizeAdminSummary);

export const getAdminUsers = (params) =>
  get("/admin/users", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminUser),
    source: "backend",
  }));

export const getAdminUser = (id) =>
  get(`/admin/users/${id}`).then(normalizeAdminUser);

export const updateAdminUserStatus = (id, payload) =>
  put(`/admin/users/${id}/status`, payload).then(normalizeAdminUser);

export const getAdminUserPlants = (params) =>
  get("/admin/user-plants", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminUserPlant),
    source: "backend",
  }));

export const getAdminUserPlant = (id) =>
  get(`/admin/user-plants/${id}`).then(normalizeAdminUserPlant);

export const updateAdminUserPlantStatus = (id, payload) =>
  put(`/admin/user-plants/${id}/status`, payload).then((data) =>
    data ? normalizeAdminUserPlant(data) : { id, status: payload.status },
  );

export const getAdminMarketplacePlants = (params) =>
  get("/admin/marketplace-items", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminMarketplacePlant),
    source: "backend",
  }));

export const createAdminMarketplacePlant = (payload) =>
  post("/admin/marketplace-items", payload).then(normalizeAdminMarketplacePlant);

export const updateAdminMarketplacePlant = (id, payload) =>
  put(`/admin/marketplace-items/${id}`, payload).then(normalizeAdminMarketplacePlant);

export const deleteAdminMarketplacePlant = (id) =>
  del(`/admin/marketplace-items/${id}`);

export const getAdminPlantInventory = (params) =>
  get("/admin/plant-inventory", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminPlantInventory),
    source: "backend",
  }));

export const getAdminPlantInventoryItem = (id) =>
  get(`/admin/plant-inventory/${id}`).then(normalizeAdminPlantInventory);

export const createAdminPlantInventory = (payload) =>
  post("/admin/plant-inventory", payload).then(normalizeAdminPlantInventory);

export const updateAdminPlantInventory = (id, payload) =>
  put(`/admin/plant-inventory/${id}`, payload).then(normalizeAdminPlantInventory);

export const deleteAdminPlantInventory = (id) =>
  del(`/admin/plant-inventory/${id}`);

export const regenerateAdminPlantInventoryCode = (id) =>
  post(`/admin/plant-inventory/${id}/regenerate-code`).then(normalizeAdminPlantInventory);

export const getPlantSpecies = (params) =>
  get("/plant-species", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizePlantSpecies),
    source: "backend",
  }));

export const getAdminPlantSpecies = (params) =>
  get("/admin/plant-species", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizePlantSpecies),
    source: "backend",
  }));

export const createAdminPlantSpecies = (payload) =>
  post("/admin/plant-species", payload).then(normalizePlantSpecies);

export const updateAdminPlantSpecies = (id, payload) =>
  put(`/admin/plant-species/${id}`, payload).then(normalizePlantSpecies);

export const deleteAdminPlantSpecies = (id) =>
  del(`/admin/plant-species/${id}`);

export const createAdminFeedback = (payload) =>
  post("/admin/feedback", payload).then(normalizeAdminFeedback);

export const getAdminFeedback = (params) =>
  get("/admin/feedback", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminFeedback),
    source: "backend",
    supported: true,
  }));

export const updateAdminFeedback = (id, payload) =>
  put(`/admin/feedback/${id}`, payload).then(normalizeAdminFeedback);

export const verifyAdminFeedback = (id, payload) =>
  patch(`/admin/feedback/${id}/verify`, payload).then(normalizeAdminFeedback);

export const deleteAdminFeedback = (id) =>
  del(`/admin/feedback/${id}`);

export const getAdminAiDialogs = (params) =>
  get("/admin/ai-dialogs", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminAiDialog),
    source: "backend",
  }));

export const getAdminAiDialog = (id) =>
  get(`/admin/ai-dialogs/${id}`).then((data) => ({
    ...data,
    ...normalizeAdminAiDialog(data),
    messages: normalizeItems(data?.messages || data?.Messages).map((message) => ({
      ...message,
      id: firstValue(message.id, message.Id),
      role: firstValue(message.role, message.Role),
      content: firstValue(message.content, message.Content),
      createdAt: firstValue(message.createdAt, message.CreatedAt),
    })),
  }));

export const getAdminAiConfigStatus = () =>
  get("/admin/ai-config/status").then(normalizeAdminAiConfigStatus);
