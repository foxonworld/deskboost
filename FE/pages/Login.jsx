import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';
import { useI18n } from '../i18n';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithNativeGoogle } from '../utils/nativeGoogleAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const isMobileApp = import.meta.env.VITE_MOBILE_APP === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    clearError();
    setFormError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(redirectTo, { replace: true });
    } catch {
      // AuthContext owns friendly error state.
    }
  };

  const handleNativeGoogleLogin = async () => {
    clearError();
    setFormError('');
    try {
      const idToken = await signInWithNativeGoogle();
      await loginWithGoogle(idToken);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err?.message || 'Dang nhap Google that bai.');
    }
  };

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

          {isMobileApp ? (
            <button type="button" disabled={disabled} onClick={handleNativeGoogleLogin} className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-text-main shadow-sm transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-primary/10">
              Dang nhap voi Google
            </button>
          ) : (
            <>
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <span className="relative px-4 bg-white dark:bg-slate-900 text-sm text-gray-500">Hoặc</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setFormError('Đăng nhập Google thất bại.')}
              useOneTap={false}
              shape="rectangular"
              size="large"
              text="signin_with"
              locale="vi"
              width="400"
            />
          </div>

            </>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">{t('login.noAccount')} <Link to="/register" state={location.state} className="text-text-main font-bold hover:underline">{t('login.signUp')}</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
