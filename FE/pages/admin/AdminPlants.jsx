import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminUserPlant,
  getAdminUserPlants,
  updateAdminUserPlantStatus,
} from '../../services/adminApi';

const plantStatusOptions = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'needs-water', label: 'Needs water' },
  { value: 'issue', label: 'Issue' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminUserPlants({ limit: 20 });
        if (!active) return;
        setPlants(data?.items || []);
      } catch (err) {
        if (active) {
          setPlants([]);
          setError(err?.message || 'Could not load user plants.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const openDetail = async (plantId) => {
    setDetailLoading(true);
    setDetailError('');
    setStatusNotice('');
    try {
      const data = await getAdminUserPlant(plantId);
      setSelectedPlant(data);
      setStatusValue(String(data?.status || '').toLowerCase());
    } catch (err) {
      setSelectedPlant(null);
      setDetailError(err?.message || 'Could not load user plant detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    if (!selectedPlant || !statusValue) return;
    setStatusSaving(true);
    setDetailError('');
    setStatusNotice('');
    try {
      const updated = await updateAdminUserPlantStatus(selectedPlant.id, { status: statusValue });
      const nextPlant = { ...selectedPlant, ...updated, status: updated?.status || statusValue };
      setSelectedPlant(nextPlant);
      setPlants((current) =>
        current.map((plant) =>
          plant.id === selectedPlant.id ? { ...plant, status: nextPlant.status } : plant,
        ),
      );
      setStatusNotice('User plant status updated.');
    } catch (err) {
      setDetailError(err?.message || 'Could not update user plant status.');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Plants</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">User plants</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Service-driven list for user plant care status review. Lightweight moderation only.
        </p>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Admin user plants unavailable. Backend endpoint required: GET /api/admin/user-plants.</p>}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3">
            {loading ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">Loading user plants for care status review...</p>
            ) : error ? (
              <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">User plant data could not be loaded from the real backend. No mock plants are shown.</p>
            ) : plants.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">No user plants found yet. Saved plant status will appear here.</p>
            ) : (
              plants.map((plant) => (
                <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{plant.name}</p>
                      <p className="text-xs font-semibold text-slate-400">{plant.species} - owner: {plant.userName}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">Ownership: Future</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">QR: Future</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-fit rounded-full bg-[#4CAF50]/10 px-3 py-1 text-[11px] font-black text-[#4CAF50]">{plant.status}</span>
                      <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">Future feature</span>
                      <button type="button" onClick={() => openDetail(plant.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                        Detail
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Detail/status</p>
            {detailLoading ? (
              <p className="mt-3 text-sm font-bold text-slate-400">Loading selected plant...</p>
            ) : detailError ? (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{detailError}</p>
            ) : !selectedPlant ? (
              <p className="mt-3 text-sm font-bold text-slate-400">Select a user plant to inspect backend detail and update status.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {statusNotice && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{statusNotice}</p>}
                <div className="space-y-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <p>Name: {selectedPlant.name || 'Unknown'}</p>
                  <p>Species: {selectedPlant.species || 'Unknown'}</p>
                  <p>Owner: {selectedPlant.userName || selectedPlant.userEmail || 'Unknown'}</p>
                  <p>Location: {selectedPlant.location || 'Not set'}</p>
                  <p>Created: {selectedPlant.createdAt || 'Unknown'}</p>
                </div>
                <form onSubmit={handleStatusUpdate} className="space-y-3">
                  <label className="block space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    Status
                    <select value={statusValue} onChange={(event) => setStatusValue(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                      {plantStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                  <button type="submit" disabled={statusSaving} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
                    {statusSaving ? 'Saving...' : 'Update status'}
                  </button>
                </form>
                <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#4CAF50]" aria-hidden="true">qr_code_2</span>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">Ownership & QR</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">Future feature - backend not available yet</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ownership column</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">Backend required</p>
                    </div>
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">QR column</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">Backend required</p>
                    </div>
                  </div>
                  <button type="button" disabled className="mt-4 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-700">
                    Future feature - backend not available yet
                  </button>
                </section>
              </div>
            )}
          </aside>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminPlants;
