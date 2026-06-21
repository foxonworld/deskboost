import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authApi';
import { Spinner, StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';
import AuthLayout from '../components/AuthLayout';

const REQUEST_SUCCESS_MESSAGE = 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.';
const INVALID_TOKEN_MESSAGE = 'Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.';
const RESET_SUCCESS_MESSAGE = 'Đổi mật khẩu thành công, vui lòng đăng nhập lại.';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [tokenState, setTokenState] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { t } = useI18n();
  const navigate = useNavigate();
  const isResetMode = Boolean(tokenState);

  const showRequestMode = () => {
    setTokenState('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email.trim()) {
      setError(t('forgot.error.required'));
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccessMsg(REQUEST_SUCCESS_MESSAGE);
    } catch (err) {
      setError(err?.message || t('forgot.error.send'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(tokenState, newPassword);
      setTokenState('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login', { replace: true, state: { notice: RESET_SUCCESS_MESSAGE } });
    } catch (err) {
      if ([400, 404, 410].includes(err?.status)) {
        setError(INVALID_TOKEN_MESSAGE);
      } else {
        setError(err?.message || 'Lỗi khi đặt lại mật khẩu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Custom polished classes for glass input/button
  const glassInputClass = "min-h-12 w-full rounded-2xl border border-black/5 bg-white/60 px-4 text-sm font-semibold text-[#111813] outline-none transition-all placeholder:text-gray-500 focus:bg-white focus:ring-4 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400 dark:focus:bg-white/10 backdrop-blur-sm shadow-inner";

  return (
    <AuthLayout 
      title={isResetMode ? 'Đặt lại mật khẩu' : t('forgot.title')} 
      subtitle={isResetMode ? 'Nhập mật khẩu mới cho tài khoản của bạn.' : t('forgot.description')}
    >
      {!isResetMode ? (
        <form onSubmit={handleForgotSubmit} className="px-6 pb-4 lg:px-8 lg:pb-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#111813] dark:text-white">{t('forgot.emailLabel')}</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className={glassInputClass} placeholder={t('forgot.emailPlaceholder')} />
          </div>
          
          {error && <StateNotice tone="error" className="text-center rounded-2xl backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 font-bold">{error}</StateNotice>}
          {successMsg && <StateNotice tone="success" className="text-center rounded-2xl backdrop-blur-sm bg-green-50/80 dark:bg-green-900/30 font-bold">{successMsg}</StateNotice>}
          
          <button type="submit" disabled={isLoading} className="min-h-12 w-full rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
            {isLoading && <Spinner className="text-lg" />}
            {isLoading ? t('common.loading') : t('common.submit')}
          </button>
          
          <div className="text-center pt-2">
            <Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors dark:text-slate-400 dark:hover:text-white">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              {t('forgot.backToLogin')}
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="px-6 pb-4 lg:px-8 lg:pb-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#111813] dark:text-white">Mật khẩu mới</label>
            <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} className={glassInputClass} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-[#111813] dark:text-white">Xác nhận mật khẩu mới</label>
            <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className={glassInputClass} autoComplete="new-password" />
          </div>
          
          {error && <StateNotice tone="error" className="text-center rounded-2xl backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 font-bold">{error}</StateNotice>}
          {successMsg && <StateNotice tone="success" className="text-center rounded-2xl backdrop-blur-sm bg-green-50/80 dark:bg-green-900/30 font-bold">{successMsg}</StateNotice>}
          
          <button type="submit" disabled={isLoading} className="min-h-12 w-full mt-2 rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2">
            {isLoading && <Spinner className="text-lg" />}
            {isLoading ? t('common.loading') : 'Cập nhật mật khẩu'}
          </button>
          
          <div className="text-center pt-2">
            <button type="button" onClick={showRequestMode} className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors w-full dark:text-slate-400 dark:hover:text-white">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại Quên mật khẩu
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
