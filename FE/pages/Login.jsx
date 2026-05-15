import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const redirectTo = useMemo(() => {
    const fromPath = location.state?.from?.pathname;
    return fromPath && fromPath !== '/login' && fromPath !== '/register' ? fromPath : '/app/dashboard';
  }, [location.state]);

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, isBootstrapping, navigate, redirectTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const nextEmail = email.trim();
    const nextPassword = password.trim();
    clearError();
    setFormError('');

    if (!nextEmail || !nextPassword) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      await login({ email: nextEmail, password: nextPassword });
      navigate(redirectTo, { replace: true });
    } catch {
      // AuthContext owns friendly error state.
    }
  };

  const shownError = formError || error;
  const disabled = isLoading || isBootstrapping;

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">potted_plant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DeskBoost</h1>
          <h2 className="text-xl font-bold mt-4">Welcome back</h2>
          <p className="text-text-secondary text-sm mt-1">Sign in to continue caring for your desk plants.</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 pt-2 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
            <input id="email" required disabled={disabled} type="email" autoComplete="email" className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-text-secondary hover:text-primary text-sm font-medium">Forgot password?</Link>
            </div>
            <input id="password" required disabled={disabled} type="password" autoComplete="current-password" className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {shownError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-semibold">{shownError}</p>}
          <button type="submit" disabled={disabled} className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
            {isLoading ? 'Signing in...' : isBootstrapping ? 'Restoring session...' : 'Log In'}
          </button>
          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">Don't have an account? <Link to="/register" state={location.state} className="text-text-main font-bold hover:underline">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
