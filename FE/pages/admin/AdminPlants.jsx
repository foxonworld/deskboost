import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminPlants = () => (
  <AdminLayout>
    <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Plants</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">User plants</h1>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Skeleton only: user plant review/status moderation is Phase 2.</p>
    </section>
  </AdminLayout>
);

export default AdminPlants;
