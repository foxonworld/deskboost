import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminOverview = () => (
  <AdminLayout>
    <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Overview</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
        Phase 1 shell only. Backend stats, charts, analytics, and advanced controls are intentionally deferred.
      </p>
    </section>
  </AdminLayout>
);

export default AdminOverview;
