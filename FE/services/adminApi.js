import { del, get, post, put } from "./api";
import { VERIFIED_FEEDBACK } from "../data/mockData";

const USE_MOCK_ADMIN = import.meta.env.VITE_USE_MOCK_ADMIN !== "false";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();

const mockUsers = [
  {
    id: "usr_mock_001",
    name: "DeskBoost User",
    email: "user@example.com",
    role: "USER",
    status: "active",
    createdAt: "2026-05-14T10:00:00.000Z",
  },
  {
    id: "usr_mock_002",
    name: "DeskBoost Admin",
    email: "admin@example.com",
    role: "ADMIN",
    status: "active",
    createdAt: "2026-05-14T11:00:00.000Z",
  },
];

const mockUserPlants = [
  {
    id: "upl_mock_001",
    userId: "usr_mock_001",
    userName: "DeskBoost User",
    name: "Spikey",
    species: "Sansevieria Trifasciata",
    status: "thriving",
    updatedAt: now(),
  },
  {
    id: "upl_mock_002",
    userId: "usr_mock_001",
    userName: "DeskBoost User",
    name: "Monstera Mike",
    species: "Monstera Deliciosa",
    status: "needs-water",
    updatedAt: now(),
  },
];

const mockMarketplacePlants = [
  {
    id: "mpl_mock_001",
    name: "Cây Lưỡi Hổ",
    description: "Chịu hạn tốt, hợp bàn làm việc.",
    imageUrl:
      "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?q=80&w=800&auto=format&fit=crop",
    priceText: "280,000 VND",
    careLevel: "easy",
    light: "low",
    water: "monthly",
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
    status: "active",
  },
  {
    id: "mpl_mock_002",
    name: "Cây Trầu Bà Lá Xẻ",
    description: "Cây nội thất dễ chăm.",
    imageUrl:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
    priceText: "450,000 VND",
    careLevel: "easy",
    light: "indirect",
    water: "weekly",
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
    status: "active",
  },
];

const mockAiDialogs = [
  {
    id: "dlg_mock_001",
    plantId: "upl_mock_001",
    plantName: "Spikey",
    userName: "DeskBoost User",
    lastMessage: "Water only when soil is dry.",
    createdAt: now(),
  },
];

const mockAdminFeedback = VERIFIED_FEEDBACK.map((feedback) => ({
  ...feedback,
  evidenceNote:
    "Private admin note: manually checked social chat before publishing.",
}));

const wrapItems = (items) => ({
  items,
  pagination: {
    page: 1,
    limit: items.length,
    total: items.length,
    totalPages: 1,
  },
  source: "mock-fallback",
});

const requestWithFallback = async (requestFn, fallbackFn) => {
  if (USE_MOCK_ADMIN) {
    await delay();
    return fallbackFn();
  }

  try {
    return await requestFn();
  } catch (error) {
    await delay();
    return fallbackFn();
  }
};

export const getAdminSummary = () =>
  requestWithFallback(
    () => get("/admin/summary"),
    () => ({
      users: mockUsers.length,
      userPlants: mockUserPlants.length,
      marketplacePlants: mockMarketplacePlants.length,
      aiDialogs: mockAiDialogs.length,
      aiConfigured: false,
      source: "mock-fallback",
    }),
  );

export const getAdminUsers = (params) =>
  requestWithFallback(
    () => get("/admin/users", params),
    () => wrapItems(mockUsers),
  );

export const getAdminUser = (id) =>
  requestWithFallback(
    () => get(`/admin/users/${id}`),
    () => mockUsers.find((user) => user.id === id) || null,
  );

export const updateAdminUserStatus = (id, payload) =>
  requestWithFallback(
    () => put(`/admin/users/${id}/status`, payload),
    () => ({ id, ...payload, updatedAt: now(), source: "mock-fallback" }),
  );

export const getAdminUserPlants = (params) =>
  requestWithFallback(
    () => get("/admin/user-plants", params),
    () => wrapItems(mockUserPlants),
  );

export const getAdminUserPlant = (id) =>
  requestWithFallback(
    () => get(`/admin/user-plants/${id}`),
    () => mockUserPlants.find((plant) => plant.id === id) || null,
  );

export const updateAdminUserPlantStatus = (id, payload) =>
  requestWithFallback(
    () => put(`/admin/user-plants/${id}/status`, payload),
    () => ({ id, ...payload, updatedAt: now(), source: "mock-fallback" }),
  );

export const getAdminMarketplacePlants = (params) =>
  requestWithFallback(
    () => get("/admin/marketplace-plants", params),
    () => wrapItems(mockMarketplacePlants),
  );

export const createAdminMarketplacePlant = (payload) =>
  requestWithFallback(
    () => post("/admin/marketplace-plants", payload),
    () => ({
      id: `mpl_mock_${Date.now()}`,
      ...payload,
      source: "mock-fallback",
    }),
  );

export const updateAdminMarketplacePlant = (id, payload) =>
  requestWithFallback(
    () => put(`/admin/marketplace-plants/${id}`, payload),
    () => ({ id, ...payload, updatedAt: now(), source: "mock-fallback" }),
  );

export const deleteAdminMarketplacePlant = (id) =>
  requestWithFallback(
    () => del(`/admin/marketplace-plants/${id}`),
    () => ({ id, deleted: true, source: "mock-fallback" }),
  );

export const createAdminFeedback = (payload) =>
  requestWithFallback(
    () => post("/admin/feedback", payload),
    () => ({
      id: `fb_mock_${Date.now()}`,
      ...payload,
      createdAt: now(),
      source: "mock-fallback",
    }),
  );

export const getAdminFeedback = (params) =>
  requestWithFallback(
    () => get("/admin/feedback", params),
    () => wrapItems(mockAdminFeedback),
  );

export const getAdminAiDialogs = (params) =>
  requestWithFallback(
    () => get("/admin/ai-dialogs", params),
    () => wrapItems(mockAiDialogs),
  );

export const getAdminAiDialog = (id) =>
  requestWithFallback(
    () => get(`/admin/ai-dialogs/${id}`),
    () => mockAiDialogs.find((dialog) => dialog.id === id) || null,
  );

export const getAdminAiConfigStatus = () =>
  requestWithFallback(
    () => get("/admin/ai-config/status"),
    () => ({
      provider: "gemini",
      configured: false,
      mode: "mock-fallback",
      lastCheckedAt: now(),
      source: "mock-fallback",
    }),
  );
