import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminMarketplacePlants } from '../../services/adminApi';

const AdminMarketplace = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminMarketplacePlants({ limit: 20 });
        if (!active) return;
        setPlants(data?.items || []);
        setSource(data?.source || 'backend');
      } catch (err) {
        if (active) setError(err?.message || 'Could not load marketplace plants.');
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
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Marketplace</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Contact listings</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Marketplace remains display + contact only. No cart, checkout, payment, orders, or shipping.
        </p>
        {source === 'mock-fallback' && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Mock fallback active until backend endpoints are ready.</p>}
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">Loading contact-only marketplace listings...</p>
          ) : plants.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">No marketplace listings found yet. Contact-only listings will appear here.</p>
          ) : (
            plants.map((plant) => (
              <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex gap-3">
                  <img src={plant.imageUrl} alt={plant.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">{plant.name}</p>
                    <p className="mt-1 text-sm font-black text-[#4CAF50]">{plant.priceText}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{plant.status} · contact seller only</p>
                    <p className="mt-2 truncate rounded-xl bg-[#4CAF50]/10 px-3 py-2 text-xs font-black text-[#4CAF50]">Contact CTA: {plant.contactUrl}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminMarketplace;
