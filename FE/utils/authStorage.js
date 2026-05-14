const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export const getStoredToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("token");

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveAuth = ({ accessToken, user }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
};
