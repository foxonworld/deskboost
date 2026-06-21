import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { deleteMyPlant, updateMyPlant, getMyPlant, getMyPlants } from '../services/plantApi';
import { getReminders, getReminderTypeLabel } from '../services/reminderApi';
import { getMyAiDialogs } from '../services/aiApi';
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
const isPendingReminder = (reminder) => String(reminder.status || '').toLowerCase() === 'pending' && !reminder.completed;

const sortByDueAt = (items) => [...items].sort((a, b) => (parseDate(a.dueAt)?.getTime() || 0) - (parseDate(b.dueAt)?.getTime() || 0));
const sortByLatestDone = (items) => [...items].sort((a, b) => (parseDate(b.completedAt)?.getTime() || 0) - (parseDate(a.completedAt)?.getTime() || 0));

const getPlantFromDetailOrList = async (id) => {
  try {
    return await getMyPlant(id);
  } catch (err) {
    const data = await getMyPlants();
    const plant = (data?.items || []).find((item) => item.id === id);
    if (plant) return plant;
    throw err;
  }
};

const InfoTile = ({ icon, label, value, tone = 'slate' }) => {
  const toneClass = tone === 'green' ? 'bg-[#4CAF50]/10 text-[#2E7D32] dark:bg-[#4CAF50]/20 dark:text-[#A5D6A7]' : tone === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' : 'bg-slate-500/10 text-slate-600 dark:bg-white/5 dark:text-slate-300';
  return (
    <div className="rounded-[24px] bg-white/60 dark:bg-[#1A231C]/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm p-5 transition-all hover:bg-white/80 dark:hover:bg-[#1A231C]/80">
      <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-2xl ${toneClass}`}>
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-base font-extrabold leading-6 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

const PlantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [plant, setPlant] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [aiDialogs, setAiDialogs] = useState([]);
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
        const [nextPlant, nextReminders, nextDialogs] = await Promise.all([
          getPlantFromDetailOrList(id),
          getReminders().catch((err) => {
            if (alive) setSecondaryError(err?.message || 'Không tải được lịch chăm sóc của cây.');
            return [];
          }),
          getMyAiDialogs({ limit: 20 }).catch(() => ({ items: [] })),
        ]);
        if (!alive) return;
        setPlant(nextPlant);
        setReminders(nextReminders);
        setAiDialogs(Array.isArray(nextDialogs) ? nextDialogs : nextDialogs?.items || []);
        syncForm(nextPlant);
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

  const plantReminders = useMemo(
    () => reminders.filter((reminder) => String(reminder.plantId) === String(id)),
    [id, reminders]
  );
  const pendingReminders = useMemo(
    () => sortByDueAt(plantReminders.filter(isPendingReminder)),
    [plantReminders]
  );
  const nextWatering = useMemo(
    () => sortByDueAt(pendingReminders.filter(isWateringReminder))[0] || null,
    [pendingReminders]
  );
  const lastWatered = useMemo(
    () => sortByLatestDone(plantReminders.filter((reminder) => isWateringReminder(reminder) && reminder.completedAt))[0] || null,
    [plantReminders]
  );
  const recentDialogs = useMemo(
    () => aiDialogs.filter((dialog) => String(dialog.plantId || '') === String(id)),
    [aiDialogs, id]
  );

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
          <div className="rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#4CAF50] mb-4">progress_activity</span>
            <p className="font-black text-slate-500 dark:text-slate-400">{t('plantProfile.loading')}</p>
          </div>
        ) : !plant ? (
          <div className="rounded-[32px] border border-dashed border-slate-300/50 bg-white/40 dark:bg-[#111813]/40 p-16 text-center dark:border-white/10 backdrop-blur-xl">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">search_off</span>
            <p className="mt-4 text-xl font-black text-slate-700 dark:text-white">{t('plantProfile.notFound')}</p>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-[400px] bg-slate-100 dark:bg-[#0B1510]">
                  {imageSrc ? (
                    <>
                      <img src={imageSrc} alt={plantName} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-40 lg:hidden"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#E8F5E9] dark:from-[#112417] dark:to-[#0B1510] text-[#4CAF50]">
                      <span className="material-symbols-outlined text-7xl opacity-50" aria-hidden="true">potted_plant</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 md:p-10 relative z-10">
                  <div>
                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#4CAF50]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#4CAF50] ring-1 ring-[#4CAF50]/20 backdrop-blur-md">
                        <span className="material-symbols-outlined text-[12px]">vital_signs</span>
                        {displayStatus(plant.status)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 ring-1 ring-slate-500/20 backdrop-blur-md dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                        {plant.isClaimed ? 'Đã claim' : displayValue(plant.ownershipStatus, 'Chưa claim')}
                      </span>
                      {plant.careLevel && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-500/20 backdrop-blur-md dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/30">
                          {plant.careLevel}
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">{plantName}</h1>
                    <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-[#4CAF50]">
                      <span className="material-symbols-outlined text-[14px]">local_florist</span>
                      {displayValue(plant.species, 'Chưa có loài cây')}
                    </p>
                    <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">{plant.notes || 'Chưa có ghi chú riêng cho cây này.'}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link to={aiChatLink} state={{ selectedPlantId: id }} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#4CAF50] px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-105 active:scale-95">
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">forum</span>
                      Hỏi AI
                    </Link>
                    <Link to={aiAnalysisLink} state={{ selectedPlantId: id }} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#4CAF50]/30 bg-white/50 px-6 text-xs font-black uppercase tracking-widest text-[#2E7D32] backdrop-blur-md transition hover:bg-white dark:bg-black/20 dark:text-[#A5D6A7] dark:hover:bg-black/40">
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">health_and_safety</span>
                      Chẩn đoán ảnh
                    </Link>
                    <button type="button" onClick={handleToggleEdit} disabled={isSaving || isUploading} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200/50 bg-white/50 px-6 text-xs font-black uppercase tracking-widest text-slate-700 backdrop-blur-md transition hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-slate-300 dark:hover:bg-black/40">
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">edit</span>
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
                <div className="rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                        <span className="material-symbols-outlined text-[14px]">eco</span>
                        Care snapshot
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Thông tin chăm sóc thật</h2>
                    </div>
                    <Link to={remindersLink} state={{ selectedPlantId: id }} className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4CAF50]/30 bg-[#4CAF50]/5 px-5 text-[10px] font-black uppercase tracking-widest text-[#4CAF50] transition hover:bg-[#4CAF50]/10">Tạo nhắc nhở</Link>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <InfoTile icon="wb_sunny" label="Ánh sáng" value={displayValue(plant.light)} />
                    <InfoTile icon="opacity" label="Nhu cầu nước" value={displayValue(plant.water)} />
                    <InfoTile icon="place" label="Vị trí" value={displayValue(plant.location)} />
                    <InfoTile icon="verified" label="Claim status" value={plant.ownershipCode ? `${displayValue(plant.ownershipStatus)} · ${plant.ownershipCode}` : displayValue(plant.ownershipStatus)} />
                  </div>
                </div>

                <div className="rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                        Upcoming care
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Lịch chăm sóc</h2>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {pendingReminders.length ? pendingReminders.slice(0, 5).map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-4 rounded-[24px] border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-white dark:border-white/5 dark:bg-[#1A231C]/60 dark:hover:bg-[#1A231C]/80">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4CAF50]/10 text-[#4CAF50]">
                          <span className="material-symbols-outlined" aria-hidden="true">notifications_active</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{reminder.title || careTypeLabels[reminder.type] || getReminderTypeLabel(reminder.type)}</p>
                          <p className="mt-1 truncate text-xs font-bold text-slate-500">{careTypeLabels[reminder.type] || reminder.type} · {formatDateTime(reminder.dueAt)}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-[24px] border border-dashed border-slate-300/50 bg-white/40 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-black/20">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Chưa có lịch chăm sóc thật cho cây này.</p>
                        <Link to={remindersLink} state={{ selectedPlantId: id }} className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-[#4CAF50] px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-105 active:scale-95">Tạo nhắc nhở</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <aside className="min-w-0 space-y-6">
                <div className="relative overflow-hidden rounded-[32px] bg-[#4CAF50]/5 backdrop-blur-xl border border-[#4CAF50]/20 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:bg-[#4CAF50]/10 dark:border-[#4CAF50]/10">
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#4CAF50]/10 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="relative z-10">
                    <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                      <span className="material-symbols-outlined text-[14px]">psychiatry</span>
                      AI care
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Làm việc tiếp với AI</h2>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">Mở chat hoặc chẩn đoán với đúng context của cây này.</p>
                    <div className="mt-6 grid gap-3">
                      <Link to={aiChatLink} state={{ selectedPlantId: id }} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#4CAF50] px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-105 active:scale-95">
                        Hỏi AI về cây này
                      </Link>
                      <Link to={aiAnalysisLink} state={{ selectedPlantId: id }} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#4CAF50]/30 bg-white/50 px-6 text-xs font-black uppercase tracking-widest text-[#2E7D32] backdrop-blur-md transition hover:bg-white dark:bg-black/20 dark:text-[#A5D6A7] dark:hover:bg-black/40">
                        Chẩn đoán ảnh cây này
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    Recent AI dialogs
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Cuộc trò chuyện gần đây</h2>
                  <div className="mt-6 space-y-3">
                    {recentDialogs.length ? recentDialogs.map((dialog) => (
                      <Link key={dialog.id} to={aiChatLink} state={{ selectedPlantId: id }} className="block rounded-[24px] border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#4CAF50]/30 dark:border-white/5 dark:bg-[#1A231C]/60 dark:hover:bg-[#1A231C]/80">
                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">{dialog.title || dialog.plantName || 'AI dialog'}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">{dialog.lastMessage || formatDate(dialog.createdAt)}</p>
                      </Link>
                    )) : (
                      <div className="rounded-[24px] border border-dashed border-slate-300/50 bg-white/40 p-6 text-center backdrop-blur-sm dark:border-white/10 dark:bg-black/20">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Chưa có cuộc trò chuyện AI gần đây.</p>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </section>

            {isEditing && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
                onClick={handleToggleEdit}
              >
                <div 
                  className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white/95 dark:bg-[#111813]/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Edit profile
                      </p>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">Cập nhật hồ sơ cây</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={handleDelete} 
                        disabled={isSaving} 
                        className="rounded-2xl bg-rose-50 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-950/30 dark:text-rose-400"
                      >
                        Xóa cây
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleEdit}
                        className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200/50 bg-white/50 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-black/20 dark:text-slate-400 dark:hover:bg-black/40 dark:hover:text-white"
                        aria-label="Đóng"
                      >
                        <span className="material-symbols-outlined text-2xl">close</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tên gọi (nickname) *</label>
                        <input 
                          value={form.nickname} 
                          onChange={(e) => updateField('nickname', e.target.value)} 
                          required 
                          className="h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                          placeholder="Ví dụ: Victor the Vine" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loài cây</label>
                        <input 
                          value={form.species} 
                          onChange={(e) => updateField('species', e.target.value)} 
                          className="h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                          placeholder="Ví dụ: Monstera Deliciosa" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vị trí đặt</label>
                        <input 
                          value={form.location} 
                          onChange={(e) => updateField('location', e.target.value)} 
                          className="h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                          placeholder="Ví dụ: Central Command (Desk)" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                        <input 
                          value={form.status} 
                          onChange={(e) => updateField('status', e.target.value)} 
                          className="h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                          placeholder="Ví dụ: healthy" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ghi chú</label>
                      <textarea 
                        value={form.notes} 
                        onChange={(e) => updateField('notes', e.target.value)} 
                        rows={3} 
                        className="w-full resize-none rounded-2xl border border-white/60 bg-white/50 p-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                        placeholder="Ghi chú chi tiết về tình trạng hoặc cách chăm sóc cây..." 
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {t('upload.imageFile')}
                        </label>
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp,image/gif" 
                          onChange={handleImageFileChange} 
                          disabled={isSaving || isUploading} 
                          className="w-full rounded-2xl border border-white/60 bg-white/50 px-5 py-3 text-sm font-bold text-slate-700 outline-none transition-all file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-white file:transition hover:file:opacity-90 focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                        <input 
                          value={form.imageUrl} 
                          onChange={(e) => updateField('imageUrl', e.target.value)} 
                          disabled={isSaving || isUploading} 
                          className="h-14 w-full rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
                          placeholder="https://example.com/plant.jpg" 
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200/50 dark:border-white/10">
                      <button 
                        type="button" 
                        onClick={handleToggleEdit} 
                        className="h-14 rounded-2xl border border-slate-200/50 bg-white/50 px-8 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-slate-300 dark:hover:bg-black/40"
                      >
                        {t('common.cancel')}
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSaving || isUploading} 
                        className="h-14 rounded-2xl bg-[#4CAF50] px-8 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {isUploading ? t('upload.uploading') : isSaving ? t('common.saving') : t('userProfile.save')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </UserLayout>
  );
};

export default PlantProfile;
