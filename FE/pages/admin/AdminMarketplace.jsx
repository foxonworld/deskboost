import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  createAdminFeedback,
  createAdminMarketplacePlant,
  deleteAdminMarketplacePlant,
  deleteAdminFeedback,
  getAdminFeedback,
  getAdminMarketplacePlants,
  updateAdminMarketplacePlant,
  verifyAdminFeedback,
} from '../../services/adminApi';
import { uploadImage } from '../../services/uploadApi';

const emptyListingForm = {
  name: '',
  description: '',
  imageUrl: '',
  priceText: '',
  category: 'plant',
  careLevel: '',
  light: '',
  water: '',
  attributesJson: '',
  contactUrl: '',
  status: 'active',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const categoryOptions = [
  { value: 'plant', label: 'Plant' },
  { value: 'pot', label: 'Pot' },
  { value: 'soil', label: 'Soil' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'other', label: 'Other' },
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
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackActionId, setFeedbackActionId] = useState('');
  const [feedbackUploading, setFeedbackUploading] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    customerAlias: 'Customer from HCMC',
    rating: '5',
    comment: '',
    marketplaceItemId: '',
    purchaseChannel: 'zalo',
    publicImageUrls: '',
    evidenceImageUrls: '',
    evidenceNote: '',
    isVerified: true,
  });

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

  const loadFeedback = async () => {
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const data = await getAdminFeedback();
      setFeedbackItems(data?.items || []);
    } catch (err) {
      setFeedbackItems([]);
      setFeedbackError(err?.message || 'Could not load admin feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
    loadFeedback();
  }, []);

  const updateFeedbackField = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFeedbackForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleCreateFeedback = async (event) => {
    event.preventDefault();
    setFeedbackError('');
    setFeedbackNotice('');
    if (!feedbackForm.marketplaceItemId) {
      setFeedbackError('Please select a marketplace item.');
      return;
    }
    if (!feedbackForm.comment.trim()) {
      setFeedbackError('Public comment is required.');
      return;
    }
    setFeedbackSaving(true);
    const parseUrls = (value) =>
      value
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean);
    try {
      await createAdminFeedback({
        marketplaceItemId: feedbackForm.marketplaceItemId,
        customerAlias: feedbackForm.customerAlias.trim() || null,
        rating: Number(feedbackForm.rating),
        comment: feedbackForm.comment.trim(),
        purchaseChannel: feedbackForm.purchaseChannel,
        publicImageUrls: parseUrls(feedbackForm.publicImageUrls),
        evidenceImageUrls: parseUrls(feedbackForm.evidenceImageUrls),
        evidenceNote: feedbackForm.evidenceNote.trim() || null,
        isVerified: feedbackForm.isVerified,
      });
      setFeedbackForm((current) => ({
        ...current,
        comment: '',
        publicImageUrls: '',
        evidenceImageUrls: '',
        evidenceNote: '',
      }));
      setFeedbackNotice('Feedback created.');
      await loadFeedback();
    } catch (err) {
      setFeedbackError(err?.message || 'Could not create feedback.');
    } finally {
      setFeedbackSaving(false);
    }
  };

  const handleVerifyFeedback = async (feedback) => {
    setFeedbackActionId(feedback.id);
    setFeedbackError('');
    setFeedbackNotice('');
    try {
      const updated = await verifyAdminFeedback(feedback.id, { isVerified: !feedback.isVerified });
      setFeedbackItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setFeedbackNotice(updated.isVerified ? 'Feedback verified.' : 'Feedback unverified.');
    } catch (err) {
      setFeedbackError(err?.message || 'Could not update feedback verification.');
    } finally {
      setFeedbackActionId('');
    }
  };

  const handleDeleteFeedback = async (feedback) => {
    if (!window.confirm('Delete this feedback?')) return;
    setFeedbackActionId(feedback.id);
    setFeedbackError('');
    setFeedbackNotice('');
    try {
      await deleteAdminFeedback(feedback.id);
      setFeedbackItems((current) => current.filter((item) => item.id !== feedback.id));
      setFeedbackNotice('Feedback deleted.');
    } catch (err) {
      setFeedbackError(err?.message || 'Could not delete feedback.');
    } finally {
      setFeedbackActionId('');
    }
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
      category: plant.category || 'plant',
      careLevel: plant.careLevel || '',
      light: plant.light || '',
      water: plant.water || '',
      attributesJson: plant.attributesJson || '',
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

  const handleUploadFeedbackImage = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFeedbackUploading(fieldName);
    setFeedbackError('');
    setFeedbackNotice('');
    try {
      const imageUrl = await uploadImage(file);
      setFeedbackForm((current) => ({
        ...current,
        [fieldName]: [current[fieldName], imageUrl].filter(Boolean).join('\n'),
      }));
      setFeedbackNotice('Feedback image uploaded.');
    } catch (err) {
      setFeedbackError(err?.message || 'Feedback image upload failed.');
    } finally {
      setFeedbackUploading('');
      event.target.value = '';
    }
  };

  const handleSubmitListing = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      const payload = {
        ...form,
        careLevel: isPlantCategory ? form.careLevel : null,
        light: isPlantCategory ? form.light : null,
        water: isPlantCategory ? form.water : null,
        attributesJson: isPlantCategory ? null : form.attributesJson,
      };
      if (editingId) {
        await updateAdminMarketplacePlant(editingId, payload);
        setNotice('Marketplace listing updated.');
      } else {
        await createAdminMarketplacePlant(payload);
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

  const isPlantCategory = form.category === 'plant';

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
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Category
            <select name="category" value={form.category} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
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
          {isPlantCategory ? (
            <>
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
            </>
          ) : (
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
              Attributes JSON
              <textarea name="attributesJson" value={form.attributesJson} onChange={updateListingField} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder='{"material":"ceramic","size":"small"}' />
              <span className="block text-xs font-bold text-slate-400">Prepared for non-plant marketplace items after backend supports attributes.</span>
            </label>
          )}
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
          <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
            <label className="flex items-start gap-3 text-sm font-black text-slate-700 dark:text-slate-200">
              <input type="checkbox" disabled className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4CAF50] disabled:opacity-50" />
              <span>
                <span className="block">{isPlantCategory ? 'Generate ownership code after sale' : 'Ownership code not applicable for this category'}</span>
                <span className="mt-1 block text-xs font-bold text-slate-400">{isPlantCategory ? 'Create physical inventory and claim code from the Plant Inventory page.' : 'Inventory and claim codes are only for plant items.'}</span>
              </span>
            </label>
          </div>
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
                    <p className="mt-1 text-xs font-semibold text-slate-400">{plant.category || 'plant'} - {plant.status} - contact seller only</p>
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
          Admin-created feedback is attached to marketplace items. Public image URLs can be shown to customers; evidence URLs and notes stay admin-only.
        </p>
        {feedbackError && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{feedbackError}</p>}
        {feedbackNotice && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{feedbackNotice}</p>}

        <form onSubmit={handleCreateFeedback} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Customer alias
            <input name="customerAlias" value={feedbackForm.customerAlias} onChange={updateFeedbackField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Marketplace item
            <select name="marketplaceItemId" value={feedbackForm.marketplaceItemId} onChange={updateFeedbackField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">No marketplace item selected</option>
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
            Public image URLs
            <textarea name="publicImageUrls" value={feedbackForm.publicImageUrls} onChange={updateFeedbackField} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="One image URL per line, visible to public later" />
            <input type="file" accept="image/*" onChange={(event) => handleUploadFeedbackImage(event, 'publicImageUrls')} disabled={feedbackUploading === 'publicImageUrls'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Evidence image URLs
            <textarea name="evidenceImageUrls" value={feedbackForm.evidenceImageUrls} onChange={updateFeedbackField} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="One private evidence URL per line, admin-only later" />
            <input type="file" accept="image/*" onChange={(event) => handleUploadFeedbackImage(event, 'evidenceImageUrls')} disabled={feedbackUploading === 'evidenceImageUrls'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Private evidence note
            <textarea name="evidenceNote" value={feedbackForm.evidenceNote} onChange={updateFeedbackField} required rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="Private note, e.g. Bought via Zalo chat on May 14" />
          </label>
          <label className="md:col-span-2 flex items-start gap-3 text-sm font-black text-slate-700 dark:text-slate-200">
            <input type="checkbox" name="isVerified" checked={feedbackForm.isVerified} onChange={updateFeedbackField} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4CAF50]" />
            <span>
              <span className="block">Create as verified</span>
              <span className="mt-1 block text-xs font-bold text-slate-400">Verified feedback appears in the public verified feedback API.</span>
            </span>
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={feedbackSaving || Boolean(feedbackUploading)} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {feedbackSaving ? 'Saving feedback...' : 'Create feedback'}
            </button>
            {feedbackUploading && <span className="text-xs font-black text-slate-400">Uploading feedback image...</span>}
          </div>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {feedbackLoading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">Loading admin feedback...</p>
          ) : feedbackItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">No feedback created yet.</p>
          ) : (
            feedbackItems.map((feedback) => (
              <article key={feedback.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{feedback.customerAlias || 'Customer'}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{feedback.purchaseChannel || 'manual'} - {feedback.rating || 0}/5</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${feedback.isVerified ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-amber-100 text-amber-700'}`}>
                    {feedback.isVerified ? 'Verified' : 'Draft'}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{feedback.comment}</p>
                {feedback.publicImageUrls?.length > 0 && <p className="mt-2 text-xs font-bold text-slate-400">Public images: {feedback.publicImageUrls.length}</p>}
                {feedback.evidenceImageUrls?.length > 0 && <p className="mt-1 text-xs font-bold text-slate-400">Evidence images: {feedback.evidenceImageUrls.length}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => handleVerifyFeedback(feedback)} disabled={feedbackActionId === feedback.id} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300">
                    {feedback.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button type="button" onClick={() => handleDeleteFeedback(feedback)} disabled={feedbackActionId === feedback.id} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-950/50 dark:text-red-300">
                    Delete
                  </button>
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
