import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';
import { useI18n } from '../i18n';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const { t } = useI18n();
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

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4 sm:p-6 dark:bg-background-dark">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">potted_plant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white">DeskBoost</h1>
          <h2 className="text-xl font-bold mt-4 dark:text-white">{t('register.title')}</h2>
          <p className="text-text-secondary text-sm mt-1 dark:text-slate-400">{t('register.description')}</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 pt-2 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-text-main">{t('register.nameLabel')}</label>
            <input id="name" required disabled={disabled} type="text" autoComplete="name" className={`${formControlClass} h-12`} placeholder={t('register.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-text-main">{t('register.emailLabel')}</label>
            <input id="email" required disabled={disabled} type="email" autoComplete="email" className={`${formControlClass} h-12`} placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-text-main">{t('register.passwordLabel')}</label>
            <input id="password" required disabled={disabled} type="password" autoComplete="new-password" className={`${formControlClass} h-12`} placeholder={t('register.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" required disabled={disabled} checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 disabled:opacity-60 disabled:cursor-not-allowed" id="terms" />
            <label htmlFor="terms" className="text-xs text-text-secondary leading-5">
              {t('register.termsPrefix')} <span className="text-primary font-bold">{t('register.termsService')}</span> {t('register.termsAnd')} <span className="text-primary font-bold">{t('register.privacyPolicy')}</span>
            </label>
          </div>

          {shownError && <StateNotice tone="error" className="text-center">{shownError}</StateNotice>}

          <button type="submit" disabled={disabled} className={`${primaryButtonClass} h-12 w-full`}>
            {isLoading && <Spinner className="text-lg" />}
            {isLoading ? t('common.saving') : isBootstrapping ? t('common.loading') : t('common.submit')}
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <span className="relative px-4 bg-white dark:bg-slate-900 text-sm text-gray-500">Hoặc</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setFormError('Đăng ký Google thất bại.')}
              useOneTap={false}
              shape="rectangular"
              size="large"
              text="signup_with"
              locale="vi"
              width="400"
            />
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              {t('register.haveAccount')} <Link to="/login" state={location.state} className="text-text-main font-bold hover:underline">{t('register.login')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
