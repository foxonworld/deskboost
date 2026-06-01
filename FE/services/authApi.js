import { get, post } from "./api";

export const normalizeUser = (user = {}) => ({
  ...user,
  name: user.name || user.fullName || user.email?.split("@")[0] || "DeskBoost User",
  avatarUrl:
    user.avatarUrl ||
    user.AvatarUrl ||
    user.avatar ||
    user.imageUrl ||
    user.photoUrl ||
    user.profileImageUrl ||
    user.avatar_url ||
    user.image_url ||
    "",
});

const normalizeAuthResponse = (data = {}) => ({
  ...data,
  user: normalizeUser(data.user),
});

const normalizeError = (err) => {
  if (err?.message) throw err;
  throw new Error("Auth request failed. Please try again.");
};

export const register = async (payload) => {
  try {
    return normalizeAuthResponse(await post("/auth/register", {
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword || payload.password,
      fullName: payload.fullName || payload.name,
    }));
  } catch (err) {
    normalizeError(err);
  }
};

export const login = async (payload) => {
  try {
    return normalizeAuthResponse(await post("/auth/login", payload));
  } catch (err) {
    normalizeError(err);
  }
};

export const forgotPassword = async (email) => {
  try {
    return await post("/auth/forgot-password", { email });
  } catch (err) {
    normalizeError(err);
  }
};

export const getCurrentUser = async () => normalizeUser(await get("/auth/me"));

export const apiRegister = (name, email, password) =>
  register({ name, email, password });
export const apiLogin = (email, password) => login({ email, password });
export const apiForgotPassword = forgotPassword;
