const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API Error');
  }
  return res.json();
};

// ── Cart ────────────────────────────────────────────────────────────────────
export const apiGetCart = () =>
  fetch(`${BASE_URL}/cart`, { headers: getAuthHeaders() }).then(handleResponse);

export const apiAddToCart = (plantId, quantity = 1) =>
  fetch(`${BASE_URL}/cart/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ plantId, quantity }),
  }).then(handleResponse);

export const apiUpdateCartItem = (plantId, quantity) =>
  fetch(`${BASE_URL}/cart/update`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ plantId, quantity }),
  }).then(handleResponse);

export const apiRemoveFromCart = (plantId) =>
  fetch(`${BASE_URL}/cart/remove`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ plantId }),
  }).then(handleResponse);

// ── Payment ─────────────────────────────────────────────────────────────────
export const apiCreatePayment = (payload) =>
  fetch(`${BASE_URL}/payment/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);

// ── Orders ──────────────────────────────────────────────────────────────────
export const apiGetMyOrders = () =>
  fetch(`${BASE_URL}/orders/my-orders`, { headers: getAuthHeaders() }).then(handleResponse);

export const apiGetOrderById = (id) =>
  fetch(`${BASE_URL}/orders/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// ── Admin ───────────────────────────────────────────────────────────────────
export const apiAdminGetOrders = (status = '') =>
  fetch(`${BASE_URL}/admin/orders${status ? `?status=${status}` : ''}`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);

export const apiAdminUpdateOrderStatus = (id, status) =>
  fetch(`${BASE_URL}/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  }).then(handleResponse);
