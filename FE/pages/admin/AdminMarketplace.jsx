import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  createAdminMarketplacePlant,
  deleteAdminMarketplacePlant,
  getAdminMarketplacePlants,
  updateAdminMarketplacePlant,
} from '../../services/adminApi';
import { uploadImage } from '../../services/uploadApi';

const emptyListingForm = {
  name: '',
  description: '',
  imageUrl: '',
  priceText: '',
  careLevel: '',
  light: '',
  water: '',
  contactUrl: '',
  status: 'active',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const careLevelOptions = [
  { value: '1', label: '1 - Very easy' },
  { value: '2', label: '2 - Easy' },
  { value: '3', label: '3 - Moderate' },
  { value: '4', label: '4 - Hard' },
  { value: '5', label: '5 - Expert' },
];

const lightOptions = [
  { value: '1', label: '1 - Low light' },
  { value: '2', label: '2 - Indirect light' },
  { value: '3', label: '3 - Bright indirect' },
  { value: '4', label: '4 - Partial sun' },
  { value: '5', label: '5 - Full sun' },
];

const waterOptions = [
  { value: '1/1', label: '1/1 - Once per day' },
  { value: '1/2', label: '1/2 - Once every 2 days' },
  { value: '1/3', label: '1/3 - Once every 3 days' },
  { value: '1/5', label: '1/5 - Once every 5 days' },
  { value: '1/7', label: '1/7 - Once per week' },
  { value: '1/14', label: '1/14 - Once every 2 weeks' },
];

const AdminMarketplace = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyListingForm);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    customerAlias: 'Customer from HCMC',
    rating: '5',
    comment: '',
    catalogPlantId: '',
    purchaseChannel: 'zalo',
    evidenceNote: '',
  });
  const feedbackError = 'Backend endpoint required';

  const loadPlants = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminMarketplacePlants({ limit: 20 });
      setPlants(data?.items || []);
    } catch (err) {
      setPlants([]);
      setError(err?.message || 'Could not load marketplace plants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const updateFeedbackField = (event) => {
    const { name, value } = event.target;
    setFeedbackForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateFeedback = async (event) => {
    event.preventDefault();
  };

  const updateListingField = (event) => {
    const { name, value } = event.target;
    setFormError('');
    setNotice('');
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyListingForm);
    setEditingId('');
    setFormError('');
  };

  const startEdit = (plant) => {
    setEditingId(plant.id);
    setForm({
      name: plant.name || '',
      description: plant.description || '',
      imageUrl: plant.imageUrl || '',
      priceText: plant.priceText || '',
      careLevel: plant.careLevel || '',
      light: plant.light || '',
      water: plant.water || '',
      contactUrl: plant.contactUrl || '',
      status: String(plant.status || 'active').toLowerCase(),
    });
    setFormError('');
    setNotice('');
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    setNotice('');
    try {
      const imageUrl = await uploadImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      setNotice('Image uploaded and attached to this listing.');
    } catch (err) {
      setFormError(err?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmitListing = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      if (editingId) {
        await updateAdminMarketplacePlant(editingId, form);
        setNotice('Marketplace listing updated.');
      } else {
        await createAdminMarketplacePlant(form);
        setNotice('Marketplace listing created.');
      }
      setForm(emptyListingForm);
      setEditingId('');
      await loadPlants();
    } catch (err) {
      setFormError(err?.message || 'Could not save marketplace listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (plant) => {
    if (!window.confirm(`Delete marketplace listing "${plant.name}"?`)) return;
    setDeletingId(plant.id);
    setFormError('');
    setNotice('');
    try {
      await deleteAdminMarketplacePlant(plant.id);
      setPlants((current) => current.filter((item) => item.id !== plant.id));
      if (editingId === plant.id) resetForm();
      setNotice('Marketplace listing deleted.');
    } catch (err) {
      setFormError(err?.message || 'Could not delete marketplace listing.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Marketplace</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Contact listings</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Marketplace remains display + contact only. No cart, checkout, payment, orders, or shipping.
        </p>
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

        <form onSubmit={handleSubmitListing} className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{editingId ? 'Edit listing' : 'Create listing'}</h2>
              <p className="text-xs font-semibold text-slate-400">Admin marketplace CRUD uses real backend endpoints only.</p>
            </div>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700">
                Cancel edit
              </button>
            )}
          </div>
          {formError && <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{formError}</p>}
          {notice && <p className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Name
            <input name="name" value={form.name} onChange={updateListingField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Price text
            <input name="priceText" value={form.priceText} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="350.000 VND" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Description
            <textarea name="description" value={form.description} onChange={updateListingField} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Image URL
            <input name="imageUrl" value={form.imageUrl} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Upload image
            <input type="file" accept="image/*" onChange={handleUploadImage} disabled={uploading} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Care level
            <select name="careLevel" value={form.careLevel} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select care level</option>
              {careLevelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Light
            <select name="light" value={form.light} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select light need</option>
              {lightOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Water
            <select name="water" value={form.water} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select water need</option>
              {waterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Status
            <select name="status" value={form.status} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Contact URL
            <input name="contactUrl" value={form.contactUrl} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="https://zalo.me/..." />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving || uploading} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create listing'}
            </button>
            {uploading && <span className="text-xs font-black text-slate-400">Uploading image...</span>}
          </div>
        </form>

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
                    <p className="mt-1 text-xs font-semibold text-slate-400">{plant.status} - contact seller only</p>
                    <p className="mt-2 truncate rounded-xl bg-[#4CAF50]/10 px-3 py-2 text-xs font-black text-[#4CAF50]">Contact CTA: {plant.contactUrl}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(plant)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDeleteListing(plant)} disabled={deletingId === plant.id} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-950/50 dark:text-red-300">
                        {deletingId === plant.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
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
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{feedbackError}</p>

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
            <button type="submit" disabled className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              Backend endpoint required
            </button>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">Blocked until API exists</span>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
};

export default AdminMarketplace;
