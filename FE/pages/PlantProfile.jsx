import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { deleteMyPlant, updateMyPlant, getPlantCareProfile } from '../services/plantApi';
import { getReminderTypeLabel } from '../services/reminderApi';
import { uploadImage, validateImageFile } from '../services/uploadApi';
import { useI18n } from '../i18n';

const careTypeLabels = {
  watering: 'Tưới nước',
  fertilizing: 'Bón phân',
  check_leaves: 'Kiểm tra lá',
};

const statusLabels = {
  healthy: 'Khỏe mạnh',
  'needs-water': 'Cần tưới',
  issue: 'Cần chú ý',
  active: 'Đang theo dõi',
};

const parseDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const formatDateTime = (value) => {
  const date = parseDate(value);
  if (!date) return 'Chưa có dữ liệu';
  return date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return 'Chưa có dữ liệu';
  return date.toLocaleDateString('vi-VN', { dateStyle: 'medium' });
};

const displayValue = (value, fallback = 'Chưa có dữ liệu') => value || fallback;
const displayStatus = (value) => statusLabels[String(value || '').toLowerCase()] || displayValue(value);
const isWateringReminder = (reminder) => reminder.type === 'watering' || reminder.careType === 'watering';

const sortByDueAt = (items) => [...items].sort((a, b) => (parseDate(a.dueAt)?.getTime() || 0) - (parseDate(b.dueAt)?.getTime() || 0));
const sortByLatestDone = (items) => [...items].sort((a, b) => (parseDate(b.completedAt)?.getTime() || 0) - (parseDate(a.completedAt)?.getTime() || 0));

const InfoTile = ({ icon, label, value, tone = 'slate' }) => {
  const toneClass = tone === 'green' ? 'bg-[#F0FDF4] text-[#2E7D32]' : tone === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${toneClass}`}>
        <span className="material-symbols-outlined text-xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold leading-5 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

const PlantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [plant, setPlant] = useState(null);
  const [careProfile, setCareProfile] = useState(null);
  const [form, setForm] = useState({ nickname: '', species: '', location: '', imageUrl: '', status: '', notes: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [secondaryError, setSecondaryError] = useState('');

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
      setSecondaryError('');
      try {
        const profile = await getPlantCareProfile(id);
        if (!alive) return;
        setPlant(profile.plant);
        setCareProfile(profile);
        syncForm(profile.plant);
      } catch (err) {
        if (!alive) return;
        setPlant(null);
        setError(err?.message || t('plantProfile.notFoundError'));
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

  const pendingReminders = useMemo(() => careProfile?.nextReminders || [], [careProfile]);
  const nextWatering = useMemo(() => careProfile?.careSummary?.nextWateringAt ? { dueAt: careProfile.careSummary.nextWateringAt } : null, [careProfile]);
  const lastWatered = useMemo(() => careProfile?.careSummary?.lastWateredAt ? { completedAt: careProfile.careSummary.lastWateredAt } : null, [careProfile]);
  const recentDialogs = useMemo(() => careProfile?.recentAiDialogs || [], [careProfile]);
  const latestDiagnosis = useMemo(() => careProfile?.latestDiagnosis || null, [careProfile]);

  const imageSrc = previewUrl || form.imageUrl || plant?.image || plant?.imageUrl;
  const plantName = plant?.nickname || plant?.name || 'Cây của tôi';
  const aiChatLink = `/app/ai-chat?plantId=${id}`;
  const aiAnalysisLink = `/app/ai-analysis?plantId=${id}`;
  const remindersLink = `/app/settings?plantId=${id}`;

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
      setError(err?.message || 'Không thể cập nhật hồ sơ cây.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Xóa cây này khỏi My Plants?')) return;
    setIsSaving(true);
    setError('');
    try {
      await deleteMyPlant(id);
      navigate('/app/my-plants');
    } catch (err) {
      setError(err?.message || 'Không thể xóa cây.');
      setIsSaving(false);
    }
  };

  return (
    <UserLayout>
      <main className="mx-auto max-w-6xl space-y-6 p-4 pb-20 sm:p-6 md:p-8">
        <Link to="/app/my-plants" className="inline-flex items-center gap-2 text-sm font-bold text-[#4CAF50] hover:underline">
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
          {t('plantProfile.back')}
        </Link>

        {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">{error}</div>}
        {secondaryError && <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700">{secondaryError}</div>}

        {isLoading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center font-black text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">{t('plantProfile.loading')}</div>
        ) : !plant ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
            <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
            <p className="mt-4 text-xl font-black text-slate-700 dark:text-white">{t('plantProfile.notFound')}</p>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-[400px] bg-slate-100 dark:bg-slate-800">
                  {imageSrc ? (
                    <img src={imageSrc} alt={plantName} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#4CAF50]">
                      <span className="material-symbols-outlined text-7xl" aria-hidden="true">potted_plant</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                  <div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-black text-[#2E7D32]">{displayStatus(plant.status)}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">{plant.isClaimed ? 'Đã claim' : displayValue(plant.ownershipStatus, 'Chưa claim')}</span>
                      {plant.careLevel && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">{plant.careLevel}</span>}
                    </div>
                    <h1 className="text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">{plantName}</h1>
                    <p className="mt-3 text-sm font-black uppercase tracking-wide text-[#4CAF50]">{displayValue(plant.species, 'Chưa có loài cây')}</p>
                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-400">{plant.notes || 'Chưa có ghi chú riêng cho cây này.'}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link to={aiChatLink} state={{ selectedPlantId: id }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4CAF50] px-5 text-sm font-black text-white shadow-lg shadow-[#4CAF50]/20 hover:bg-[#43A047]">
                      <span className="material-symbols-outlined text-base" aria-hidden="true">forum</span>
                      Hỏi AI về cây này
                    </Link>
                    <Link to={aiAnalysisLink} state={{ selectedPlantId: id }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#A5D6A7] bg-[#F0FDF4] px-5 text-sm font-black text-[#2E7D32]">
                      <span className="material-symbols-outlined text-base" aria-hidden="true">health_and_safety</span>
                      Chẩn đoán ảnh
                    </Link>
                    <button type="button" onClick={handleToggleEdit} disabled={isSaving || isUploading} className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      {isEditing ? t('common.cancel') : 'Sửa hồ sơ'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoTile icon="water_drop" label="Lần tưới tiếp theo" value={nextWatering ? formatDateTime(nextWatering.dueAt) : 'Chưa có lịch tưới'} tone="blue" />
              <InfoTile icon="history" label="Lần tưới gần nhất" value={lastWatered ? formatDateTime(lastWatered.completedAt) : 'Chưa có dữ liệu'} tone="green" />
              <InfoTile icon="calendar_month" label="Chu kỳ tưới gợi ý" value={plant.wateringCycleDays ? `Mỗi ${plant.wateringCycleDays} ngày` : 'Chưa có dữ liệu'} />
              <InfoTile icon="psychiatry" label="Tình trạng gần nhất" value={displayStatus(plant.lastCondition || plant.status)} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-w-0 space-y-6">
                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#4CAF50]">Care snapshot</p>
                      <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Thông tin chăm sóc thật</h2>
                    </div>
                    <Link to={remindersLink} state={{ selectedPlantId: id }} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#A5D6A7] px-4 text-xs font-black text-[#2E7D32]">Tạo nhắc nhở</Link>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoTile icon="wb_sunny" label="Ánh sáng" value={displayValue(plant.light)} />
                    <InfoTile icon="opacity" label="Nhu cầu nước" value={displayValue(plant.water)} />
                    <InfoTile icon="place" label="Vị trí" value={displayValue(plant.location)} />
                    <InfoTile icon="verified" label="Claim status" value={plant.ownershipCode ? `${displayValue(plant.ownershipStatus)} · ${plant.ownershipCode}` : displayValue(plant.ownershipStatus)} />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-[#4CAF50]">Upcoming care</p>
                      <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Lịch chăm sóc của cây này</h2>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {pendingReminders.length ? pendingReminders.slice(0, 5).map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                        <span className="material-symbols-outlined text-[#4CAF50]" aria-hidden="true">notifications_active</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{reminder.title || careTypeLabels[reminder.type] || getReminderTypeLabel(reminder.type)}</p>
                          <p className="truncate text-xs font-bold text-slate-500">{careTypeLabels[reminder.type] || reminder.type} · {formatDateTime(reminder.dueAt)}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
                        <p className="text-sm font-black text-slate-700 dark:text-white">Chưa có lịch chăm sóc thật cho cây này.</p>
                        <Link to={remindersLink} state={{ selectedPlantId: id }} className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-[#4CAF50] px-4 text-xs font-black text-white">Tạo nhắc nhở</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <aside className="min-w-0 space-y-6">
                <div className="rounded-3xl border border-[#A5D6A7] bg-[#F0FDF4] p-5 shadow-sm dark:bg-[#4CAF50]/10">
                  <p className="text-xs font-black uppercase tracking-wide text-[#2E7D32]">AI care</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Làm việc tiếp với AI</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Mở chat hoặc chẩn đoán với đúng context của cây này.</p>
                  <div className="mt-4 grid gap-2">
                    <Link to={aiChatLink} state={{ selectedPlantId: id }} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#4CAF50] text-xs font-black text-white">Hỏi AI về cây này</Link>
                    <Link to={aiAnalysisLink} state={{ selectedPlantId: id }} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#A5D6A7] bg-white text-xs font-black text-[#2E7D32] dark:bg-slate-900">Chẩn đoán ảnh cây này</Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-wide text-[#4CAF50]">Recent AI dialogs</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">Cuộc trò chuyện gần đây</h2>
                  <div className="mt-4 space-y-2">
                    {recentDialogs.length ? recentDialogs.map((dialog) => (
                      <Link key={dialog.id} to={aiChatLink} state={{ selectedPlantId: id }} className="block rounded-2xl border border-slate-100 px-4 py-3 hover:border-[#A5D6A7] dark:border-slate-800">
                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">{dialog.title || dialog.plantName || 'AI dialog'}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">{dialog.lastMessage || formatDate(dialog.createdAt)}</p>
                      </Link>
                    )) : (
                      <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500 dark:bg-slate-800/60">Chưa có cuộc trò chuyện AI gần đây cho cây này.</p>
                    )}
                  </div>
                </div>
              </aside>
            </section>

            {isEditing && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#4CAF50]">Edit profile</p>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Cập nhật hồ sơ cây</h2>
                  </div>
                  <button type="button" onClick={handleDelete} disabled={isSaving} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 hover:bg-red-100 disabled:opacity-60">Xóa cây</button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <input value={form.nickname} onChange={(e) => updateField('nickname', e.target.value)} required className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Tên cây" />
                    <input value={form.species} onChange={(e) => updateField('species', e.target.value)} className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Loài cây" />
                    <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Vị trí" />
                    <input value={form.status} onChange={(e) => updateField('status', e.target.value)} className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Trạng thái" />
                  </div>
                  <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Ghi chú" />
                  <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                    <label className="space-y-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      {t('upload.imageFile')}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFileChange} disabled={isSaving || isUploading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold file:mr-3 file:rounded-lg file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    </label>
                    <label className="space-y-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      Image URL
                      <input value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} disabled={isSaving || isUploading} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="https://example.com/plant.jpg" />
                    </label>
                    <button type="submit" disabled={isSaving || isUploading} className="h-12 rounded-xl bg-[#4CAF50] px-6 text-sm font-black text-white shadow-lg shadow-[#4CAF50]/20 disabled:opacity-60">
                      {isUploading ? t('upload.uploading') : isSaving ? t('common.saving') : t('userProfile.save')}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </main>
    </UserLayout>
  );
};

export default PlantProfile;
