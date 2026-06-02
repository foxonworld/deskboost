import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';
import { useI18n } from '../i18n';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setFormError("Google login failed.");
      }
    },
    onError: () => setFormError("Google login failed.")
  });

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
      setFormError(t('login.error.required'));
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
          <h2 className="text-xl font-bold mt-4 dark:text-white">{t('login.title')}</h2>
          <p className="text-text-secondary text-sm mt-1 dark:text-slate-400">{t('login.description')}</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 pt-2 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t('login.emailLabel')}</label>
            <input id="email" required disabled={disabled} type="email" autoComplete="email" className={`${formControlClass} h-12`} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="password" className="text-sm font-medium">{t('login.passwordLabel')}</label>
              <Link to="/forgot-password" className="text-text-secondary hover:text-primary text-sm font-medium">{t('login.forgotPassword')}</Link>
            </div>
            <input id="password" required disabled={disabled} type="password" autoComplete="current-password" className={`${formControlClass} h-12`} placeholder={t('login.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {shownError && <StateNotice tone="error" className="text-center">{shownError}</StateNotice>}
          <button type="submit" disabled={disabled} className={`${primaryButtonClass} h-12 w-full`}>
            {isLoading && <Spinner className="text-lg" />}
            {isLoading ? t('common.loading') : isBootstrapping ? t('common.loading') : t('login.submit')}
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <span className="relative px-4 bg-white dark:bg-slate-900 text-sm text-gray-500">Hoặc</span>
          </div>

          <button type="button" disabled={disabled} onClick={() => googleLogin()} className="flex items-center justify-center gap-2 h-12 w-full border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-200">Đăng nhập bằng Google</span>
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">{t('login.noAccount')} <Link to="/register" state={location.state} className="text-text-main font-bold hover:underline">{t('login.signUp')}</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
