import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminUsers } from '../../services/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminUsers({ limit: 20 });
        if (!active) return;
        setUsers(data?.items || []);
        setSource(data?.source || 'backend');
      } catch (err) {
        if (active) setError(err?.message || 'Could not load users.');
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
        {source === 'mock-fallback' && <p className="mt-4 text-xs font-bold text-amber-600">Mock fallback active.</p>}
        {error && <p className="mt-4 text-sm font-bold text-red-500">{error}</p>}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          {loading ? (
            <p className="p-5 text-sm font-bold text-slate-400">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="p-5 text-sm font-bold text-slate-400">No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex flex-col gap-2 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs font-semibold text-slate-400">{user.email}</p>
                </div>
                <div className="flex gap-2">
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
