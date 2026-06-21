import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getAdminUser, getAdminUsers, updateAdminUserStatus, updateAdminUser, deleteAdminUser } from '../../services/adminApi';
import { adminSendNotification } from '../../services/notificationApi';
import { useI18n } from '../../i18n';

const statusOptions = [
  { value: 'active', labelKey: 'admin.status.active' },
  { value: 'inactive', labelKey: 'admin.status.inactive' },
  { value: 'banned', labelKey: 'admin.status.banned' },
];

const TYPE_OPTIONS = ['announcement', 'promo', 'care_tip'];

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
  const [editForm, setEditForm] = useState({ name: '', role: '', status: '' });
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [quickSendForm, setQuickSendForm] = useState({ title: '', body: '', type: 'announcement' });
  const [quickSending, setQuickSending] = useState(false);
  const [quickSendResult, setQuickSendResult] = useState(null);
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
    setQuickSendResult(null);
    try {
      const data = await getAdminUser(userId);
      setSelectedUser(data);
      setStatusValue(data.status || 'active');
      setEditForm({ name: data.name || '', role: data.role || 'user', status: data.status || 'active' });
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

  const handleUpdateUser = async () => {
    if (!selectedUser?.id) return;
    setSavingUser(true);
    setStatusError('');
    try {
      const updated = await updateAdminUser(selectedUser.id, editForm);
      setSelectedUser(updated);
      setUsers((current) => current.map((user) => (user.id === updated.id ? { ...user, ...updated } : user)));
      setStatusError('Cập nhật thành công!');
      setTimeout(() => setStatusError(''), 3000);
    } catch (err) {
      setStatusError(err?.message || 'Lỗi cập nhật người dùng');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id || !window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    setDeletingUser(true);
    try {
      await deleteAdminUser(selectedUser.id);
      setUsers((current) => current.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
    } catch (err) {
      setStatusError(err?.message || 'Lỗi xóa người dùng');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleQuickSend = async (e) => {
    e.preventDefault();
    if (!quickSendForm.title.trim() || !quickSendForm.body.trim()) {
      setQuickSendResult({ ok: false, msg: t('adminNotif.form.errorRequired') });
      return;
    }
    setQuickSending(true);
    setQuickSendResult(null);
    try {
      await adminSendNotification({
        title: quickSendForm.title.trim(),
        body: quickSendForm.body.trim(),
        type: quickSendForm.type,
        targetType: 'specific',
        targetUserIds: [selectedUser.id],
      });
      setQuickSendResult({ ok: true, msg: t('adminNotif.quickSend.success') });
      setQuickSendForm({ title: '', body: '', type: 'announcement' });
    } catch {
      setQuickSendResult({ ok: false, msg: t('adminNotif.quickSend.error') });
    } finally {
      setQuickSending(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.users.badge')}</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.users.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.users.description')}
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
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
                      try {
                        await deleteAdminUser(user.id);
                        setUsers((current) => current.filter((u) => u.id !== user.id));
                      } catch (err) {
                        alert(err?.message || 'Lỗi xóa người dùng');
                      }
                    }}
                    className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-black text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {(detailLoading || detailError || selectedUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-6 shadow-2xl dark:border-white/10 dark:bg-[#111813]/90 sm:p-8">
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
                  setQuickSendResult(null);
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
              <div className="mt-5 grid gap-5">
                {/* Row 1: thông tin user + cập nhật trạng thái */}
                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  {/* Thông tin user */}
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

                  {/* Cập nhật người dùng */}
                  <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200 mb-4">Chỉnh sửa Tài khoản</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Họ và Tên</label>
                        <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Vai trò (Role)</label>
                        <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Trạng thái (Status)</label>
                        <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {statusError && <p className={`mt-3 text-sm font-bold ${statusError.includes('thành công') ? 'text-[#4CAF50]' : 'text-rose-600'}`}>{statusError}</p>}

                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={handleUpdateUser} disabled={savingUser} className="flex-1 rounded-xl bg-[#4CAF50] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#3f9f42] disabled:opacity-50">
                        {savingUser ? t('common.saving') : 'Lưu thay đổi'}
                      </button>
                      <button type="button" onClick={handleDeleteUser} disabled={deletingUser} className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-black text-rose-600 transition hover:bg-rose-100 disabled:opacity-50">
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 2: Form gửi thông báo riêng */}
                <div className="rounded-2xl border border-[#4CAF50]/20 bg-[#4CAF50]/5 p-5 dark:border-[#4CAF50]/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#4CAF50]" style={{ fontSize: '18px' }}>campaign</span>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{t('adminNotif.quickSend.title')}</p>
                  </div>
                  <form onSubmit={handleQuickSend} className="grid gap-3">
                    <input
                      type="text"
                      value={quickSendForm.title}
                      onChange={(e) => setQuickSendForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder={t('adminNotif.form.notifTitlePlaceholder')}
                      maxLength={120}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                    <textarea
                      rows={3}
                      value={quickSendForm.body}
                      onChange={(e) => setQuickSendForm((f) => ({ ...f, body: e.target.value }))}
                      placeholder={t('adminNotif.form.bodyPlaceholder')}
                      maxLength={500}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                    <select
                      value={quickSendForm.type}
                      onChange={(e) => setQuickSendForm((f) => ({ ...f, type: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{t(`adminNotif.type.${opt}`)}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={quickSending}
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#4CAF50] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#3f9f42] disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                      {quickSending ? t('adminNotif.quickSend.sending') : t('adminNotif.quickSend.send')}
                    </button>
                    {quickSendResult && (
                      <p className={`text-xs font-bold ${quickSendResult.ok ? 'text-[#4CAF50]' : 'text-rose-600'}`}>
                        {quickSendResult.msg}
                      </p>
                    )}
                  </form>
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
