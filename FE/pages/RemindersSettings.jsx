import React, { useEffect, useMemo, useState } from 'react';
import UserLayout from '../components/UserLayout';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import {
  createReminder,
  deleteReminder,
  generateCombinedCalendarExport,
  generateGoogleCalendarUrl,
  getReminderCalendar,
  getReminderIcs,
  getReminderTypeLabel,
  getReminders,
  markReminderDone,
  updateReminder,
} from '../services/reminderApi';
import { getMyPlants } from '../services/plantApi';
import { useI18n } from '../i18n';

const typeConfig = {
  watering: { labelKey: 'reminders.type.watering', icon: 'water_drop', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  fertilizing: { labelKey: 'reminders.type.fertilizing', icon: 'eco', color: 'text-[#2E7D32]', bg: 'bg-[#F0FDF4] dark:bg-[#4CAF50]/10' },
  check_leaves: { labelKey: 'reminders.type.check_leaves', icon: 'psychiatry', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

const frequencyLabels = {
  daily: 'reminders.frequency.daily',
  weekly: 'reminders.frequency.weekly',
  biweekly: 'reminders.frequency.biweekly',
  monthly: 'reminders.frequency.monthly',
};

const todayKey = new Date().toISOString().slice(0, 10);

const getBucket = (reminder) => {
  if (reminder.completed) return 'completed';
  if (reminder.dueDate <= todayKey) return 'today';
  return 'upcoming';
};

const downloadIcsContent = (content, filename) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\s+/g, '-').toLowerCase();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const openCalendarUrls = (urls = []) => {
  urls.forEach(({ url }, index) => {
    window.setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), index * 250);
  });
};

const getDefaultForm = (plantId = '') => ({
  plantId,
  title: '',
  type: 'watering',
  frequency: 'daily',
  dueDate: new Date().toISOString().slice(0, 10),
  time: '08:00',
  notes: '',
});

const RemindersSettings = () => {
  const { t } = useI18n();
  const [reminders, setReminders] = useState([]);
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(getDefaultForm());
  const [editingId, setEditingId] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadReminders = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextReminders, plantData] = await Promise.all([getReminders(), getMyPlants()]);
      const nextPlants = plantData.items || [];
      setReminders(nextReminders);
      setPlants(nextPlants);
      setForm((prev) => (prev.plantId ? prev : getDefaultForm(nextPlants[0]?.id || '')));
    } catch (err) {
      setError(err?.message || t('reminders.error.load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [t]);

  const grouped = useMemo(() => ({
    today: reminders.filter((item) => getBucket(item) === 'today'),
    upcoming: reminders.filter((item) => getBucket(item) === 'upcoming'),
    completed: reminders.filter((item) => getBucket(item) === 'completed'),
  }), [reminders]);

  const filteredReminders = reminders.filter((item) => activeFilter === 'all' || getBucket(item) === activeFilter);
  const calendarExport = useMemo(() => generateCombinedCalendarExport(reminders), [reminders]);
  const exportableCount = calendarExport.reminders.length;

  const handleAddAllToCalendar = () => {
    if (!exportableCount) return;
    openCalendarUrls(calendarExport.googleCalendarUrls);
    setNotice(t('reminders.notice.opening', { count: exportableCount }));
    setTimeout(() => setNotice(''), 2500);
  };

  const handleDownloadAllIcs = () => {
    if (!exportableCount) return;
    downloadIcsContent(calendarExport.ics, 'deskboost-enabled-reminders.ics');
    setNotice(t('reminders.notice.downloaded', { count: exportableCount }));
    setTimeout(() => setNotice(''), 2500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const updated = await updateReminder(editingId, form);
        setReminders((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setEditingId('');
        setNotice(t('reminders.notice.updated'));
      } else {
        const created = await createReminder(form);
        setReminders((prev) => [created, ...prev]);
        setNotice(t('reminders.notice.added'));
      }
      setForm(getDefaultForm(plants[0]?.id || ''));
      setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      setError(err?.message || t('reminders.error.save'));
    } finally {
      setSaving(false);
    }
  };

  const withReminderAction = async (id, action, fallbackMessage = t('reminders.error.save')) => {
    setActionId(id);
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err?.message || fallbackMessage);
    } finally {
      setActionId('');
    }
  };

  const handleMarkDone = (id) =>
    withReminderAction(id, async () => {
      const updated = await markReminderDone(id);
      setReminders((prev) => prev.map((item) => (item.id === id ? updated : item)));
    });

  const handleDelete = (id) =>
    withReminderAction(id, async () => {
      await deleteReminder(id);
      setReminders((prev) => prev.filter((item) => item.id !== id));
    });

  const handleEdit = (reminder) => {
    setEditingId(reminder.id);
    setForm({
      plantId: reminder.plantId,
      title: reminder.title || '',
      type: reminder.type,
      frequency: reminder.frequency,
      dueDate: reminder.dueDate,
      time: reminder.time,
      notes: reminder.notes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setForm(getDefaultForm(plants[0]?.id || ''));
  };

  const handleAddToCalendar = (reminder) =>
    withReminderAction(reminder.id, async () => {
      const calendar = await getReminderCalendar(reminder.id);
      const url = calendar.googleCalendarUrl || generateGoogleCalendarUrl(reminder);
      window.open(url, '_blank', 'noopener,noreferrer');
    }, t('reminders.error.calendar'));

  const handleDownloadIcs = (reminder) =>
    withReminderAction(reminder.id, async () => {
      const ics = await getReminderIcs(reminder.id);
      downloadIcsContent(
        ics,
        `deskboost-${reminder.plantName}-${getReminderTypeLabel(reminder.type)}.ics`,
      );
    }, t('reminders.error.calendar'));

  const stats = [
    { key: 'today', label: t('reminders.stats.today'), value: grouped.today.length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { key: 'upcoming', label: t('reminders.stats.upcoming'), value: grouped.upcoming.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { key: 'completed', label: t('reminders.stats.completed'), value: grouped.completed.length, color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]/5' },
  ];

  return (
    <UserLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-16">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{t('reminders.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              {t('reminders.description')}
            </p>
          </div>
          <span className="px-3 py-2 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] border border-[#A5D6A7] text-xs font-black">
            {t('reminders.mvpExport')}
          </span>
        </div>

        {error && <StateNotice tone="error">{error}</StateNotice>}
        {notice && <StateNotice tone="success">{notice}</StateNotice>}

        <div className="rounded-3xl border border-[#A5D6A7] bg-[#F0FDF4] dark:bg-[#4CAF50]/10 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#2E7D32]">{t('reminders.exportEyebrow')}</p>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">{t('reminders.exportTitle')}</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t('reminders.exportReady', { count: exportableCount })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button onClick={handleAddAllToCalendar} disabled={!exportableCount} className="px-4 py-3 rounded-xl bg-[#4CAF50] text-white text-xs font-black shadow-lg shadow-[#4CAF50]/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('reminders.addAllGoogle')}
            </button>
            <button onClick={handleDownloadAllIcs} disabled={!exportableCount} className="px-4 py-3 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-white dark:bg-slate-900 text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed">
              {t('reminders.downloadAll')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((stat) => (
            <button key={stat.key} onClick={() => setActiveFilter(stat.key)} className={`text-left p-4 rounded-2xl border transition-all ${stat.bg} ${activeFilter === stat.key ? 'border-[#4CAF50] ring-2 ring-[#A5D6A7]/40' : 'border-slate-100 dark:border-slate-800'}`}>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
            </button>
          ))}
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4CAF50]">notifications_active</span>
                {editingId ? t('reminders.editTitle') : t('reminders.settingsTitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t('reminders.settingsDesc')}</p>
            </div>
            <button onClick={() => setActiveFilter('all')} className="text-xs font-black text-[#4CAF50] hover:text-[#2E7D32]">{t('reminders.showAll')}</button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-6 gap-3 border-b border-slate-50 dark:border-slate-800">
            <select value={form.plantId} onChange={(event) => setForm((prev) => ({ ...prev, plantId: event.target.value }))} className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" required disabled={!plants.length}>
              {plants.length === 0 && <option value="">{t('reminders.noPlants')}</option>}
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>{plant.nickname || plant.name}</option>
              ))}
            </select>
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold">
              <option value="watering">{t('reminders.type.watering')}</option>
              <option value="fertilizing">{t('reminders.type.fertilizing')}</option>
              <option value="check_leaves">{t('reminders.type.check_leaves')}</option>
            </select>
            <select value={form.frequency} onChange={(event) => setForm((prev) => ({ ...prev, frequency: event.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold">
              <option value="daily">{t('reminders.frequency.daily')}</option>
              <option value="weekly">{t('reminders.frequency.weekly')}</option>
              <option value="biweekly">{t('reminders.frequency.biweekly')}</option>
              <option value="monthly">{t('reminders.frequency.monthly')}</option>
            </select>
            <input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" />
            <input type="time" value={form.time} onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" />
            <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" placeholder={t('reminders.titlePlaceholder')} />
            <input value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="md:col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" placeholder={t('reminders.notesPlaceholder')} />
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 text-xs font-black">
                  {t('common.cancel')}
                </button>
              )}
              <button type="submit" disabled={saving || !plants.length} className="flex-1 px-4 py-3 rounded-xl bg-[#4CAF50] text-white text-xs font-black shadow-lg shadow-[#4CAF50]/20 disabled:opacity-60">
                {saving ? t('common.saving') : editingId ? t('common.save') : t('common.add')}
              </button>
            </div>
          </form>

          <div className="p-4 space-y-3">
            {loading && <LoadingState message={t('reminders.loading')} />}
            {!loading && filteredReminders.length === 0 && (
              <EmptyState icon="event_available" title={t('reminders.emptyTitle')} description={t('reminders.emptyDescription')} />
            )}
            {!loading && filteredReminders.map((reminder) => {
              const cfg = typeConfig[reminder.type] || typeConfig.watering;
              const bucket = getBucket(reminder);
              return (
                <article key={reminder.id} className={`rounded-3xl border p-4 transition-all ${reminder.completed ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center text-2xl ${cfg.bg}`}>{reminder.plantEmoji || '🌿'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 dark:text-white">{reminder.plantName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${reminder.enabled ? 'bg-[#F0FDF4] text-[#2E7D32]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{reminder.enabled ? t('common.enabled') : t('common.disabled')}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">{t(`reminders.stats.${bucket}`)}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-xs font-bold text-slate-500">
                        <span className={`${cfg.color} flex items-center gap-1`}><span className="material-symbols-outlined text-sm">{cfg.icon}</span>{t(cfg.labelKey)}</span>
                        <span>·</span>
                        <span>{frequencyLabels[reminder.frequency] ? t(frequencyLabels[reminder.frequency]) : reminder.frequency}</span>
                        <span>·</span>
                        <span>{t('reminders.dueAt', { date: reminder.dueDate, time: reminder.time })}</span>
                      </div>
                      {reminder.notes && <p className="mt-2 text-xs font-semibold text-slate-400">{reminder.notes}</p>}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {!reminder.completed && (
                      <button disabled={actionId === reminder.id} onClick={() => handleMarkDone(reminder.id)} className="px-4 py-2 rounded-xl bg-[#4CAF50] text-white text-xs font-black hover:bg-[#43A047] transition-colors disabled:opacity-60">
                        {t('reminders.markDone')}
                      </button>
                    )}
                    <button disabled={actionId === reminder.id} onClick={() => handleEdit(reminder)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 disabled:opacity-60">
                      {t('common.edit')}
                    </button>
                    <button disabled={actionId === reminder.id} onClick={() => handleAddToCalendar(reminder)} className="px-4 py-2 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-[#F0FDF4] text-xs font-black disabled:opacity-60">
                      {t('reminders.addCalendar')}
                    </button>
                    <button disabled={actionId === reminder.id} onClick={() => handleDownloadIcs(reminder)} className="px-4 py-2 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-white dark:bg-slate-900 text-xs font-black disabled:opacity-60">
                      {t('reminders.downloadIcs')}
                    </button>
                    <button disabled={actionId === reminder.id} onClick={() => handleDelete(reminder.id)} className="ml-auto px-4 py-2 rounded-xl text-red-500 text-xs font-black hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60">
                      {t('common.delete')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default RemindersSettings;
