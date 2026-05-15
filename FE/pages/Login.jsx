import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';

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
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4 sm:p-6 dark:bg-background-dark">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">potted_plant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">DeskBoost</h1>
          <h2 className="text-xl font-bold mt-4 dark:text-white">Welcome back</h2>
          <p className="text-text-secondary text-sm mt-1 dark:text-slate-400">Sign in to continue caring for your desk plants.</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 pt-2 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
            <input id="email" required disabled={disabled} type="email" autoComplete="email" className={`${formControlClass} h-12`} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-text-secondary hover:text-primary text-sm font-medium">Forgot password?</Link>
            </div>
            <input id="password" required disabled={disabled} type="password" autoComplete="current-password" className={`${formControlClass} h-12`} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {shownError && <StateNotice tone="error" className="text-center">{shownError}</StateNotice>}
          <button type="submit" disabled={disabled} className={`${primaryButtonClass} h-12 w-full`}>
            {isLoading && <Spinner className="text-lg" />}
            {isLoading ? 'Loading...' : isBootstrapping ? 'Loading...' : 'Submit'}
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
