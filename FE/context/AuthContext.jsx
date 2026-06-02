import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginApi, register as registerApi } from "../services/authApi";
import { clearStoredAuth, getStoredToken, getStoredUser, saveAuth } from "../utils/authStorage";

export const AuthContext = createContext(null);

const getStoredSession = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return { token, user };
};

const initialState = () => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: false,
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
    let active = true;
    const bootstrap = async () => {
      const { token } = getStoredSession();
      if (!token) {
        clearStoredAuth();
        if (active) {
          setState((current) => ({ ...current, token: null, user: null, isAuthenticated: false, isBootstrapping: false, isLoading: false, error: null }));
        }
        return;
      }

      try {
        const user = await getCurrentUser();
        saveAuth({ accessToken: token, user });
        if (active) {
          setState({ token, user, isAuthenticated: true, isBootstrapping: false, isLoading: false, error: null });
        }
      } catch {
        clearStoredAuth();
        if (active) {
          setState({ token: null, user: null, isAuthenticated: false, isBootstrapping: false, isLoading: false, error: null });
        }
      }
    };

    bootstrap();
    return () => {
      active = false;
    };
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
    if (err?.status === 401) clearStoredAuth();
    setState((current) => ({
      ...current,
      ...(err?.status === 401 ? { token: null, user: null, isAuthenticated: false } : {}),
      isLoading: false,
      error: message,
    }));
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

  const updateUser = useCallback((user) => {
    setState((current) => {
      const nextUser = { ...(current.user || {}), ...(user || {}) };
      saveAuth({ accessToken: current.token, user: nextUser });
      return { ...current, user: nextUser };
    });
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    start();
    try {
      console.log("Mock sending google credential to BE:", credential);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful login until BE is ready
      const fakeUser = { id: 999, email: "google-user@example.com", name: "Google User" };
      return finishSuccess({ accessToken: "mock-google-jwt-token", user: fakeUser });
    } catch (err) {
      return finishError(err);
    }
  }, []);

  const value = useMemo(
    () => ({ ...state, login, loginWithGoogle, register, logout, updateUser, clearError }),
    [state, login, loginWithGoogle, register, logout, updateUser, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
