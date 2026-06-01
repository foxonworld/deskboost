import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const plannedEndpoints = [
  'GET /api/admin/plant-inventory',
  'GET /api/admin/plant-inventory/{id}',
  'POST /api/admin/plant-inventory',
  'PUT /api/admin/plant-inventory/{id}',
  'DELETE /api/admin/plant-inventory/{id}',
  'POST /api/admin/plant-inventory/{id}/regenerate-code',
];

const AdminPlantInventory = () => (
  <AdminLayout>
    <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Plant inventory</p>
      <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Physical plant inventory</h1>
      <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
        Future feature - backend not available yet. This page is prepared for physical plant records, claim codes, and QR readiness after the backend contract is implemented.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
        <span className="material-symbols-outlined text-5xl text-slate-300" aria-hidden="true">inventory_2</span>
        <h2 className="mt-3 text-lg font-black text-slate-900 dark:text-white">Backend required</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-6 text-slate-400">
          No mock inventory, no fake claim codes, and no generated QR codes are shown here.
        </p>
        <button type="button" disabled className="mt-5 rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white opacity-60">
          Future feature - backend not available yet
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {plannedEndpoints.map((endpoint) => (
          <div key={endpoint} className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Planned endpoint</p>
            <p className="mt-2 break-all text-sm font-black text-slate-700 dark:text-slate-200">{endpoint}</p>
          </div>
        ))}
      </div>
    </section>
  </AdminLayout>
);

export default AdminPlantInventory;
