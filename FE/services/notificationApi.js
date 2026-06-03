import { del, get, patch, post } from './api';

// ─── Normalizer ───────────────────────────────────────────────────────────────
const firstValue = (...vals) => vals.find((v) => v !== undefined && v !== null) ?? '';

export const normalizeNotification = (n = {}) => ({
  id: firstValue(n.id, n.Id),
  title: firstValue(n.title, n.Title),
  body: firstValue(n.body, n.Body, n.content, n.Content),
  type: firstValue(n.type, n.Type, 'announcement'),
  targetType: firstValue(n.targetType, n.TargetType, 'all'),
  targetUserIds: n.targetUserIds ?? n.TargetUserIds ?? null,
  createdAt: firstValue(n.createdAt, n.CreatedAt),
  isRead: Boolean(n.isRead),
});

// ─── User API ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách thông báo của user hiện tại.
 */
export const getUserNotifications = async () => {
  const data = await get('/notifications');
  const items = Array.isArray(data) ? data : data?.items || [];
  return items.map((n) => normalizeNotification(n));
};

/**
 * Đánh dấu đã đọc 1 thông báo.
 */
export const markNotificationRead = async (id) => {
  await patch(`/notifications/${id}/read`);
};

/**
 * Đánh dấu tất cả đã đọc.
 */
export const markAllNotificationsRead = async () => {
  await patch('/notifications/read-all');
};

// ─── Admin API ────────────────────────────────────────────────────────────────

/**
 * Admin gửi thông báo.
 * payload: { title, body, type, targetType, targetUserIds? }
 */
export const adminSendNotification = async (payload) => {
  const result = await post('/admin/notifications', payload);
  return normalizeNotification(result);
};

/**
 * Admin lấy danh sách thông báo đã gửi.
 */
export const adminGetNotifications = async () => {
  const data = await get('/admin/notifications');
  const items = Array.isArray(data) ? data : data?.items || [];
  return items.map((n) => normalizeNotification(n));
};

/**
 * Admin xóa thông báo.
 */
export const adminDeleteNotification = async (id) => {
  await del(`/admin/notifications/${id}`);
};
