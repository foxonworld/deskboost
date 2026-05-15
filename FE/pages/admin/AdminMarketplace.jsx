import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminMarketplace = () => (
  <AdminLayout>
    <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Marketplace</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Catalog listings</h1>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Skeleton only: price + Zalo/Facebook contact listings remain simple. No cart/checkout/payment.</p>
    </section>
  </AdminLayout>
);

export default AdminMarketplace;
