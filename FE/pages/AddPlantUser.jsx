import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { createMyPlant } from '../services/plantApi';
import { uploadImage, validateImageFile } from '../services/uploadApi';
import { Spinner, StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';

const initialForm = {
  species: 'Monstera Deliciosa',
  nickname: '',
  location: 'Central Command (Desk)',
  imageUrl: '',
  smartReminders: true,
};

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const AddPlantUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useI18n();

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextPreviewUrl;
    });

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      updateField('imageUrl', imageUrl);
    } catch (err) {
      setError(err?.message || t('upload.error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.species || !form.nickname.trim() || !form.location) {
      setError(t('addPlant.error.required'));
      return;
    }
    if (!isValidUrl(form.imageUrl.trim())) {
      setError(t('addPlant.error.url'));
      return;
    }

    setIsSubmitting(true);
    try {
      await createMyPlant({
        species: form.species,
        name: form.nickname.trim(),
        location: form.location,
        imageUrl: form.imageUrl.trim() || undefined,
      });
      setSuccess(t('addPlant.success'));
      setTimeout(() => navigate('/app/my-plants'), 700);
    } catch (err) {
      setError(err?.message || t('addPlant.error.fallback'));
      setTimeout(() => navigate('/app/my-plants'), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
        <div><h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('addPlant.title')}</h1><p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('addPlant.description')}</p></div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 bg-[#4CAF50]/5 p-8 flex flex-col items-center justify-center text-center">
              <div className="size-48 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mb-6 overflow-hidden">
                {(previewUrl || (form.imageUrl && isValidUrl(form.imageUrl))) ? <img src={previewUrl || form.imageUrl} alt={t('addPlant.previewAlt')} className="h-full w-full object-cover" /> : <span className="material-symbols-outlined text-7xl text-[#4CAF50]">potted_plant</span>}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">{t('addPlant.visualIdentity')}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">{t('addPlant.previewHint')}</p>
            </div>
            <div className="lg:w-2/3 p-10 space-y-6">
              {error && <StateNotice tone="error">{error}</StateNotice>}
              {success && <StateNotice tone="success">{success}</StateNotice>}
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('addPlant.species')}</label><select value={form.species} onChange={(e) => updateField('species', e.target.value)} disabled={isSubmitting} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none"><option value="Monstera Deliciosa">{t('addPlant.species.monstera')}</option><option value="Snake Plant">{t('addPlant.species.snake')}</option><option value="Golden Pothos">{t('addPlant.species.pothos')}</option></select></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('addPlant.nickname')}</label><input value={form.nickname} onChange={(e) => updateField('nickname', e.target.value)} disabled={isSubmitting} required className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none" placeholder={t('addPlant.nicknamePlaceholder')} /></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('upload.imageFile')}</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFileChange} disabled={isSubmitting || isUploading} className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-white disabled:cursor-not-allowed disabled:opacity-60" />
                {isUploading && <p className="text-xs font-bold text-[#4CAF50]">{t('upload.uploading')}</p>}
              </div>
              <details className="space-y-2">
                <summary className="cursor-pointer text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('upload.advancedUrl')}</summary>
                <input value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} disabled={isSubmitting || isUploading} className="mt-3 w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none" placeholder="https://example.com/plant.jpg" />
              </details>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('addPlant.location')}</label><select value={form.location} onChange={(e) => updateField('location', e.target.value)} disabled={isSubmitting} className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/10 disabled:cursor-not-allowed disabled:opacity-60"><option value="Central Command (Desk)">{t('addPlant.location.desk')}</option><option value="Observation Deck (Window)">{t('addPlant.location.window')}</option></select></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('addPlant.alertSystem')}</label><div className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 flex items-center justify-between"><span className="text-xs font-bold">{t('addPlant.smartReminders')}</span><input type="checkbox" checked={form.smartReminders} onChange={(e) => updateField('smartReminders', e.target.checked)} disabled={isSubmitting} className="w-5 h-5 rounded border-slate-300 text-[#4CAF50] focus:ring-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-60" /></div></div></div>
              <div className="pt-6 flex flex-col sm:flex-row gap-3"><button type="submit" disabled={isSubmitting || isUploading} className="flex-1 h-14 bg-[#4CAF50] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:opacity-90 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70 inline-flex items-center justify-center gap-2">{(isSubmitting || isUploading) && <Spinner />}{isUploading ? t('upload.uploading') : isSubmitting ? t('common.saving') : t('common.submit')}</button><button type="button" onClick={() => navigate('/app/my-plants')} disabled={isSubmitting || isUploading} className="px-8 h-14 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:cursor-not-allowed disabled:opacity-60">{t('common.cancel')}</button></div>
            </div>
          </div>
        </form>
      </div>
    </UserLayout>
  );
};

export default AddPlantUser;
