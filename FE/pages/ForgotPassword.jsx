import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authApi';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';
import { useI18n } from '../i18n';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { t } = useI18n();
  const navigate = useNavigate();

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
      const res = await forgotPassword(email.trim());
      if (res && res.token) {
        setResetToken(res.token);
      }
      setStep(2);
      setSuccessMsg('Vui lòng kiểm tra email (hoặc dùng token bên dưới).');
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
    if (!resetToken.trim() || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(resetToken.trim(), newPassword);
      setSuccessMsg('Đặt lại mật khẩu thành công! Chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err?.message || 'Lỗi khi đặt lại mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
        <div className="pt-10 px-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 shadow-sm"><span className="material-symbols-outlined text-primary text-5xl">lock_reset</span></div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">{step === 1 ? t('forgot.title') : 'Đặt lại mật khẩu'}</h1>
          <p className="text-text-secondary text-base mt-2 font-medium">{step === 1 ? t('forgot.description') : 'Nhập token và mật khẩu mới'}</p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleForgotSubmit} className="p-8 pt-4 space-y-6">
            {error && <StateNotice tone="error">{error}</StateNotice>}
            {successMsg && <StateNotice tone="success">{successMsg}</StateNotice>}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main ml-1">{t('forgot.emailLabel')}</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className={`${formControlClass} h-12`} placeholder={t('forgot.emailPlaceholder')} />
            </div>
            <button type="submit" disabled={isLoading} className={`${primaryButtonClass} h-12 w-full`}>{isLoading && <Spinner />}{isLoading ? t('common.loading') : t('common.submit')}</button>
            <div className="text-center"><Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-base">arrow_back</span>{t('forgot.backToLogin')}</Link></div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="p-8 pt-4 space-y-6">
            {error && <StateNotice tone="error">{error}</StateNotice>}
            {successMsg && <StateNotice tone="success">{successMsg}</StateNotice>}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main ml-1">Token Reset (Dev)</label>
              <input required type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} disabled={isLoading} className={`${formControlClass} h-12`} placeholder="Mã xác nhận" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main ml-1">Mật khẩu mới</label>
              <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} className={`${formControlClass} h-12`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main ml-1">Xác nhận mật khẩu mới</label>
              <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className={`${formControlClass} h-12`} />
            </div>
            <button type="submit" disabled={isLoading} className={`${primaryButtonClass} h-12 w-full`}>{isLoading && <Spinner />}{isLoading ? t('common.loading') : 'Xác nhận đổi mật khẩu'}</button>
            <div className="text-center">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors w-full"><span className="material-symbols-outlined text-base">arrow_back</span>Quay lại</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
