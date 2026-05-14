/**
 * Central API client for DeskBoost MVP.
 * Backend is not implemented yet; pages can catch failures and use local fallback data.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const TOKEN_KEY = "accessToken";

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details || {};
  }
}

export const getAccessToken = () =>
  localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");

export const setAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
};

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        url.searchParams.set(key, value);
    });
  }
  return url.toString();
};

const getHeaders = (body) => {
  const token = getAccessToken();
  const headers = {
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return headers;
};

const parseResponse = async (res) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const payload = data?.error || data || {};
    const message = payload.message || res.statusText || "Request failed";
    if (res.status === 401) clearAuth();
    throw new ApiError(message, res.status, payload.code, payload.details);
  }

  return data;
};

export const request = async (path, options = {}) => {
  const { method = "GET", body, params, ...rest } = options;
  const res = await fetch(buildUrl(path, params), {
    method,
    headers: getHeaders(body),
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...rest,
  });
  return parseResponse(res);
};

export const get = (path, params) => request(path, { params });
export const post = (path, body) => request(path, { method: "POST", body });
export const put = (path, body) => request(path, { method: "PUT", body });
export const del = (path) => request(path, { method: "DELETE" });
