import React, { useEffect, useMemo, useState } from 'react';
import UserLayout from '../components/UserLayout';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import {
  createReminder,
  deleteReminder,
  generateCombinedCalendarExport,
  generateGoogleCalendarUrl,
  generateIcsFile,
  getReminderTypeLabel,
  getReminders,
  markReminderDone,
  updateReminder,
} from '../services/reminderApi';

const typeConfig = {
  watering: { label: 'watering', icon: 'water_drop', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  fertilizing: { label: 'fertilizing', icon: 'eco', color: 'text-[#2E7D32]', bg: 'bg-[#F0FDF4] dark:bg-[#4CAF50]/10' },
  check_leaves: { label: 'check leaves', icon: 'psychiatry', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
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

const downloadIcs = (reminder) => {
  downloadIcsContent(
    generateIcsFile(reminder),
    `deskboost-${reminder.plantName}-${getReminderTypeLabel(reminder.type)}.ics`,
  );
};

const openCalendarUrls = (urls = []) => {
  urls.forEach(({ url }, index) => {
    window.setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), index * 250);
  });
};

const defaultForm = {
  plantName: 'Monstera Deliciosa',
  plantEmoji: '🌿',
  type: 'watering',
  frequency: 'daily',
  time: '08:00',
  enabled: true,
};

const RemindersSettings = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadReminders = async () => {
    setLoading(true);
    setError('');
    try {
      setReminders(await getReminders());
    } catch (err) {
      setError(err?.message || 'Không tải được nhắc nhở. Đang dùng dữ liệu dự phòng nếu có.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

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
    setNotice(`Opening ${exportableCount} enabled reminder${exportableCount > 1 ? 's' : ''} for one-time calendar add.`);
    setTimeout(() => setNotice(''), 2500);
  };

  const handleDownloadAllIcs = () => {
    if (!exportableCount) return;
    downloadIcsContent(calendarExport.ics, 'deskboost-enabled-reminders.ics');
    setNotice(`Downloaded ${exportableCount} enabled reminder${exportableCount > 1 ? 's' : ''} as one .ics file.`);
    setTimeout(() => setNotice(''), 2500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await createReminder(form);
      setReminders((prev) => [created, ...prev]);
      setForm(defaultForm);
      setNotice('Đã thêm nhắc nhở trong app. Calendar chỉ là add/export thủ công.');
      setTimeout(() => setNotice(''), 2500);
    } catch (err) {
      setError(err?.message || 'Không lưu được nhắc nhở.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async (id) => {
    const updated = await markReminderDone(id);
    setReminders((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleToggleEnabled = async (reminder) => {
    const updated = await updateReminder(reminder.id, { enabled: !reminder.enabled });
    setReminders((prev) => prev.map((item) => (item.id === reminder.id ? updated : item)));
  };

  const handleDelete = async (id) => {
    await deleteReminder(id);
    setReminders((prev) => prev.filter((item) => item.id !== id));
  };

  const stats = [
    { key: 'today', label: 'Today', value: grouped.today.length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { key: 'upcoming', label: 'Upcoming', value: grouped.upcoming.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { key: 'completed', label: 'Completed', value: grouped.completed.length, color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]/5' },
  ];

  return (
    <UserLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-16">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Care Reminders</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              In-app reminders with one-time Add to Calendar / .ics export.
            </p>
          </div>
          <span className="px-3 py-2 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] border border-[#A5D6A7] text-xs font-black">
            MVP calendar export
          </span>
        </div>

        {error && <StateNotice tone="error">{error}</StateNotice>}
        {notice && <StateNotice tone="success">{notice}</StateNotice>}

        <div className="rounded-3xl border border-[#A5D6A7] bg-[#F0FDF4] dark:bg-[#4CAF50]/10 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#2E7D32]">Calendar export</p>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Export enabled reminders</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {exportableCount} enabled, incomplete reminder{exportableCount === 1 ? '' : 's'} ready. Completed or disabled reminders are skipped.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button onClick={handleAddAllToCalendar} disabled={!exportableCount} className="px-4 py-3 rounded-xl bg-[#4CAF50] text-white text-xs font-black shadow-lg shadow-[#4CAF50]/20 disabled:opacity-50 disabled:cursor-not-allowed">
              Add all to Google Calendar
            </button>
            <button onClick={handleDownloadAllIcs} disabled={!exportableCount} className="px-4 py-3 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-white dark:bg-slate-900 text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed">
              Download all .ics
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
                Reminder settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">Configure plant, type, frequency, time, enabled state.</p>
            </div>
            <button onClick={() => setActiveFilter('all')} className="text-xs font-black text-[#4CAF50] hover:text-[#2E7D32]">Show all</button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-6 gap-3 border-b border-slate-50 dark:border-slate-800">
            <input value={form.plantName} onChange={(e) => setForm((prev) => ({ ...prev, plantName: e.target.value }))} className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" placeholder="Plant" required />
            <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold">
              <option value="watering">watering</option>
              <option value="fertilizing">fertilizing</option>
              <option value="check_leaves">check leaves</option>
            </select>
            <select value={form.frequency} onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
            <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 text-sm font-bold" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))} className={`px-4 py-3 rounded-xl text-xs font-black ${form.enabled ? 'bg-[#4CAF50] text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                {form.enabled ? 'Enabled' : 'Disabled'}
              </button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-3 rounded-xl bg-[#4CAF50] text-white text-xs font-black shadow-lg shadow-[#4CAF50]/20 disabled:opacity-60">
                {saving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>

          <div className="p-4 space-y-3">
            {loading && <LoadingState message="Loading reminders..." />}
            {!loading && filteredReminders.length === 0 && (
              <EmptyState icon="event_available" title="No reminders yet" description="Add a simple care reminder for watering, fertilizing, or check leaves." />
            )}
            {!loading && filteredReminders.map((reminder) => {
              const cfg = typeConfig[reminder.type] || typeConfig.watering;
              const bucket = getBucket(reminder);
              return (
                <article key={reminder.id} className={`rounded-3xl border p-4 transition-all ${reminder.completed ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center text-2xl ${cfg.bg}`}>{reminder.plantEmoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 dark:text-white">{reminder.plantName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${reminder.enabled ? 'bg-[#F0FDF4] text-[#2E7D32]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{reminder.enabled ? 'enabled' : 'disabled'}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">{bucket}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-xs font-bold text-slate-500">
                        <span className={`${cfg.color} flex items-center gap-1`}><span className="material-symbols-outlined text-sm">{cfg.icon}</span>{cfg.label}</span>
                        <span>·</span>
                        <span>{frequencyLabels[reminder.frequency] || reminder.frequency}</span>
                        <span>·</span>
                        <span>{reminder.dueDate} at {reminder.time}</span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-400">Email reminder: future backend enhancement only.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {!reminder.completed && (
                      <button onClick={() => handleMarkDone(reminder.id)} className="px-4 py-2 rounded-xl bg-[#4CAF50] text-white text-xs font-black hover:bg-[#43A047] transition-colors">
                        Mark done
                      </button>
                    )}
                    <button onClick={() => handleToggleEnabled(reminder)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300">
                      {reminder.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <a href={generateGoogleCalendarUrl(reminder)} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-[#F0FDF4] text-xs font-black">
                      Add to Calendar
                    </a>
                    <button onClick={() => downloadIcs(reminder)} className="px-4 py-2 rounded-xl border border-[#A5D6A7] text-[#2E7D32] bg-white dark:bg-slate-900 text-xs font-black">
                      Download .ics
                    </button>
                    <button onClick={() => handleDelete(reminder.id)} className="ml-auto px-4 py-2 rounded-xl text-red-500 text-xs font-black hover:bg-red-50 dark:hover:bg-red-900/20">
                      Delete
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
