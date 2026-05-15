import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const statusCards = [
  { label: 'Users', value: 'Ready shell', icon: 'group', note: 'List/search connects in Phase 2.' },
  { label: 'User plants', value: 'Ready shell', icon: 'potted_plant', note: 'Review/status tools deferred.' },
  { label: 'Marketplace', value: 'Simple contact', icon: 'storefront', note: 'Price + Zalo/Facebook only.' },
  { label: 'AI Chat', value: 'Mock fallback', icon: 'smart_toy', note: 'Plant-context dialog later.' },
];

const AdminOverview = () => (
  <AdminLayout>
    <div className="space-y-5">
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Overview</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Admin MVP status</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Phase 1 keeps admin intentional and lightweight: route shell, clear sections, and guardrails. Charts, analytics, and enterprise dashboard widgets are intentionally deferred.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => (
          <article key={card.label} className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-2xl bg-[#4CAF50]/10 p-3 text-[#4CAF50]">
                <span className="material-symbols-outlined">{card.icon}</span>
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-400">Phase 1</span>
            </div>
            <h2 className="mt-4 text-sm font-black uppercase tracking-widest text-slate-400">{card.label}</h2>
            <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">{card.value}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{card.note}</p>
          </article>
        ))}
      </section>
    </div>
  </AdminLayout>
);

export default AdminOverview;
