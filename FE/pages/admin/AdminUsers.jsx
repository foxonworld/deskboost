import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminUsers } from '../../services/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setError(err?.message || 'Could not load users.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Users</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">User management</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Basic account list/status only. No enterprise user analytics.
        </p>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Admin users unavailable. Backend endpoint required: GET /api/admin/users.</p>}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          {loading ? (
            <p className="p-5 text-sm font-bold text-slate-400">Loading users for lightweight admin review...</p>
          ) : error ? (
            <p className="p-5 text-sm font-bold text-slate-400">User data could not be loaded from the real backend. No mock users are shown.</p>
          ) : users.length === 0 ? (
            <p className="p-5 text-sm font-bold text-slate-400">No users found yet. Admin MVP will show basic account status here.</p>
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
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminUsers;
