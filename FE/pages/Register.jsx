import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithNativeGoogle } from '../utils/nativeGoogleAuth';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
  const isMobileApp = import.meta.env.VITE_MOBILE_APP === 'true';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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
      setFormError(err?.message || 'Dang ky Google that bai.');
    }
  };

  const redirectTo = useMemo(() => {
    const fromPath = location.state?.from?.pathname;
    return fromPath && fromPath !== '/login' && fromPath !== '/register' ? fromPath : '/app/dashboard';
  }, [location.state]);

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, isBootstrapping, navigate, redirectTo]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextPassword = password.trim();
    clearError();
    setFormError('');

    if (!nextName || !nextEmail || !nextPassword) {
      setFormError(t('register.error.required'));
      return;
    }

    if (nextPassword.length < 6) {
      setFormError(t('register.error.passwordLength'));
      return;
    }

    if (!acceptedTerms) {
      setFormError(t('register.error.terms'));
      return;
    }

    try {
      await register({ name: nextName, email: nextEmail, password: nextPassword });
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
    <AuthLayout title={t('register.title')} subtitle={t('register.description')}>
      <form onSubmit={handleRegister} className="px-6 pb-4 lg:px-8 lg:pb-6 space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-extrabold text-[#111813] dark:text-white">{t('register.nameLabel')}</label>
          <input id="name" required disabled={disabled} type="text" autoComplete="name" className={glassInputClass} placeholder={t('register.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-extrabold text-[#111813] dark:text-white">{t('register.emailLabel')}</label>
          <input id="email" required disabled={disabled} type="email" autoComplete="email" className={glassInputClass} placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-extrabold text-[#111813] dark:text-white">{t('register.passwordLabel')}</label>
          <input id="password" required disabled={disabled} type="password" autoComplete="new-password" className={glassInputClass} placeholder={t('register.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="flex items-start gap-3 py-1">
          <input type="checkbox" required disabled={disabled} checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 flex-shrink-0 rounded-md border-black/10 bg-white/60 text-primary focus:ring-primary focus:ring-offset-0 h-4 w-4 disabled:opacity-60 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 shadow-inner" id="terms" />
          <label htmlFor="terms" className="text-xs font-semibold text-text-secondary leading-5 dark:text-slate-400">
            {t('register.termsPrefix')} <span className="text-[#111813] dark:text-white font-extrabold">{t('register.termsService')}</span> {t('register.termsAnd')} <Link to="/privacy" className="text-[#111813] dark:text-white font-extrabold hover:text-primary transition-colors">{t('register.privacyPolicy')}</Link>
          </label>
        </div>

        {shownError && <StateNotice tone="error" className="text-center rounded-2xl backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 font-bold">{shownError}</StateNotice>}

        <button type="submit" disabled={disabled} className="min-h-12 w-full mt-2 rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading && <Spinner className="text-lg" />}
          {isLoading ? t('common.saving') : isBootstrapping ? t('common.loading') : t('common.submit')}
        </button>

        {isMobileApp ? (
          <button type="button" disabled={disabled} onClick={handleNativeGoogleLogin} className="min-h-12 w-full rounded-full border border-black/10 bg-white/80 px-4 text-sm font-extrabold text-[#111813] shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
            Đăng ký với Google
          </button>
        ) : (
          <>
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10 dark:border-white/10"></div></div>
              <span className="relative px-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider bg-transparent">Hoặc</span>
            </div>

            <div className="flex justify-center mix-blend-luminosity hover:mix-blend-normal transition-all duration-300 opacity-90 hover:opacity-100">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setFormError('Đăng ký Google thất bại.')}
                useOneTap={false}
                shape="pill"
                size="large"
                text="signup_with"
                locale="vi"
                width="400"
              />
            </div>
          </>
        )}

        <div className="text-center pt-2">
          <p className="text-sm font-medium text-text-secondary dark:text-slate-400">
            {t('register.haveAccount')} <Link to="/login" state={location.state} className="text-[#111813] dark:text-white font-extrabold hover:underline ml-1">{t('register.login')}</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
