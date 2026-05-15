import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../services/authApi";
import { clearStoredAuth, getStoredToken, getStoredUser, saveAuth } from "../utils/authStorage";

export const AuthContext = createContext(null);

const getSession = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  const isAuthenticated = Boolean(token && user);

  if (!isAuthenticated && (token || user)) clearStoredAuth();

  return { token: isAuthenticated ? token : null, user: isAuthenticated ? user : null, isAuthenticated };
};

const initialState = () => ({
  ...getSession(),
  isBootstrapping: true,
  isLoading: false,
  error: null,
});

const getFriendlyError = (err) => {
  const message = err?.message || "Something went wrong. Please try again.";
  if (message.includes("Failed to fetch")) return "We could not reach DeskBoost right now. Please try again in a moment.";
  if (message.toLowerCase().includes("network")) return "Network issue. Please check your connection and try again.";
  if (message.toLowerCase().includes("unauthorized") || message.includes("401")) return "Email or password is incorrect.";
  return message;
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const session = getSession();
    setState((current) => ({
      ...current,
      ...session,
      isBootstrapping: false,
      isLoading: false,
      error: null,
    }));
  }, []);

  const start = () =>
    setState((current) => ({ ...current, isLoading: true, error: null }));

  const finishSuccess = (data) => {
    if (!data?.accessToken || !data?.user) {
      throw new Error("Sign-in response was incomplete. Please try again.");
    }

    const next = { token: data.accessToken, user: data.user };
    saveAuth(data);
    setState({ ...next, isAuthenticated: true, isBootstrapping: false, isLoading: false, error: null });
    return next;
  };

  const finishError = (err) => {
    const message = getFriendlyError(err);
    setState((current) => ({ ...current, isLoading: false, error: message }));
    throw new Error(message);
  };

  const login = useCallback(async (payload) => {
    start();
    try {
      return finishSuccess(await loginApi(payload));
    } catch (err) {
      return finishError(err);
    }
  }, []);

  const register = useCallback(async (payload) => {
    start();
    try {
      return finishSuccess(await registerApi(payload));
    } catch (err) {
      return finishError(err);
    }
  }, []);

  const logout = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    clearStoredAuth();
    setState({ user: null, token: null, isAuthenticated: false, isBootstrapping: false, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout, clearError }),
    [state, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
