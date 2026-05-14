import { post, setAccessToken } from "./api";

export const register = async (payload) => {
  const data = await post("/auth/register", payload);
  setAccessToken(data?.accessToken);
  return data;
};

export const login = async (payload) => {
  const data = await post("/auth/login", payload);
  setAccessToken(data?.accessToken);
  return data;
};

export const forgotPassword = (email) =>
  post("/auth/forgot-password", { email });

// Backward-compatible aliases during MVP cleanup.
export const apiRegister = (name, email, password) =>
  register({ name, email, password });
export const apiLogin = (email, password) => login({ email, password });
export const apiForgotPassword = forgotPassword;
