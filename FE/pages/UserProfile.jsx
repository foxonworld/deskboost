import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { LoadingState, StateNotice } from '../components/UiState';
import { getMe, updateMe, changePassword } from '../services/userApi';
import { uploadImage, validateImageFile } from '../services/uploadApi';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';

const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBwtOPjZ2-FOeAcMDcmIhMcUzzaLNQrs8BptWKABgS5XBqaKTZ9fURtN5btwU4zbVYIL9zXEttn-r1pqc96x16chz_YvxcevznFXhcFmnNTwdqsmygM0C4eP48o0LjWtDBYoG_kCbm2l3ErAZzMZbm94A5gpamq_7gX44kFE0ZbPWazZhOAPEusmYenNzdAQxOAzdd2HIadO3xpslF6ZWnbNMrD0llQhqRHltEjAaHT7O5Wyrtxa0DEs_JNU-_CcX717MUC9dFat04';

const emptyForm = {
  displayName: '',
  avatarUrl: '',
  phone: '',
  email: '',
};

const formatMemberSince = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}.Q${Math.floor(date.getMonth() / 3) + 1}`;
};

const UserProfile = () => {
  const { t } = useI18n();
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const applyProfile = (nextProfile) => {
    setProfile(nextProfile);
    setForm({
      displayName: nextProfile.displayName || '',
      avatarUrl: nextProfile.avatarUrl || '',
      phone: nextProfile.phone || '',
      email: nextProfile.email || '',
    });
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMe();
        if (active) applyProfile(data);
      } catch (err) {
        if (active) setError(err?.message || t('userProfile.errorLoad'));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => () => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const clearAvatarPreview = () => {
    setAvatarPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setNotice('');
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextPreviewUrl;
    });

    setUploadingAvatar(true);
    try {
      const avatarUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, avatarUrl }));
    } catch (err) {
      setError(err?.message || t('upload.error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancel = () => {
    if (profile) applyProfile(profile);
    clearAvatarPreview();
    setNotice('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await updateMe(form);
      applyProfile(updated);
      updateUser(updated);
      clearAvatarPreview();
      setNotice(t('userProfile.saved'));
      setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      setError(err?.message || t('userProfile.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordNotice('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng nhập đầy đủ mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordNotice('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordNotice(''), 3000);
    } catch (err) {
      setPasswordError(err?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setChangingPassword(false);
    }
  };

  const avatarUrl = avatarPreviewUrl || form.avatarUrl || defaultAvatar;
  const displayName = form.displayName || form.email || t('userProfile.title');

  return (
    <UserLayout>
      <form onSubmit={handleSubmit} className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('userProfile.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg italic">{t('userProfile.description')}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleCancel} disabled={loading || saving || uploadingAvatar} className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50">{t('userProfile.cancel')}</button>
            <button type="submit" disabled={loading || saving || uploadingAvatar} className="px-8 py-3 rounded-2xl bg-[#4CAF50] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100">
              {uploadingAvatar ? t('upload.uploading') : saving ? t('common.saving') : t('userProfile.save')}
            </button>
          </div>
        </div>

        {error && <StateNotice tone="error">{error}</StateNotice>}
        {notice && <StateNotice tone="success">{notice}</StateNotice>}
        {loading && <LoadingState message={t('userProfile.loading')} />}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#4CAF50]"></div>
                <div className="relative inline-block mb-6">
                  <div className="size-36 rounded-full border-4 border-[#4CAF50] p-1.5 shadow-2xl">
                    <img alt={t('userProfile.imageAlt')} className="w-full h-full object-cover rounded-full" src={avatarUrl} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{displayName}</h3>
                <p className="text-[#4CAF50] font-black text-[10px] uppercase tracking-[0.2em] mb-8">{t('userProfile.level')}</p>

                <div className="space-y-6 text-left pt-8 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t('userProfile.email')}</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 break-all">{form.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t('userProfile.memberSince')}</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{formatMemberSince(profile?.createdAt || profile?.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t('userProfile.claimedPlants')}</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{profile?.claimedPlantsCount ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#4CAF50] p-8 rounded-[40px] text-white shadow-xl shadow-[#4CAF50]/20">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-3xl">star_half</span>
                    <p className="text-xs font-black uppercase tracking-widest">{t('userProfile.progress')}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span>{t('userProfile.mastery')}</span>
                       <span>85%</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[85%]"></div>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-3xl text-[#4CAF50]" aria-hidden="true">key</span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#4CAF50]">{t('userProfile.claimEntry.badge')}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{t('userProfile.claimEntry.title')}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{t('userProfile.claimEntry.description')}</p>
                  </div>
                </div>
                <Link to="/app/add-plant" className="mt-5 inline-flex w-full justify-center rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                  {t('userProfile.claimEntry.cta')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-10">
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <span className="size-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[#4CAF50]">
                      <span className="material-symbols-outlined text-sm">badge</span>
                    </span>
                    {t('userProfile.personalInfo')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('userProfile.displayName')}</label>
                      <input value={form.displayName} onChange={handleChange('displayName')} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('userProfile.contact')}</label>
                      <input value={form.email} readOnly className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-6 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed" type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('userProfile.phone')}</label>
                      <input value={form.phone} onChange={handleChange('phone')} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('upload.avatarFile')}</label>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleAvatarFileChange} disabled={saving || uploadingAvatar} className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-3 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-white disabled:cursor-not-allowed disabled:opacity-60" />
                      {uploadingAvatar && <p className="text-xs font-bold text-[#4CAF50]">{t('upload.uploading')}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('userProfile.avatarUrl')}</label>
                      <input value={form.avatarUrl} onChange={handleChange('avatarUrl')} disabled={saving || uploadingAvatar} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none disabled:cursor-not-allowed disabled:opacity-60" type="url" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <span className="size-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[#4CAF50]">
                      <span className="material-symbols-outlined text-sm">security</span>
                    </span>
                    {t('userProfile.security', 'Bảo mật')}
                  </h3>
                  
                  <div className="space-y-4">
                    {passwordError && <StateNotice tone="error">{passwordError}</StateNotice>}
                    {passwordNotice && <StateNotice tone="success">{passwordNotice}</StateNotice>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu mới</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xác nhận mật khẩu mới</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold dark:text-white focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" />
                      </div>
                      <div className="space-y-2 flex items-end">
                         <button type="button" onClick={handlePasswordSubmit} disabled={changingPassword} className="h-14 px-8 rounded-2xl bg-[#4CAF50] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100">
                          {changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </UserLayout>
  );
};

export default UserProfile;
