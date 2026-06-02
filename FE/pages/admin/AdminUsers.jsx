import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getAdminUser, getAdminUsers, updateAdminUserStatus } from '../../services/adminApi';
import { useI18n } from '../../i18n';

const statusOptions = [
  { value: 'active', labelKey: 'admin.status.active' },
  { value: 'inactive', labelKey: 'admin.status.inactive' },
  { value: 'banned', labelKey: 'admin.status.banned' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [statusValue, setStatusValue] = useState('active');
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const linkedUserId = searchParams.get('userId');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminUsers({ limit: 20 });
        if (!active) return;
        setUsers(data?.items || []);
      } catch (err) {
        if (active) {
          setUsers([]);
          setError(err?.message || t('admin.users.error.load'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [t]);

  const openDetail = async (userId) => {
    setDetailLoading(true);
    setDetailError('');
    setStatusError('');
    try {
      const data = await getAdminUser(userId);
      setSelectedUser(data);
      setStatusValue(data.status || 'active');
    } catch (err) {
      setDetailError(err?.message || t('admin.users.error.detail'));
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!linkedUserId) return;
    openDetail(linkedUserId);
  }, [linkedUserId]);

  const handleStatusUpdate = async () => {
    if (!selectedUser?.id) return;
    setSavingStatus(true);
    setStatusError('');
    try {
      const updated = await updateAdminUserStatus(selectedUser.id, { status: statusValue });
      setSelectedUser(updated);
      setStatusValue(updated.status || statusValue);
      setUsers((current) =>
        current.map((user) => (user.id === updated.id ? { ...user, ...updated } : user)),
      );
    } catch (err) {
      setStatusError(err?.message || t('admin.users.error.status'));
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.users.badge')}</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.users.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.users.description')}
        </p>
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          {t('admin.users.backendNote')}
        </p>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{t('admin.users.backendUnavailable')}</p>}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          {loading ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('admin.users.loading')}</p>
          ) : error ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('admin.users.emptyBackend')}</p>
          ) : users.length === 0 ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('admin.users.empty')}</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex flex-col gap-2 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs font-semibold text-slate-400">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500 dark:bg-slate-800">{user.role}</span>
                  <span className="rounded-full bg-[#4CAF50]/10 px-3 py-1 text-[11px] font-black text-[#4CAF50]">{user.status}</span>
                  <button
                    type="button"
                    onClick={() => openDetail(user.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300"
                  >
                    {t('admin.users.viewDetail')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {(detailLoading || detailError || selectedUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.users.detailBadge')}</p>
                <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{t('admin.users.detailTitle')}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setDetailError('');
                  setStatusError('');
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700"
                aria-label={t('admin.users.closeDetail')}
              >
                <span className="material-symbols-rounded text-xl">close</span>
              </button>
            </div>

            {detailLoading ? (
              <p className="mt-5 text-sm font-bold text-slate-400">{t('admin.users.detailLoading')}</p>
            ) : detailError ? (
              <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{detailError}</p>
            ) : (
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-lg font-black text-slate-500 dark:bg-slate-800">
                        {(selectedUser.name || selectedUser.email || '?').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{selectedUser.name || t('admin.users.unnamed')}</p>
                      <p className="text-sm font-semibold text-slate-500">{selectedUser.email}</p>
                    </div>
                  </div>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-black text-slate-400">{t('admin.users.role')}</dt>
                      <dd className="mt-1 font-bold text-slate-700 dark:text-slate-200">{selectedUser.role || t('common.nA')}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-400">{t('admin.field.status')}</dt>
                      <dd className="mt-1 font-bold text-slate-700 dark:text-slate-200">{selectedUser.status || t('common.nA')}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-400">{t('admin.users.phone')}</dt>
                      <dd className="mt-1 font-bold text-slate-700 dark:text-slate-200">{selectedUser.phone || t('common.nA')}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-400">{t('admin.users.created')}</dt>
                      <dd className="mt-1 font-bold text-slate-700 dark:text-slate-200">{selectedUser.createdAt || t('common.nA')}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
                  <label className="text-sm font-black text-slate-700 dark:text-slate-200" htmlFor="admin-user-status">{t('admin.field.status')}</label>
                  <select
                    id="admin-user-status"
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                    ))}
                  </select>
                  {statusError && <p className="mt-3 text-sm font-bold text-rose-600">{statusError}</p>}
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={savingStatus || statusValue === selectedUser.status}
                    className="mt-4 rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white transition hover:bg-[#3f9f42] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingStatus ? t('common.saving') : t('admin.users.updateStatus')}
                  </button>
                  <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    {t('admin.users.actionNote')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
