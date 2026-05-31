import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminMarketplacePlants } from '../../services/adminApi';

const AdminMarketplace = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    customerAlias: 'Customer from HCMC',
    rating: '5',
    comment: '',
    catalogPlantId: '',
    purchaseChannel: 'zalo',
    evidenceNote: '',
  });
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);

  const updateFeedbackField = (event) => {
    const { name, value } = event.target;
    setFeedbackForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateFeedback = async (event) => {
    event.preventDefault();
    setFeedbackStatus('');
    setFeedbackError('');
    setFeedbackError('Backend blocker: no admin verified-feedback endpoint exists yet, so DeskBoost will not save manual reviews as mock data.');
    setFeedbackSaving(false);
  };

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

      <section className="mt-6 rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Manually verified feedback</p>
        <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Add feedback from social/manual sale</h2>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Backend blocker: this screen is held as architecture readiness only until an admin verified-feedback endpoint is available. No mock reviews are saved or published from here.
        </p>
        {feedbackStatus && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{feedbackStatus}</p>}
        {feedbackError && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{feedbackError}</p>}

        <form onSubmit={handleCreateFeedback} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Customer alias
            <input name="customerAlias" value={feedbackForm.customerAlias} onChange={updateFeedbackField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Plant
            <select name="catalogPlantId" value={feedbackForm.catalogPlantId} onChange={updateFeedbackField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">No plant selected</option>
              {plants.map((plant) => <option key={plant.id} value={plant.id}>{plant.name}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Rating
            <select name="rating" value={feedbackForm.rating} onChange={updateFeedbackField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Channel
            <select name="purchaseChannel" value={feedbackForm.purchaseChannel} onChange={updateFeedbackField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="zalo">Bought via Zalo</option>
              <option value="facebook">Facebook</option>
              <option value="manual">Manual</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Public comment
            <textarea name="comment" value={feedbackForm.comment} onChange={updateFeedbackField} required rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="Short real customer quote" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Private evidence note
            <textarea name="evidenceNote" value={feedbackForm.evidenceNote} onChange={updateFeedbackField} required rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="Private note, e.g. Bought via Zalo chat on May 14" />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={feedbackSaving} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {feedbackSaving ? 'Saving...' : 'Check backend readiness'}
            </button>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">Blocked until API exists</span>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
};

export default AdminMarketplace;
