import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ReasonModal from '../../components/admin/ReasonModal';
import { useI18n } from '../../i18n';
import { getEmailLogs, getEmailOpsSummary, suppressReminderEmail, unsuppressReminderEmail } from '../../services/adminOperationsApi';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));
const formatDate = (value, t) => {
  if (!value) return t('common.nA');
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
};

const statusClass = {
  sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  skipped: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const preferenceClass = {
  on: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  suppressed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  off: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const getPreferenceState = (preference) => {
  if (preference?.emailEnabled === false) return 'off';
  if (preference?.reminderEmailEnabled === false) return 'suppressed';
  return 'on';
};

const getStatusLabel = (t, value) => (value ? t(`status.${value}`) : t('common.nA'));
const getCategoryLabel = (t, value) => (value ? t(`admin.emailOperations.category.${value}`) : t('common.nA'));
const getProviderLabel = (t, value) => (value ? t(`admin.emailOperations.provider.${value}`) : t('common.nA'));

const Badge = ({ value }) => {
  const { t } = useI18n();
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${statusClass[value] || statusClass.skipped}`}>
      {getStatusLabel(t, value)}
    </span>
  );
};

const EmailPreferenceBadge = ({ preference }) => {
  const { t } = useI18n();
  const state = getPreferenceState(preference);
  const label = state === 'off' ? t('admin.emailOperations.preference.globalOff') : state === 'suppressed' ? t('admin.emailOperations.preference.reminderSuppressed') : t('admin.emailOperations.preference.reminderOn');
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${preferenceClass[state]}`}>{label}</span>;
};

const MetricCard = ({ label, value, note, icon }) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      </div>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#4CAF50]/10 text-[#4CAF50]">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </span>
    </div>
    {note && <p className="mt-3 text-xs font-bold text-slate-400">{note}</p>}
  </article>
);

const SkeletonRows = () => (
  <div className="divide-y divide-slate-100 dark:divide-slate-800">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="grid grid-cols-6 gap-4 p-4">
        {[...Array(6)].map((__, cell) => <div key={cell} className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />)}
      </div>
    ))}
  </div>
);

const todayISO = () => new Date().toISOString().slice(0, 10);

const AdminEmailOperations = () => {
  const { t } = useI18n();
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', status: '', dateFrom: '', dateTo: '', provider: '', userId: '', relatedEntityType: '', relatedEntityId: '', sort: 'created_desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const query = useMemo(() => ({ ...filters, page: pagination.page, limit: pagination.limit }), [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [summaryData, listData] = await Promise.all([getEmailOpsSummary(), getEmailLogs(query)]);
        if (!active) return;
        setSummary(summaryData);
        setRows(listData.items || []);
        setPagination(listData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } catch (err) {
        if (active) {
          setRows([]);
          setError(err?.message || t('admin.emailOperations.loadError'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [query]);

  const updateFilter = (key, value) => {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters({ search: '', category: '', status: '', dateFrom: '', dateTo: '', provider: '', userId: '', relatedEntityType: '', relatedEntityId: '', sort: 'created_desc' });
  };

  const applyPreset = (preset) => {
    setPagination((current) => ({ ...current, page: 1 }));
    if (preset === 'failedToday') setFilters((current) => ({ ...current, status: 'failed', dateFrom: todayISO(), dateTo: todayISO() }));
    if (preset === 'pending') setFilters((current) => ({ ...current, status: 'pending' }));
    if (preset === 'reminders') setFilters((current) => ({ ...current, category: 'watering_reminder', relatedEntityType: 'Reminder' }));
  };

  const handlePreferenceAction = (row) => {
    if (!row.recipientUserId) return;
    const isSuppressed = row.emailPreference?.reminderEmailEnabled === false;
    setModalConfig({
      userId: row.recipientUserId,
      actionType: isSuppressed ? 'unsuppress' : 'suppress',
      title: isSuppressed ? t('admin.emailOperations.confirm.unsuppressTitle') : t('admin.emailOperations.confirm.suppressTitle'),
      targetSummary: `${row.userName || row.recipientEmail} - ${row.recipientEmail}`,
      effectSummary: isSuppressed
        ? t('admin.emailOperations.confirm.unsuppressEffect')
        : t('admin.emailOperations.confirm.suppressEffect'),
      confirmLabel: isSuppressed ? t('admin.emailOperations.confirm.unsuppressButton') : t('admin.emailOperations.confirm.suppressButton'),
    });
    setModalError('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const submitPreferenceModal = async (reason) => {
    if (!modalConfig) return;
    setModalLoading(true);
    setModalError('');
    try {
      const updated = modalConfig.actionType === 'suppress'
        ? await suppressReminderEmail(modalConfig.userId, reason)
        : await unsuppressReminderEmail(modalConfig.userId, reason);

      setRows((current) => current.map((row) => (
        row.recipientUserId === modalConfig.userId ? { ...row, emailPreference: updated } : row
      )));
      const [summaryData, listData] = await Promise.all([getEmailOpsSummary(), getEmailLogs(query)]);
      setSummary(summaryData);
      setRows(listData.items || []);
      setPagination(listData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      setSuccessMessage(modalConfig.actionType === 'suppress' ? t('admin.emailOperations.notice.suppressed') : t('admin.emailOperations.notice.unsuppressed'));
      setModalOpen(false);
    } catch (err) {
      setModalError(err?.message || t('admin.emailOperations.error.actionFailed'));
    } finally {
      setModalLoading(false);
    }
  };

  const quotaPercent = Number(summary?.dailyQuotaPercent || 0);
  const metrics = [
    [t('admin.emailOperations.metrics.sentToday'), formatNumber(summary?.sentToday), t('admin.emailOperations.metrics.sentTodayNote'), 'mark_email_read'],
    [t('admin.emailOperations.metrics.failedToday'), formatNumber(summary?.failedToday), t('admin.emailOperations.metrics.failedTodayNote'), 'error'],
    [t('admin.emailOperations.metrics.pending'), formatNumber(summary?.pending), t('admin.emailOperations.metrics.pendingNote'), 'pending_actions'],
    [t('admin.emailOperations.metrics.skippedToday'), formatNumber(summary?.skippedToday), t('admin.emailOperations.metrics.skippedTodayNote'), 'block'],
    [t('admin.emailOperations.metrics.successRate'), `${summary?.successRate || 0}%`, t('admin.emailOperations.metrics.successRateNote'), 'monitoring'],
    [t('admin.emailOperations.metrics.topErrorCode'), summary?.topErrorCode || t('common.nA'), t('admin.emailOperations.metrics.topErrorCodeNote'), 'bug_report'],
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.emailOperations.badge')}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{t('admin.emailOperations.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                {t('admin.emailOperations.description')}
              </p>
            </div>
            <button type="button" onClick={() => setPagination((current) => ({ ...current }))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-lg">refresh</span>
              {t('common.refresh')}
            </button>
          </div>
          {successMessage && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{successMessage}</p>}
          {quotaPercent >= 70 && (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${quotaPercent >= 90 ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'}`}>
              {t('admin.emailOperations.notice.quotaWarning', { percent: quotaPercent })}
            </p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map(([label, value, note, icon]) => <MetricCard key={label} label={label} value={value} note={note} icon={icon} />)}
          </div>
          <article className="rounded-2xl border border-[#4CAF50]/20 bg-white p-5 shadow-sm dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4CAF50]">{t('admin.emailOperations.metrics.quota')}</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{quotaPercent}%</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{t('admin.emailOperations.metrics.quotaUsed', { used: formatNumber(summary?.dailyQuotaUsed), limit: formatNumber(summary?.dailyQuotaLimit || 300) })}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${Math.min(100, quotaPercent)}%` }} />
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => applyPreset('failedToday')} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{t('admin.emailOperations.filters.failedToday')}</button>
            <button onClick={() => applyPreset('pending')} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{t('admin.emailOperations.filters.stuckPending')}</button>
            <button onClick={() => applyPreset('reminders')} className="rounded-full bg-[#4CAF50]/10 px-3 py-1.5 text-xs font-black text-[#4CAF50]">{t('admin.emailOperations.filters.reminderEmails')}</button>
          </div>
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder={t('admin.emailOperations.filters.searchPlaceholder')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white md:col-span-2" />
            <input value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} placeholder={t('admin.emailOperations.filters.category')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.emailOperations.filters.allStatus')}</option><option value="sent">{t('status.sent')}</option><option value="failed">{t('status.failed')}</option><option value="pending">{t('status.pending')}</option><option value="skipped">{t('status.skipped')}</option>
            </select>
            <input value={filters.provider} onChange={(e) => updateFilter('provider', e.target.value)} placeholder={t('admin.emailOperations.filters.provider')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input type="date" value={filters.dateFrom} onChange={(e) => updateFilter('dateFrom', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input type="date" value={filters.dateTo} onChange={(e) => updateFilter('dateTo', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input value={filters.relatedEntityType} onChange={(e) => updateFilter('relatedEntityType', e.target.value)} placeholder={t('admin.emailOperations.filters.relatedType')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <input value={filters.userId} onChange={(e) => updateFilter('userId', e.target.value)} placeholder={t('admin.emailOperations.filters.userId')} className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input value={filters.relatedEntityId} onChange={(e) => updateFilter('relatedEntityId', e.target.value)} placeholder={t('admin.emailOperations.filters.relatedEntityId')} className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <button type="button" onClick={clearFilters} className="rounded-2xl px-4 py-2 text-sm font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{t('common.clearFilters')}</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && <p className="m-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
          {loading ? <SkeletonRows /> : rows.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm font-black text-slate-700 dark:text-slate-200">{t('admin.emailOperations.emptyDescription')}</p><button onClick={clearFilters} className="mt-3 text-sm font-black text-[#4CAF50]">{t('common.clearFilters')}</button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1240px] w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-950/60">
                  <tr>{[t('common.status'), t('admin.emailOperations.table.recipient'), t('admin.emailOperations.table.category'), t('admin.emailOperations.table.subject'), t('admin.emailOperations.table.provider'), t('admin.emailOperations.table.sentAt'), t('common.createdAt'), t('common.error'), t('admin.emailOperations.table.relatedEntity'), t('common.actions')].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4"><Badge value={row.status} /></td>
                      <td className="px-4 py-4">
                        <p className="font-black text-slate-900 dark:text-white">{row.recipientEmail}</p>
                        <p className="mt-1 text-xs text-slate-400">{row.userName || row.recipientUserId || t('admin.emailOperations.table.noUserLink')}</p>
                        {row.recipientUserId && <div className="mt-2"><EmailPreferenceBadge preference={row.emailPreference} /></div>}
                      </td>
                      <td className="px-4 py-4 text-slate-500">{getCategoryLabel(t, row.category)}</td>
                      <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">{row.subject}</td>
                      <td className="px-4 py-4 text-slate-500">{getProviderLabel(t, row.provider)}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.sentAt, t)}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.createdAt, t)}</td>
                      <td className="px-4 py-4"><p className="font-bold text-rose-600 dark:text-rose-300">{row.errorCode || t('common.nA')}</p>{row.errorMessage && <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{row.errorMessage}</p>}</td>
                      <td className="px-4 py-4 text-slate-500"><p>{row.relatedEntityType || t('common.nA')}</p><p className="mt-1 text-[11px]">{row.relatedEntityId || ''}</p></td>
                      <td className="px-4 py-4">
                        {row.recipientUserId ? (
                          <button
                            type="button"
                            onClick={() => handlePreferenceAction(row)}
                            disabled={modalLoading}
                            className="rounded-xl border border-slate-200 px-3 py-1 text-[11px] font-black uppercase text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            {row.emailPreference?.reminderEmailEnabled === false ? t('admin.emailOperations.action.unsuppress') : t('admin.emailOperations.action.suppress')}
                          </button>
                        ) : (
                          <span title={t('admin.emailOperations.table.noLinkedUser')} className="text-xs font-bold text-slate-400">{t('admin.emailOperations.table.noAction')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('admin.emailOperations.pagination.info', { total: formatNumber(pagination.total), page: pagination.page, totalPages: pagination.totalPages || 1 })}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1 || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">{t('common.previous')}</button>
              <button disabled={pagination.page >= pagination.totalPages || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">{t('common.next')}</button>
            </div>
          </div>
        </section>
      </div>

      <ReasonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={submitPreferenceModal}
        title={modalConfig?.title}
        targetSummary={modalConfig?.targetSummary}
        effectSummary={modalConfig?.effectSummary}
        confirmLabel={modalConfig?.confirmLabel || t('common.confirm')}
        loading={modalLoading}
        error={modalError}
      />
    </AdminLayout>
  );
};

export default AdminEmailOperations;
