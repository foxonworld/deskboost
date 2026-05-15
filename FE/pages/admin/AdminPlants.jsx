import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminPlants = () => (
  <AdminLayout>
    <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Plants</p>
      <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">User plants</h1>
      <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
        Intentional Phase 1 placeholder for reviewing user plant profiles and care status after APIs are ready.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-5">
        <p className="text-sm font-black text-slate-900 dark:text-white">Phase 2 scope</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">Show user plants, health status, and simple review actions. Keep moderation lightweight.</p>
      </div>
    </section>
  </AdminLayout>
);

export default AdminPlants;
