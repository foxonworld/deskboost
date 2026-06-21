import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithNativeGoogle } from '../utils/nativeGoogleAuth';
import AuthLayout from '../components/AuthLayout';
import { Capacitor } from '@capacitor/core';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const isMobileApp = Capacitor.isNativePlatform();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const routeNotice = location.state?.notice || '';

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

  // Custom polished classes for glass input/button
  const glassInputClass = "min-h-12 w-full rounded-2xl border border-black/5 bg-white/60 px-4 text-sm font-semibold text-[#111813] outline-none transition-all placeholder:text-gray-500 focus:bg-white focus:ring-4 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400 dark:focus:bg-white/10 backdrop-blur-sm shadow-inner";

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.description')}>
      <form onSubmit={handleLogin} className="px-6 pb-4 lg:px-8 lg:pb-6 space-y-5" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-extrabold text-[#111813] dark:text-white">{t('login.emailLabel')}</label>
          <input id="email" required disabled={disabled} type="email" autoComplete="email" className={glassInputClass} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="password" className="text-sm font-extrabold text-[#111813] dark:text-white">{t('login.passwordLabel')}</label>
            <Link to="/forgot-password" className="text-text-secondary hover:text-primary text-xs font-bold transition-colors">{t('login.forgotPassword')}</Link>
          </div>
          <input id="password" required disabled={disabled} type="password" autoComplete="current-password" className={glassInputClass} placeholder={t('login.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        
        {shownError && <StateNotice tone="error" className="text-center rounded-2xl backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 font-bold">{shownError}</StateNotice>}
        {!shownError && routeNotice && <StateNotice tone="success" className="text-center rounded-2xl backdrop-blur-sm bg-green-50/80 dark:bg-green-900/30 font-bold">{routeNotice}</StateNotice>}
        
        <button type="submit" disabled={disabled} className="min-h-12 w-full rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading && <Spinner className="text-lg" />}
          {isLoading ? t('common.loading') : isBootstrapping ? t('common.loading') : t('login.submit')}
        </button>

        {isMobileApp ? (
          <button type="button" disabled={disabled} onClick={handleNativeGoogleLogin} className="min-h-12 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-extrabold text-[#111813] shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            Đăng nhập với Google
          </button>
        ) : (
          <>
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10 dark:border-white/10"></div></div>
              <span className="relative px-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider bg-transparent">Hoặc</span>
            </div>

            <div className="flex justify-center transition-all duration-300 hover:scale-105 active:scale-95">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setFormError('Đăng nhập Google thất bại.')}
                useOneTap={false}
                shape="pill"
                size="large"
                text="signin_with"
                locale="vi"
                width="400"
              />
            </div>
          </>
        )}

        <div className="text-center pt-2">
          <p className="text-sm font-medium text-text-secondary dark:text-slate-400">
            {t('login.noAccount')} <Link to="/register" state={location.state} className="text-[#111813] dark:text-white font-extrabold hover:underline ml-1">{t('login.signUp')}</Link>
          </p>
          <p className="mt-3 text-[11px] font-semibold text-text-secondary/70 dark:text-slate-500">
            By signing in, you can review the <Link to="/privacy" className="font-bold text-text-secondary hover:text-primary transition-colors dark:text-slate-400 dark:hover:text-white">Privacy Policy</Link>.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
