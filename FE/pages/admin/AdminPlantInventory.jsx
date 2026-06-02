import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  createAdminPlantInventory,
  deleteAdminPlantInventory,
  getAdminMarketplacePlants,
  getAdminPlantInventory,
  regenerateAdminPlantInventoryCode,
  updateAdminPlantInventory,
} from '../../services/adminApi';
import { uploadImage } from '../../services/uploadApi';

const emptyForm = {
  marketplaceItemId: '',
  name: '',
  speciesName: '',
  imageUrl: '',
  location: '',
  wateringCycleDays: '3',
  notes: '',
};

const normalizeCategory = (value) => String(value || '').toLowerCase();

const AdminPlantInventory = () => {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [regeneratingId, setRegeneratingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const plantItems = useMemo(
    () => items.filter((item) => normalizeCategory(item.category) === 'plant'),
    [items],
  );

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [itemData, inventoryData] = await Promise.all([
        getAdminMarketplacePlants({ limit: 100, category: 'plant' }),
        getAdminPlantInventory(),
      ]);
      setItems(itemData?.items || []);
      setInventory(inventoryData?.items || []);
    } catch (err) {
      setItems([]);
      setInventory([]);
      setError(err?.message || 'Could not load plant inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setError('');
    setNotice('');
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
    setError('');
  };

  const startEdit = (plant) => {
    setEditingId(plant.id);
    setForm({
      marketplaceItemId: plant.marketplaceItemId || '',
      name: plant.name || '',
      speciesName: plant.speciesName || '',
      imageUrl: plant.imageUrl || '',
      location: plant.location || '',
      wateringCycleDays: String(plant.wateringCycleDays || 3),
      notes: plant.notes || '',
    });
    setError('');
    setNotice('');
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setNotice('');
    try {
      const imageUrl = await uploadImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      setNotice('Image uploaded and attached to inventory item.');
    } catch (err) {
      setError(err?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const toPayload = () => ({
    marketplaceItemId: form.marketplaceItemId || null,
    name: form.name.trim(),
    speciesName: form.speciesName.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    location: form.location.trim() || null,
    wateringCycleDays: Number(form.wateringCycleDays || 3),
    notes: form.notes.trim() || null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.marketplaceItemId) {
      setError('Please select a plant marketplace item before creating inventory.');
      return;
    }
    if (!form.name.trim()) {
      setError('Inventory plant name is required.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateAdminPlantInventory(editingId, toPayload());
        setNotice('Plant inventory updated.');
      } else {
        await createAdminPlantInventory(toPayload());
        setNotice('Plant inventory created with backend claim code.');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err?.message || 'Could not save plant inventory.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plant) => {
    if (!window.confirm(`Delete inventory plant "${plant.name}"?`)) return;
    setDeletingId(plant.id);
    setError('');
    setNotice('');
    try {
      await deleteAdminPlantInventory(plant.id);
      setInventory((current) => current.filter((item) => item.id !== plant.id));
      if (editingId === plant.id) resetForm();
      setNotice('Plant inventory deleted.');
    } catch (err) {
      setError(err?.message || 'Could not delete plant inventory.');
    } finally {
      setDeletingId('');
    }
  };

  const handleRegenerate = async (plant) => {
    if (!window.confirm(`Regenerate claim code for "${plant.name}"?`)) return;
    setRegeneratingId(plant.id);
    setError('');
    setNotice('');
    try {
      const updated = await regenerateAdminPlantInventoryCode(plant.id);
      setInventory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setNotice('Claim code regenerated.');
    } catch (err) {
      setError(err?.message || 'Could not regenerate claim code.');
    } finally {
      setRegeneratingId('');
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">Plant inventory</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Physical plant inventory</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Create physical plants only from marketplace items with category plant. Claim codes are generated by the backend.
        </p>
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        {notice && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{editingId ? 'Edit inventory plant' : 'Create inventory plant'}</h2>
              <p className="text-xs font-semibold text-slate-400">Only plant marketplace items can be selected here.</p>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700">Cancel edit</button>}
          </div>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Marketplace plant item
            <select name="marketplaceItemId" value={form.marketplaceItemId} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select plant item</option>
              {plantItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Inventory name
            <input name="name" value={form.name} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="Heartleaf #001" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Species name
            <input name="speciesName" value={form.speciesName} onChange={updateField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Location
            <input name="location" value={form.location} onChange={updateField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="Shelf A-01" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Watering cycle days
            <input name="wateringCycleDays" type="number" min="1" value={form.wateringCycleDays} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Upload image
            <input type="file" accept="image/*" onChange={handleUploadImage} disabled={uploading} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Image URL
            <input name="imageUrl" value={form.imageUrl} onChange={updateField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            Notes
            <textarea name="notes" value={form.notes} onChange={updateField} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={saving || uploading || plantItems.length === 0} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save inventory' : 'Create inventory'}
            </button>
          </div>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">Loading plant inventory...</p>
          ) : inventory.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">No physical plants in inventory yet.</p>
          ) : (
            inventory.map((plant) => (
              <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex gap-3">
                  {plant.imageUrl ? <img src={plant.imageUrl} alt={plant.name} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800"><span className="material-symbols-outlined">potted_plant</span></div>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">{plant.name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{plant.location || 'No location'} - {plant.ownershipStatus}</p>
                    <p className="mt-2 rounded-xl bg-[#4CAF50]/10 px-3 py-2 text-xs font-black text-[#4CAF50]">Code: {plant.ownershipCode || 'Not generated'}</p>
                    {plant.userEmail && <p className="mt-2 text-xs font-bold text-slate-400">Claimed by {plant.userEmail}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(plant)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">Edit</button>
                      <button type="button" onClick={() => handleRegenerate(plant)} disabled={plant.isClaimed || regeneratingId === plant.id} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300">{regeneratingId === plant.id ? 'Regenerating...' : 'Regenerate code'}</button>
                      <button type="button" onClick={() => handleDelete(plant)} disabled={plant.isClaimed || deletingId === plant.id} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-950/50 dark:text-red-300">{deletingId === plant.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
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

export default AdminPlantInventory;
