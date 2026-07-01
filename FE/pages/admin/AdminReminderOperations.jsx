import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useI18n } from '../../i18n/I18nContext';
import { getAdminReminders, getReminderOpsSummary, disableReminder, enableReminder } from '../../services/adminOperationsApi';
import ReasonModal from '../../components/admin/ReasonModal';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));
const formatDate = (value) => {
  if (!value) return 'N/A';
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
};

const riskClass = {
  normal: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

const statusClass = {
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  'never-sent': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const Badge = ({ value, map = statusClass }) => {
  const { t } = useI18n();
  let displayValue = t('common.nA');
  if (value) {
    displayValue = t(`status.${value}`);
    if (displayValue === `status.${value}`) displayValue = t(`risk.${value}`);
    if (displayValue === `risk.${value}`) displayValue = t(`admin.reminderOperations.filters.${value}`);
    if (displayValue === `admin.reminderOperations.filters.${value}`) displayValue = value;
    if (value === 'never-sent') displayValue = t('admin.reminderOperations.filters.emailNeverSent');
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${map[value] || map.normal || statusClass['never-sent']}`}>
      {displayValue}
    </span>
  );
};

const emailPreferenceClass = {
  suppressed: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  off: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const EmailPreferenceBadge = ({ preference }) => {
  const { t } = useI18n();
  if (preference?.emailEnabled === false) {
    return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${emailPreferenceClass.off}`}>{t('admin.reminderOperations.badge.globalEmailOff')}</span>;
  }
  if (preference?.reminderEmailEnabled === false) {
    return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${emailPreferenceClass.suppressed}`}>{t('admin.reminderOperations.badge.emailSuppressed')}</span>;
  }
  return null;
};
const MetricCard = ({ label, value, note, icon }) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{formatNumber(value)}</p>
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
        {[...Array(6)].map((__, cell) => (
          <div key={cell} className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    ))}
  </div>
);

const AdminReminderOperations = () => {
  const { t } = useI18n();
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', careType: '', status: '', isActive: '', dueBucket: '', emailStatus: '', riskLevel: '', sort: 'dueat_asc' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const query = useMemo(() => ({
    ...filters,
    isActive: filters.isActive === '' ? undefined : filters.isActive === 'true',
    page: pagination.page,
    limit: pagination.limit,
  }), [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [summaryData, listData] = await Promise.all([getReminderOpsSummary(), getAdminReminders(query)]);
        if (!active) return;
        setSummary(summaryData);
        setRows(listData.items || []);
        setPagination(listData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } catch (err) {
        if (active) {
          setRows([]);
          setError(err?.message || t('admin.reminderOperations.loadError'));
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
    setFilters({ search: '', careType: '', status: '', isActive: '', dueBucket: '', emailStatus: '', riskLevel: '', sort: 'dueat_asc' });
  };

  const handleAction = (row) => {
    const isDisabling = row.isActive;
    setModalConfig({
      reminderId: row.id,
      title: isDisabling ? t('admin.reminderOperations.confirm.disableTitle') : t('admin.reminderOperations.confirm.enableTitle'),
      targetSummary: t('admin.reminderOperations.targetSummary', { title: row.title, plantName: row.plantName, userEmail: row.userEmail }),
      effectSummary: isDisabling 
        ? t('admin.reminderOperations.confirm.disableEffect')
        : t('admin.reminderOperations.confirm.enableEffect'),
      confirmLabel: isDisabling ? t('admin.reminderOperations.confirm.disableButton') : t('admin.reminderOperations.confirm.enableButton'),
      actionType: isDisabling ? 'disable' : 'enable',
    });
    setModalError('');
    setModalOpen(true);
  };

  const submitModal = async (reason) => {
    if (!modalConfig) return;
    setModalLoading(true);
    setModalError('');
    try {
      if (modalConfig.actionType === 'disable') {
        await disableReminder(modalConfig.reminderId, reason);
      } else {
        await enableReminder(modalConfig.reminderId, reason);
      }
      
      setModalOpen(false);
      
      // Refresh current page
      const [summaryData, listData] = await Promise.all([getReminderOpsSummary(), getAdminReminders(query)]);
      setSummary(summaryData);
      setRows(listData.items || []);
    } catch (err) {
      setModalError(err?.message || t('admin.reminderOperations.error.actionFailed'));
    } finally {
      setModalLoading(false);
    }
  };

  const metrics = [
    [t('admin.reminderOperations.metrics.total'), summary?.totalReminders, t('admin.reminderOperations.metrics.totalNote'), 'event_note'],
    [t('admin.reminderOperations.metrics.active'), summary?.activeReminders, t('admin.reminderOperations.metrics.activeNote'), 'notifications_active'],
    [t('admin.reminderOperations.metrics.dueToday'), summary?.dueToday, t('admin.reminderOperations.metrics.dueTodayNote'), 'today'],
    [t('admin.reminderOperations.metrics.overdue'), summary?.overdue, t('admin.reminderOperations.metrics.overdueNote'), 'warning'],
    [t('admin.reminderOperations.metrics.disabled'), summary?.disabled, t('admin.reminderOperations.metrics.disabledNote'), 'block'],
    [t('admin.reminderOperations.metrics.watering'), summary?.watering, t('admin.reminderOperations.metrics.wateringNote'), 'water_drop'],
    [t('admin.reminderOperations.metrics.fertilizing'), summary?.fertilizing, t('admin.reminderOperations.metrics.fertilizingNote'), 'compost'],
    [t('admin.reminderOperations.metrics.pendingEmail'), summary?.pendingEmailLoadNext24h, t('admin.reminderOperations.metrics.pendingEmailNote'), 'outgoing_mail'],
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.reminderOperations.badge.operations')}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{t('admin.reminderOperations.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                {t('admin.reminderOperations.description')}
              </p>
            </div>
            <button type="button" onClick={() => setPagination((current) => ({ ...current }))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-lg">refresh</span>
              {t('common.refresh')}
            </button>
          </div>
          {summary?.criticalUsers > 0 && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {t('admin.reminderOperations.notice.criticalUsers', { count: summary.criticalUsers })}
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, note, icon]) => <MetricCard key={label} label={label} value={value} note={note} icon={icon} />)}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder={t('admin.reminderOperations.filters.searchPlaceholder')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white md:col-span-2" />
            <select value={filters.careType} onChange={(e) => updateFilter('careType', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.allCare')}</option><option value="watering">{t('admin.reminderOperations.filters.careWatering')}</option><option value="fertilizing">{t('admin.reminderOperations.filters.careFertilizing')}</option><option value="repotting">{t('admin.reminderOperations.filters.careRepotting')}</option><option value="other">{t('admin.reminderOperations.filters.careOther')}</option>
            </select>
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.allStatus')}</option><option value="pending">{t('status.pending')}</option><option value="done">{t('status.done')}</option>
            </select>
            <select value={filters.isActive} onChange={(e) => updateFilter('isActive', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.anyActive')}</option><option value="true">{t('admin.reminderOperations.filters.active')}</option><option value="false">{t('admin.reminderOperations.filters.disabled')}</option>
            </select>
            <select value={filters.dueBucket} onChange={(e) => updateFilter('dueBucket', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.anyDue')}</option><option value="today">{t('admin.reminderOperations.filters.dueToday')}</option><option value="overdue">{t('admin.reminderOperations.filters.dueOverdue')}</option><option value="next7days">{t('admin.reminderOperations.filters.dueNext7Days')}</option>
            </select>
            <select value={filters.emailStatus} onChange={(e) => updateFilter('emailStatus', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.anyEmail')}</option><option value="sent">{t('admin.reminderOperations.filters.emailSent')}</option><option value="failed">{t('admin.reminderOperations.filters.emailFailed')}</option><option value="pending">{t('admin.reminderOperations.filters.emailPending')}</option><option value="never-sent">{t('admin.reminderOperations.filters.emailNeverSent')}</option>
            </select>
            <select value={filters.riskLevel} onChange={(e) => updateFilter('riskLevel', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">{t('admin.reminderOperations.filters.anyRisk')}</option><option value="normal">{t('risk.normal')}</option><option value="warning">{t('risk.warning')}</option><option value="high">{t('risk.high')}</option><option value="critical">{t('risk.critical')}</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="dueat_asc">{t('admin.reminderOperations.filters.sortDueSoon')}</option><option value="dueat_desc">{t('admin.reminderOperations.filters.sortDueLatest')}</option><option value="risk_desc">{t('admin.reminderOperations.filters.sortRiskFirst')}</option><option value="email_desc">{t('admin.reminderOperations.filters.sortLastEmail')}</option>
            </select>
            <button type="button" onClick={clearFilters} className="rounded-2xl px-4 py-2 text-sm font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{t('common.clearFilters')}</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && <p className="m-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
          {loading ? <SkeletonRows /> : rows.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm font-black text-slate-700 dark:text-slate-200">{t('admin.reminderOperations.emptyDescription')}</p><button onClick={clearFilters} className="mt-3 text-sm font-black text-[#4CAF50]">{t('common.clearFilters')}</button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1260px] w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-950/60">
                  <tr>{[t('admin.reminderOperations.table.risk'), t('admin.reminderOperations.table.activeReminders'), t('common.user'), t('common.email'), t('common.plant'), t('common.reminder'), t('admin.reminderOperations.table.careType'), t('admin.reminderOperations.table.dueDate'), t('admin.reminderOperations.table.repeatRule'), t('common.status'), t('admin.reminderOperations.table.active'), t('admin.reminderOperations.table.emailStatus'), t('admin.reminderOperations.table.lastEmail'), t('common.actions')].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4"><Badge value={row.riskLevel} map={riskClass} /></td>
                      <td className="px-4 py-4"><span className="font-black text-slate-900 dark:text-white">{formatNumber(row.activeReminderCountForUser)}</span><p className="mt-1 text-[11px] text-slate-400">{t('admin.reminderOperations.badge.activePending')}</p></td>
                      <td className="px-4 py-4"><Link to={`/admin/users?userId=${row.userId}`} className="font-black text-slate-900 hover:text-[#4CAF50] dark:text-white">{row.userName}</Link><p className="mt-1 text-[11px] font-bold text-[#4CAF50]">{t('admin.reminderOperations.badge.viewUser')}</p></td>
                      <td className="px-4 py-4 text-slate-500"><p>{row.userEmail}</p><div className="mt-2"><EmailPreferenceBadge preference={row.emailPreference} /></div></td>
                      <td className="px-4 py-4"><span className="font-bold text-slate-700 dark:text-slate-200">{row.plantName}</span></td>
                      <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">{row.title}</td>
                      <td className="px-4 py-4 text-slate-500">{row.careType}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.dueAt)}</td>
                      <td className="px-4 py-4 text-slate-500">{row.repeatRule || t('admin.reminderOperations.badge.none')}</td>
                      <td className="px-4 py-4"><Badge value={row.status} /></td>
                      <td className="px-4 py-4"><Badge value={row.isActive ? 'active' : 'disabled'} map={{ active: statusClass.sent, disabled: statusClass['never-sent'] }} /></td>
                      <td className="px-4 py-4"><Badge value={row.lastEmailStatus} /><p className="mt-1 text-[11px] text-slate-400">{t('admin.reminderOperations.badge.sentCount', { count: row.emailSendCount })}</p></td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.lastEmailSentAt)}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleAction(row)}
                          disabled={modalLoading}
                          className="rounded-xl border border-slate-200 px-3 py-1 text-[11px] font-black uppercase text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {row.isActive ? t('admin.reminderOperations.action.disable') : t('admin.reminderOperations.action.enable')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('admin.reminderOperations.pagination.info', { total: formatNumber(pagination.total), page: pagination.page, totalPages: pagination.totalPages || 1 })}</span>
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
        onConfirm={submitModal}
        title={modalConfig?.title}
        targetSummary={modalConfig?.targetSummary}
        effectSummary={modalConfig?.effectSummary}
        confirmLabel={modalConfig?.confirmLabel}
        loading={modalLoading}
        error={modalError}
      />
    </AdminLayout>
  );
};

export default AdminReminderOperations;
