import { del, get, post, put } from "./api";

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.data || []);
const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

export const normalizeAdminSummary = (summary = {}) => ({
  users: Number(firstValue(summary.users, summary.Users, 0)),
  userPlants: Number(firstValue(summary.userPlants, summary.UserPlants, 0)),
  marketplacePlants: Number(firstValue(summary.marketplacePlants, summary.MarketplacePlants, 0)),
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
  name: firstValue(plant.name, plant.Name),
  species: firstValue(plant.species, plant.Species),
  location: firstValue(plant.location, plant.Location),
  status: firstValue(plant.status, plant.Status),
  createdAt: firstValue(plant.createdAt, plant.CreatedAt),
});

export const normalizeAdminAiDialog = (dialog = {}) => ({
  ...dialog,
  id: firstValue(dialog.id, dialog.Id),
  plantId: firstValue(dialog.plantId, dialog.PlantId),
  plantName: firstValue(dialog.plantName, dialog.PlantName),
  title: firstValue(dialog.title, dialog.Title),
  lastMessage: firstValue(dialog.lastMessage, dialog.LastMessage),
  createdAt: firstValue(dialog.createdAt, dialog.CreatedAt),
});

export const normalizeAdminMarketplacePlant = (plant = {}) => ({
  ...plant,
  id: firstValue(plant.id, plant.Id),
  name: firstValue(plant.name, plant.Name),
  description: firstValue(plant.description, plant.Description),
  imageUrl: firstValue(plant.imageUrl, plant.ImageUrl),
  priceText: firstValue(plant.priceText, plant.PriceText),
  careLevel: firstValue(plant.careLevel, plant.CareLevel),
  light: firstValue(plant.light, plant.Light),
  water: firstValue(plant.water, plant.Water),
  contactUrl: firstValue(plant.contactUrl, plant.ContactUrl),
  status: firstValue(plant.status, plant.Status),
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
  get("/admin/marketplace-plants", params).then((data) => ({
    ...data,
    items: normalizeItems(data).map(normalizeAdminMarketplacePlant),
    source: "backend",
  }));

export const createAdminMarketplacePlant = (payload) =>
  post("/admin/marketplace-plants", payload).then(normalizeAdminMarketplacePlant);

export const updateAdminMarketplacePlant = (id, payload) =>
  put(`/admin/marketplace-plants/${id}`, payload).then(normalizeAdminMarketplacePlant);

export const deleteAdminMarketplacePlant = (id) =>
  del(`/admin/marketplace-plants/${id}`);

export const createAdminFeedback = () =>
  Promise.reject(new Error("Backend endpoint required"));

export const getAdminFeedback = () =>
  Promise.resolve({ items: [], source: "backend-blocked", supported: false });

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
