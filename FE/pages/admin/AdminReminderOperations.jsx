import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getAdminReminders, getReminderOpsSummary } from '../../services/adminOperationsApi';

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

const Badge = ({ value, map = statusClass }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${map[value] || map.normal || statusClass['never-sent']}`}>
    {value || 'N/A'}
  </span>
);

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
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', careType: '', status: '', isActive: '', dueBucket: '', emailStatus: '', riskLevel: '', sort: 'dueat_asc' });

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
          setError(err?.message || 'Could not load reminder operations.');
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

  const metrics = [
    ['Total reminders', summary?.totalReminders, 'All reminder records', 'event_note'],
    ['Active reminders', summary?.activeReminders, 'Enabled schedules', 'notifications_active'],
    ['Due today', summary?.dueToday, 'UTC day window', 'today'],
    ['Overdue', summary?.overdue, 'Active pending past due', 'warning'],
    ['Disabled', summary?.disabled, 'Inactive reminders', 'block'],
    ['Watering', summary?.watering, 'Water care type', 'water_drop'],
    ['Fertilizing', summary?.fertilizing, 'Fertilizer care type', 'compost'],
    ['Pending email load', summary?.pendingEmailLoadNext24h, 'Next 24h watering emails', 'outgoing_mail'],
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Operations</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Reminder Operations</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                Read-only visibility for reminder volume, schedule risk, and reminder-email delivery state.
              </p>
            </div>
            <button type="button" onClick={() => setPagination((current) => ({ ...current }))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>
          {summary?.criticalUsers > 0 && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {summary.criticalUsers} critical user(s) have 100+ active reminders.
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, note, icon]) => <MetricCard key={label} label={label} value={value} note={note} icon={icon} />)}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search user, email, plant..." className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white md:col-span-2" />
            <select value={filters.careType} onChange={(e) => updateFilter('careType', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">All care</option><option value="watering">Watering</option><option value="fertilizing">Fertilizing</option><option value="repotting">Repotting</option><option value="other">Other</option>
            </select>
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">All status</option><option value="pending">Pending</option><option value="done">Done</option>
            </select>
            <select value={filters.isActive} onChange={(e) => updateFilter('isActive', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">Any active</option><option value="true">Active</option><option value="false">Disabled</option>
            </select>
            <select value={filters.dueBucket} onChange={(e) => updateFilter('dueBucket', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">Any due</option><option value="today">Today</option><option value="overdue">Overdue</option><option value="next7days">Next 7 days</option>
            </select>
            <select value={filters.emailStatus} onChange={(e) => updateFilter('emailStatus', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">Any email</option><option value="sent">Sent</option><option value="failed">Failed</option><option value="pending">Pending</option><option value="never-sent">Never sent</option>
            </select>
            <select value={filters.riskLevel} onChange={(e) => updateFilter('riskLevel', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">Any risk</option><option value="normal">Normal</option><option value="warning">Warning</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="dueat_asc">Due soon</option><option value="dueat_desc">Due latest</option><option value="risk_desc">Risk first</option><option value="email_desc">Last email</option>
            </select>
            <button type="button" onClick={clearFilters} className="rounded-2xl px-4 py-2 text-sm font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Clear filters</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && <p className="m-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
          {loading ? <SkeletonRows /> : rows.length === 0 ? (
            <div className="p-8 text-center"><p className="text-sm font-black text-slate-700 dark:text-slate-200">No reminders match these filters.</p><button onClick={clearFilters} className="mt-3 text-sm font-black text-[#4CAF50]">Clear filters</button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-950/60">
                  <tr>{['Risk','User','Email','Plant','Reminder','Care Type','Due Date','Repeat Rule','Status','Active','Email Status','Last Email'].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4"><Badge value={row.riskLevel} map={riskClass} /></td>
                      <td className="px-4 py-4"><Link to={`/admin/users?userId=${row.userId}`} className="font-black text-slate-900 hover:text-[#4CAF50] dark:text-white">{row.userName}</Link><p className="mt-1 text-[11px] font-bold text-[#4CAF50]">View user</p></td>
                      <td className="px-4 py-4 text-slate-500">{row.userEmail}</td>
                      <td className="px-4 py-4"><span className="font-bold text-slate-700 dark:text-slate-200">{row.plantName}</span></td>
                      <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-200">{row.title}</td>
                      <td className="px-4 py-4 text-slate-500">{row.careType}</td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.dueAt)}</td>
                      <td className="px-4 py-4 text-slate-500">{row.repeatRule || 'none'}</td>
                      <td className="px-4 py-4"><Badge value={row.status} /></td>
                      <td className="px-4 py-4"><Badge value={row.isActive ? 'active' : 'disabled'} map={{ active: statusClass.sent, disabled: statusClass['never-sent'] }} /></td>
                      <td className="px-4 py-4"><Badge value={row.lastEmailStatus} /><p className="mt-1 text-[11px] text-slate-400">{row.emailSendCount} sent</p></td>
                      <td className="px-4 py-4 text-slate-500">{formatDate(row.lastEmailSentAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm font-bold text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{formatNumber(pagination.total)} reminders, page {pagination.page} / {pagination.totalPages || 1}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1 || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">Previous</button>
              <button disabled={pagination.page >= pagination.totalPages || loading} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40 dark:border-slate-700">Next</button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminReminderOperations;
