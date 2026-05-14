import { post } from "./api";

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const makeMockAuthResponse = ({ name, email }) => ({
  user: {
    id: "usr_mock_001",
    name: name || email?.split("@")[0] || "DeskBoost User",
    email,
    avatarUrl: null,
    phone: null,
    createdAt: new Date().toISOString(),
  },
  accessToken: `mock-jwt-${Date.now()}`,
});

const normalizeError = (err) => {
  if (err?.message) throw err;
  throw new Error("Auth request failed. Please try again.");
};

export const register = async (payload) => {
  if (USE_MOCK_AUTH) {
    await delay();
    if (!payload?.name || !payload?.email || !payload?.password) {
      throw new Error("Please enter your name, email, and password.");
    }
    return makeMockAuthResponse(payload);
  }

  try {
    return await post("/auth/register", payload);
  } catch (err) {
    normalizeError(err);
  }
};

export const login = async (payload) => {
  if (USE_MOCK_AUTH) {
    await delay();
    if (!payload?.email || !payload?.password) {
      throw new Error("Please enter your email and password.");
    }
    return makeMockAuthResponse(payload);
  }

  try {
    return await post("/auth/login", payload);
  } catch (err) {
    normalizeError(err);
  }
};

export const forgotPassword = (email) =>
  post("/auth/forgot-password", { email });

export const apiRegister = (name, email, password) =>
  register({ name, email, password });
export const apiLogin = (email, password) => login({ email, password });
export const apiForgotPassword = forgotPassword;
