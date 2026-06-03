import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useI18n } from '../../i18n';
import { adminSendNotification, adminGetNotifications, adminDeleteNotification } from '../../services/notificationApi';

const TYPE_OPTIONS = ['promo', 'care_tip', 'announcement'];

const typeIcon = { promo: 'local_offer', care_tip: 'eco', announcement: 'campaign' };
const typeBg = {
  promo: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  care_tip: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  announcement: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
};

const timeStr = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString('vi-VN'); } catch { return iso; }
};

const INIT_FORM = { title: '', body: '', type: 'announcement', targetType: 'all', userId: '' };

const AdminNotifications = () => {
  const { t } = useI18n();
  const [form, setForm] = useState(INIT_FORM);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null); // { ok, msg }
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const items = await adminGetNotifications();
      setHistory(items);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setSendResult({ ok: false, msg: t('adminNotif.form.errorRequired') });
      return;
    }
    if (form.targetType === 'specific' && !form.userId.trim()) {
      setSendResult({ ok: false, msg: t('adminNotif.form.errorUserId') });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        targetType: form.targetType,
        targetUserIds: form.targetType === 'specific' ? [form.userId.trim()] : null,
      };
      await adminSendNotification(payload);
      setSendResult({ ok: true, msg: t('adminNotif.form.success') });
      setForm(INIT_FORM);
      await loadHistory();
    } catch {
      setSendResult({ ok: false, msg: t('adminNotif.form.error') });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(t('adminNotif.history.confirmDelete').replace('{{title}}', title))) return;
    setDeletingId(id);
    try {
      await adminDeleteNotification(id);
      setHistory((prev) => prev.filter((n) => n.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('adminNotif.badge')}</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('adminNotif.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('adminNotif.description')}
        </p>

      </section>

      {/* ── Form soạn thông báo ── */}
      <section className="mt-4 rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4CAF50]">{t('adminNotif.form.title')}</p>

        <form onSubmit={handleSend} className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* Tiêu đề */}
          <div className="lg:col-span-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-200" htmlFor="notif-title">
              {t('adminNotif.form.notifTitle')}
            </label>
            <input
              id="notif-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={t('adminNotif.form.notifTitlePlaceholder')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              maxLength={120}
            />
          </div>

          {/* Nội dung */}
          <div className="lg:col-span-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-200" htmlFor="notif-body">
              {t('adminNotif.form.body')}
            </label>
            <textarea
              id="notif-body"
              rows={4}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder={t('adminNotif.form.bodyPlaceholder')}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              maxLength={500}
            />
          </div>

          {/* Loại */}
          <div>
            <label className="text-sm font-black text-slate-700 dark:text-slate-200" htmlFor="notif-type">
              {t('adminNotif.form.type')}
            </label>
            <select
              id="notif-type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{t(`adminNotif.type.${opt}`)}</option>
              ))}
            </select>
          </div>

          {/* Target */}
          <div>
            <p className="text-sm font-black text-slate-700 dark:text-slate-200 mb-2">{t('adminNotif.form.target')}</p>
            <div className="flex gap-4">
              {['all', 'specific'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="notif-target"
                    value={opt}
                    checked={form.targetType === opt}
                    onChange={() => setForm((f) => ({ ...f, targetType: opt, userId: '' }))}
                    className="accent-[#4CAF50]"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {t(`adminNotif.form.target${opt === 'all' ? 'All' : 'Specific'}`)}
                  </span>
                </label>
              ))}
            </div>

            {form.targetType === 'specific' && (
              <div className="mt-3">
                <label className="text-sm font-black text-slate-700 dark:text-slate-200" htmlFor="notif-userid">
                  {t('adminNotif.form.userId')}
                </label>
                <input
                  id="notif-userid"
                  type="text"
                  value={form.userId}
                  onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                  placeholder={t('adminNotif.form.userIdPlaceholder')}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="lg:col-span-2 flex items-center gap-4 flex-wrap">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 rounded-2xl bg-[#4CAF50] px-6 py-3 text-sm font-black text-white transition hover:bg-[#3f9f42] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
              {sending ? t('adminNotif.form.sending') : t('adminNotif.form.send')}
            </button>

            {sendResult && (
              <p className={`text-sm font-bold ${sendResult.ok ? 'text-[#4CAF50]' : 'text-rose-600'}`}>
                {sendResult.msg}
              </p>
            )}
          </div>
        </form>
      </section>

      {/* ── Lịch sử đã gửi ── */}
      <section className="mt-4 rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4CAF50]">{t('adminNotif.history.title')}</p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          {historyLoading ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('adminNotif.history.loading')}</p>
          ) : history.length === 0 ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('adminNotif.history.empty')}</p>
          ) : (
            history.map((notif) => {
              const cfg = typeBg[notif.type] || typeBg.announcement;
              const icon = typeIcon[notif.type] || 'campaign';
              return (
                <div key={notif.id} className="flex gap-4 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800 sm:items-start">
                  <div className={`mt-0.5 flex-shrink-0 size-9 rounded-xl flex items-center justify-center ${cfg}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{notif.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.body}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${cfg}`}>
                        {t(`adminNotif.type.${notif.type}`)}
                      </span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-black text-slate-500">
                        {notif.targetType === 'all' ? t('adminNotif.history.targetAll') : t('adminNotif.history.targetSpecific')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">{timeStr(notif.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(notif.id, notif.title)}
                    disabled={deletingId === notif.id}
                    className="flex-shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-black text-slate-500 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-40 dark:border-slate-700"
                  >
                    {deletingId === notif.id ? t('adminNotif.history.deleting') : t('adminNotif.history.delete')}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminNotifications;
