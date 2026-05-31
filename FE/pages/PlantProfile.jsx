import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';
import { deleteMyPlant, getMyPlant, updateMyPlant } from '../services/plantApi';
import { uploadImage, validateImageFile } from '../services/uploadApi';
import { useI18n } from '../i18n';

const PlantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [form, setForm] = useState({ nickname: '', species: '', location: '', imageUrl: '', status: '', notes: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const { t } = useI18n();

  const syncForm = (nextPlant) => {
    setForm({
      nickname: nextPlant?.nickname || nextPlant?.name || '',
      species: nextPlant?.species || '',
      location: nextPlant?.location || '',
      imageUrl: nextPlant?.imageUrl || nextPlant?.image || '',
      status: nextPlant?.status || '',
      notes: nextPlant?.notes || '',
    });
  };

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getMyPlant(id);
        if (alive) {
          const nextPlant = res?.data || res;
          setPlant(nextPlant);
          syncForm(nextPlant);
        }
      } catch (err) {
        const fallback = MY_PLANTS.find(p => p.id === id) || null;
        if (alive) {
          setPlant(fallback);
          syncForm(fallback);
          setError(fallback ? (err?.message || t('plantProfile.fallbackError')) : t('plantProfile.notFoundError'));
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [id, t]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const clearImagePreview = () => {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      syncForm(plant);
      clearImagePreview();
    }
    setIsEditing((value) => !value);
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
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

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const updated = await updateMyPlant(id, {
        name: form.nickname.trim(),
        species: form.species,
        location: form.location,
        imageUrl: form.imageUrl || undefined,
        status: form.status,
        notes: form.notes,
      });
      setPlant(updated);
      syncForm(updated);
      clearImagePreview();
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || 'Could not update plant.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this plant from My Plants?')) return;
    setIsSaving(true);
    setError('');
    try {
      await deleteMyPlant(id);
      navigate('/app/my-plants');
    } catch (err) {
      setError(err?.message || 'Could not delete plant.');
      setIsSaving(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <Link to="/app/my-plants" className="text-sm font-bold text-[#4CAF50] hover:underline">{t('plantProfile.back')}</Link>
        {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">{error}</div>}
        {isLoading ? (
          <div className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center font-black text-slate-500">{t('plantProfile.loading')}</div>
        ) : !plant ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
            <p className="text-xl font-black text-slate-700 dark:text-white">{t('plantProfile.notFound')}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <img src={previewUrl || form.imageUrl || plant.image || plant.imageUrl} alt={plant.nickname || plant.name} className="w-full aspect-square object-cover rounded-[28px]" />
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div><h1 className="text-4xl font-black text-slate-900 dark:text-white">{plant.nickname || plant.name}</h1><p className="text-[#4CAF50] font-black uppercase tracking-widest mt-2">{plant.species}</p></div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleToggleEdit} disabled={isSaving || isUploading} className="px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60">
                      {isEditing ? t('common.cancel') : 'Edit'}
                    </button>
                    <button type="button" onClick={handleDelete} disabled={isSaving} className="px-4 py-2 rounded-2xl bg-red-50 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 disabled:opacity-60">
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input value={form.nickname} onChange={(e) => updateField('nickname', e.target.value)} required className="h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Plant name" />
                      <input value={form.species} onChange={(e) => updateField('species', e.target.value)} className="h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Species" />
                      <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className="h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Location" />
                      <input value={form.status} onChange={(e) => updateField('status', e.target.value)} className="h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Status" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('upload.imageFile')}</label>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFileChange} disabled={isSaving || isUploading} className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5 file:mr-4 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-white disabled:cursor-not-allowed disabled:opacity-60" />
                      {isUploading && <p className="text-xs font-bold text-[#4CAF50]">{t('upload.uploading')}</p>}
                    </div>
                    <details className="space-y-2">
                      <summary className="cursor-pointer text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('upload.advancedUrl')}</summary>
                      <input value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} disabled={isSaving || isUploading} className="mt-3 h-12 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Image URL" />
                    </details>
                    <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-5 text-sm font-bold outline-none resize-none focus:ring-4 focus:ring-[#4CAF50]/5" placeholder="Notes" />
                    <button type="submit" disabled={isSaving || isUploading} className="inline-flex w-full items-center justify-center h-14 rounded-2xl bg-[#4CAF50] text-white font-black uppercase tracking-widest disabled:opacity-60">
                      {isUploading ? t('upload.uploading') : isSaving ? t('common.saving') : t('userProfile.save')}
                    </button>
                  </form>
                ) : (
                  <>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{plant.notes || t('plantProfile.notesFallback')}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.light')}</p><p className="font-bold">{plant.light || t('common.nA')}</p></div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.water')}</p><p className="font-bold">{plant.water || t('common.nA')}</p></div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.status')}</p><p className="font-bold">{plant.status || t('common.nA')}</p></div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.nextWatering')}</p><p className="font-bold">{plant.nextWatering || t('common.nA')}</p></div>
                    </div>
                    <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60" aria-labelledby="plant-ownership-heading">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#4CAF50]" aria-hidden="true">qr_code_2</span>
                        <div>
                          <h2 id="plant-ownership-heading" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{t('plantProfile.ownership.title')}</h2>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{t('plantProfile.ownership.description')}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('plantProfile.ownership.code')}</p>
                          <p className="mt-1 text-sm font-bold">{plant.ownershipCode || t('common.nA')}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('plantProfile.ownership.status')}</p>
                          <p className="mt-1 text-sm font-bold">{plant.ownershipStatus || t('common.nA')}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('plantProfile.ownership.claimed')}</p>
                          <p className="mt-1 text-sm font-bold">{plant.isClaimed ? t('common.yes') : t('common.no')}</p>
                        </div>
                      </div>
                    </section>
                    <Link to="/app/ai-analysis" className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-[#4CAF50] text-white font-black uppercase tracking-widest">{t('plantProfile.bioScan')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default PlantProfile;
