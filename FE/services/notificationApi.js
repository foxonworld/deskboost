import { del, get, patch, post } from './api';

// ─── localStorage keys (mock only) ────────────────────────────────────────────
const READ_KEY = 'deskboost.notif_read';
const ADMIN_SENT_KEY = 'deskboost.admin_notifs';

const getReadSet = () => {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); }
  catch { return new Set(); }
};
const saveReadSet = (set) => localStorage.setItem(READ_KEY, JSON.stringify([...set]));

const getAdminSentMock = () => {
  try { return JSON.parse(localStorage.getItem(ADMIN_SENT_KEY) || '[]'); }
  catch { return []; }
};
const saveAdminSentMock = (list) => localStorage.setItem(ADMIN_SENT_KEY, JSON.stringify(list));

// ─── Mock data (hiển thị khi BE chưa sẵn sàng) ────────────────────────────────
const MOCK_NOTIFICATIONS = [
  {
    id: 'mock-notif-1',
    title: 'Khuyến mãi tháng 6 🎉',
    body: 'Giảm 20% tất cả cây cảnh nhỏ trong tháng 6. Liên hệ ngay qua Zalo để đặt hàng sớm!',
    type: 'promo',
    targetType: 'all',
    targetUserIds: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-notif-2',
    title: 'Lưu ý chăm cây mùa hè',
    body: 'Thời tiết nắng nóng, cây để bàn cần tưới thêm nước mỗi sáng. Tránh để cây dưới ánh nắng trực tiếp.',
    type: 'care_tip',
    targetType: 'all',
    targetUserIds: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Normalizer ───────────────────────────────────────────────────────────────
const firstValue = (...vals) => vals.find((v) => v !== undefined && v !== null) ?? '';

export const normalizeNotification = (n = {}, readSet = new Set()) => ({
  id: firstValue(n.id, n.Id),
  title: firstValue(n.title, n.Title),
  body: firstValue(n.body, n.Body, n.content, n.Content),
  type: firstValue(n.type, n.Type, 'announcement'),
  targetType: firstValue(n.targetType, n.TargetType, 'all'),
  targetUserIds: n.targetUserIds ?? n.TargetUserIds ?? null,
  createdAt: firstValue(n.createdAt, n.CreatedAt),
  isRead: n.isRead !== undefined ? Boolean(n.isRead) : readSet.has(firstValue(n.id, n.Id)),
  isMock: Boolean(n.isMock),
});

// ─── User API ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách thông báo của user hiện tại.
 * Mock fallback: trả MOCK_NOTIFICATIONS + thông báo admin đã gửi qua localStorage.
 */
export const getUserNotifications = async () => {
  try {
    const data = await get('/notifications');
    const readSet = getReadSet();
    const items = Array.isArray(data) ? data : data?.items || [];
    return items.map((n) => normalizeNotification(n, readSet));
  } catch {
    // BE chưa sẵn sàng — dùng mock
    const readSet = getReadSet();
    const adminSent = getAdminSentMock().map((n) => ({
      ...n,
      isMock: true,
    }));
    const combined = [...adminSent, ...MOCK_NOTIFICATIONS];
    return combined.map((n) => normalizeNotification(n, readSet));
  }
};

/**
 * Đánh dấu đã đọc 1 thông báo.
 * Mock fallback: lưu vào localStorage.
 */
export const markNotificationRead = async (id) => {
  try {
    await patch(`/notifications/${id}/read`);
  } catch {
    // Mock: mark local
  }
  // Luôn cập nhật localStorage để UI nhất quán dù BE có hay không
  const set = getReadSet();
  set.add(id);
  saveReadSet(set);
};

/**
 * Đánh dấu tất cả đã đọc.
 * Mock fallback: lưu tất cả id vào localStorage.
 */
export const markAllNotificationsRead = async (ids = []) => {
  try {
    await patch('/notifications/read-all');
  } catch {
    // Mock: mark all local
  }
  const set = getReadSet();
  ids.forEach((id) => set.add(id));
  saveReadSet(set);
};

// ─── Admin API ────────────────────────────────────────────────────────────────

/**
 * Admin gửi thông báo.
 * payload: { title, body, type, targetType, targetUserIds? }
 * Mock fallback: lưu vào localStorage với id tạm.
 */
export const adminSendNotification = async (payload) => {
  try {
    const result = await post('/admin/notifications', payload);
    return normalizeNotification(result);
  } catch {
    // Mock: lưu localStorage
    const newNotif = {
      id: `mock-sent-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      isRead: false,
      isMock: true,
    };
    const list = getAdminSentMock();
    list.unshift(newNotif);
    saveAdminSentMock(list);
    return normalizeNotification(newNotif);
  }
};

/**
 * Admin lấy danh sách thông báo đã gửi.
 * Mock fallback: đọc từ localStorage.
 */
export const adminGetNotifications = async () => {
  try {
    const data = await get('/admin/notifications');
    const items = Array.isArray(data) ? data : data?.items || [];
    return items.map((n) => normalizeNotification(n));
  } catch {
    return getAdminSentMock().map((n) => normalizeNotification(n));
  }
};

/**
 * Admin xóa thông báo.
 * Mock fallback: xóa khỏi localStorage.
 */
export const adminDeleteNotification = async (id) => {
  try {
    await del(`/admin/notifications/${id}`);
  } catch {
    // Mock: xóa local
  }
  // Luôn xóa trong localStorage để UI nhất quán
  const list = getAdminSentMock().filter((n) => n.id !== id);
  saveAdminSentMock(list);
};
