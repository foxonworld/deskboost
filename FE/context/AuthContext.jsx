import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../services/authApi";
import { clearStoredAuth, getStoredToken, getStoredUser, saveAuth } from "../utils/authStorage";

export const AuthContext = createContext(null);

const initialState = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading: false,
    error: null,
  };
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setState((current) => ({
      ...current,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
      error: null,
    }));
  }, []);

  const start = () =>
    setState((current) => ({ ...current, isLoading: true, error: null }));

  const finishSuccess = (data) => {
    const next = { token: data.accessToken, user: data.user };
    saveAuth(data);
    setState({ ...next, isAuthenticated: true, isLoading: false, error: null });
    return next;
  };

  const finishError = (err) => {
    const message = err?.message || "Something went wrong. Please try again.";
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
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
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
