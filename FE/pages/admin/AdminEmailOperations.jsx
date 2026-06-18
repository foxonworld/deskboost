import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ReasonModal from '../../components/admin/ReasonModal';
import { getEmailLogs, getEmailOpsSummary, suppressReminderEmail, unsuppressReminderEmail } from '../../services/adminOperationsApi';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));
const formatDate = (value) => {
  if (!value) return 'N/A';
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

const Badge = ({ value }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${statusClass[value] || statusClass.skipped}`}>
    {value || 'N/A'}
  </span>
);

const EmailPreferenceBadge = ({ preference }) => {
  const state = getPreferenceState(preference);
  const label = state === 'off' ? 'Global email off' : state === 'suppressed' ? 'Reminder email suppressed' : 'Reminder email on';
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
          setError(err?.message || 'Could not load email operations.');
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
      title: isSuppressed ? 'Allow reminder email for user?' : 'Suppress reminder email for user?',
      targetSummary: `${row.userName || row.recipientEmail} - ${row.recipientEmail}`,
      effectSummary: isSuppressed
        ? 'Reminder emails can be sent again if global email and worker settings are enabled.'
        : 'Reminders stay active in the app. Only reminder emails are stopped.',
      confirmLabel: isSuppressed ? 'Allow reminder email' : 'Suppress reminder email',
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
      setSuccessMessage(modalConfig.actionType === 'suppress' ? 'Reminder email suppressed.' : 'Reminder email allowed.');
      setModalOpen(false);
    } catch (err) {
      setModalError(err?.message || 'Action failed.');
    } finally {
      setModalLoading(false);
    }
  };

  const quotaPercent = Number(summary?.dailyQuotaPercent || 0);
  const metrics = [
    ['Sent today', formatNumber(summary?.sentToday), 'Counts local sent logs', 'mark_email_read'],
    ['Failed today', formatNumber(summary?.failedToday), 'Created today', 'error'],
    ['Pending', formatNumber(summary?.pending), 'All pending logs', 'pending_actions'],
    ['Skipped today', formatNumber(summary?.skippedToday), 'If skipped logs exist', 'block'],
    ['Success rate', `${summary?.successRate || 0}%`, 'Sent / sent + failed', 'monitoring'],
    ['Top error code', summary?.topErrorCode || 'None', 'Failed today', 'bug_report'],
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Operations</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Email Operations</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                Delivery health, local quota estimate, sanitized failure visibility, and per-user reminder email governance.
              </p>
            </div>
            <button type="button" onClick={() => setPagination((current) => ({ ...current }))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>
          {successMessage && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{successMessage}</p>}
          {quotaPercent >= 70 && (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${quotaPercent >= 90 ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'}`}>
              Local daily quota estimate is at {quotaPercent}%.
            </p>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map(([label, value, note, icon]) => <MetricCard key={label} label={label} value={value} note={note} icon={icon} />)}
          </div>
          <article className="rounded-2xl border border-[#4CAF50]/20 bg-white p-5 shadow-sm dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4CAF50]">Quota</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{quotaPercent}%</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{formatNumber(summary?.dailyQuotaUsed)} / {formatNumber(summary?.dailyQuotaLimit || 300)} used today</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-[#4CAF50]" style={{ width: `${Math.min(100, quotaPercent)}%` }} />
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => applyPreset('failedToday')} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">Failed today</button>
            <button onClick={() => applyPreset('pending')} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Stuck pending</button>
            <button onClick={() => applyPreset('reminders')} className="rounded-full bg-[#4CAF50]/10 px-3 py-1.5 text-xs font-black text-[#4CAF50]">Reminder emails</button>
          </div>
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search recipient, subject, error..." className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white md:col-span-2" />
            <input value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} placeholder="Category" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">All status</option><option value="sent">Sent</option><option value="failed">Failed</option><option value="pending">Pending</option><option value="skipped">Skipped</option>
            </select>
            <input value={filters.provider} onChange={(e) => updateFilter('provider', e.target.value)} placeholder="Provider" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input type="date" value={filters.dateFrom} onChange={(e) => updateFilter('dateFrom', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input type="date" value={filters.dateTo} onChange={(e) => updateFilter('dateTo', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input value={filters.relatedEntityType} onChange={(e) => updateFilter('relatedEntityType', e.target.value)} placeholder="Related type" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <input value={filters.userId} onChange={(e) => updateFilter('userId', e.target.value)} placeholder="User ID" className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <input value={filters.relatedEntityId} onChange={(e) => updateFilter('relatedEntityId', e.target.value)} placeholder="Related entity ID" className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <button type="button" onClick={clearFilters} className="rounded-2xl px-4 py-2 text-sm font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Clear filters</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && <p className="m-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
          {loading ? <SkeletonRows /> : rows.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm font-black text-slate-700 dark:text-slate-200">No email logs match these filters.</p><button onClick={clearFilters} className="mt-3 text-sm font-black text-[#4CAF50]">Clear filters</button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1240px] w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-950/60">
                  <tr>{['Status','Recipient','Category','Subject','Provider','Sent At','Created At','Error','Related Entity','Actions'].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4"><Badge value={row.status} /></td>
                      <td className="px-4 py-4">
                        <p className="font-black text-slate-900 dark:text-white">{row.recipientEmail}</p>
                        <p className="mt-1 text-xs text-slate-400">{row.userName || row.recipientUserId || 'No user link'}</p>
                        {row.recipientUserId && <div className="mt-2"><EmailPreferenceBadge preference={row.emailPreference} /></div>}
                      </td>
                      <td className="px-4 py-4 text-slate-500">{row.category}</td>
                      <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">{row.subject}</td>
                      <td className="px-4 py-4 text-slate-500">{row.provider || 'N/A'}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.sentAt)}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-4"><p className="font-bold text-rose-600 dark:text-rose-300">{row.errorCode || 'None'}</p>{row.errorMessage && <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{row.errorMessage}</p>}</td>
                      <td className="px-4 py-4 text-slate-500"><p>{row.relatedEntityType || 'N/A'}</p><p className="mt-1 text-[11px]">{row.relatedEntityId || ''}</p></td>
                      <td className="px-4 py-4">
                        {row.recipientUserId ? (
                          <button
                            type="button"
                            onClick={() => handlePreferenceAction(row)}
                            disabled={modalLoading}
                            className="rounded-xl border border-slate-200 px-3 py-1 text-[11px] font-black uppercase text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            {row.emailPreference?.reminderEmailEnabled === false ? 'Unsuppress' : 'Suppress'}
                          </button>
                        ) : (
                          <span title="No linked user." className="text-xs font-bold text-slate-400">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{formatNumber(pagination.total)} logs, page {pagination.page} / {pagination.totalPages || 1}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1 || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">Previous</button>
              <button disabled={pagination.page >= pagination.totalPages || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">Next</button>
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
        confirmLabel={modalConfig?.confirmLabel || 'Confirm'}
        loading={modalLoading}
        error={modalError}
      />
    </AdminLayout>
  );
};

export default AdminEmailOperations;
