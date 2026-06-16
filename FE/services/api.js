/**
 * Central API client for DeskBoost.
 * Set VITE_API_URL for deployed/local backend targets; falls back to same-origin /api.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "deskboost.refreshToken";

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

export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem("refreshToken");

export const setAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const setRefreshToken = (token) => {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("authUser");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
};

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
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

const safeParseJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const parseResponse = async (res) => {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? safeParseJson(text)
    : safeParseJson(text) || (text ? { message: text } : null);

  if (!res.ok) {
    const payload = data?.error || data || {};
    const message =
      payload.message ||
      payload.title ||
      (text && !contentType.includes("application/json") ? text : null) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, res.status, payload.code, payload.details || payload);
  }

  return data;
};

const isAuthPath = (path) =>
  ["/auth/login", "/auth/register", "/auth/google", "/auth/refresh-token", "/auth/logout"].some((authPath) =>
    path.startsWith(authPath)
  );

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(buildUrl("/auth/refresh-token"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await parseResponse(res);

    if (!data?.accessToken || !data?.refreshToken) return false;

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    if (data.user) localStorage.setItem("authUser", JSON.stringify(data.user));
    return true;
  } catch {
    clearAuth();
    return false;
  }
};

const shouldTryRefresh = (path, res, body, retried) =>
  res.status === 401 && !retried && !isAuthPath(path) && !(body instanceof FormData);

const shouldRefreshWithoutRetry = (path, res, body, retried) =>
  res.status === 401 && !retried && !isAuthPath(path) && body instanceof FormData;

export const request = async (path, options = {}, retried = false) => {
  const { method = "GET", body, params, ...rest } = options;
  const res = await fetch(buildUrl(path, params), {
    method,
    headers: getHeaders(body),
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (shouldTryRefresh(path, res, body, retried) && await refreshAccessToken()) {
    return request(path, options, true);
  }

  if (shouldRefreshWithoutRetry(path, res, body, retried) && await refreshAccessToken()) {
    throw new ApiError("Session refreshed. Please retry this action.", 401, "AUTH_RETRY_REQUIRED");
  }

  if (res.status === 401) clearAuth();
  return parseResponse(res);
};

export const get = (path, params) => request(path, { params });
export const post = (path, body) => request(path, { method: "POST", body });
export const put = (path, body) => request(path, { method: "PUT", body });
export const patch = (path, body) => request(path, { method: "PATCH", body });
export const del = (path) => request(path, { method: "DELETE" });

export const requestText = async (path, options = {}, retried = false) => {
  const { method = "GET", body, params, ...rest } = options;
  const res = await fetch(buildUrl(path, params), {
    method,
    headers: getHeaders(body),
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (shouldTryRefresh(path, res, body, retried) && await refreshAccessToken()) {
    return requestText(path, options, true);
  }

  if (shouldRefreshWithoutRetry(path, res, body, retried) && await refreshAccessToken()) {
    throw new ApiError("Session refreshed. Please retry this action.", 401, "AUTH_RETRY_REQUIRED");
  }

  const text = await res.text();

  if (!res.ok) {
    const payload = safeParseJson(text)?.error || safeParseJson(text) || {};
    const message =
      payload.message ||
      payload.title ||
      text ||
      res.statusText ||
      "Request failed";
    if (res.status === 401) clearAuth();
    throw new ApiError(message, res.status, payload.code, payload.details || payload);
  }

  return text;
};
