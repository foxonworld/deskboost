import { post } from './api';

/**
 * Auth API
 * TODO: connect to backend when ready
 */

export const apiRegister = (name, email, password) =>
  post('/auth/register', { name, email, password });

export const apiLogin = (email, password) =>
  post('/auth/login', { email, password });

export const apiForgotPassword = (email) =>
  post('/auth/forgot-password', { email });
