import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  createAdminMarketplacePlant,
  deleteAdminMarketplacePlant,
  getAdminMarketplacePlants,
  updateAdminMarketplacePlant,
} from '../../services/adminApi';
import { uploadImage } from '../../services/uploadApi';
import { useI18n } from '../../i18n';

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
  { value: 'active', labelKey: 'admin.status.active' },
  { value: 'inactive', labelKey: 'admin.status.inactive' },
];

const categoryOptions = [
  { value: 'plant', labelKey: 'admin.category.plant' },
  { value: 'pot', labelKey: 'admin.category.pot' },
  { value: 'soil', labelKey: 'admin.category.soil' },
  { value: 'fertilizer', labelKey: 'admin.category.fertilizer' },
  { value: 'accessory', labelKey: 'admin.category.accessory' },
  { value: 'other', labelKey: 'admin.category.other' },
];

const careLevelOptions = [
  { value: '1', labelKey: 'admin.careLevel.1' },
  { value: '2', labelKey: 'admin.careLevel.2' },
  { value: '3', labelKey: 'admin.careLevel.3' },
  { value: '4', labelKey: 'admin.careLevel.4' },
  { value: '5', labelKey: 'admin.careLevel.5' },
];

const lightOptions = [
  { value: '1', labelKey: 'admin.light.1' },
  { value: '2', labelKey: 'admin.light.2' },
  { value: '3', labelKey: 'admin.light.3' },
  { value: '4', labelKey: 'admin.light.4' },
  { value: '5', labelKey: 'admin.light.5' },
];

const waterOptions = [
  { value: '1/1', labelKey: 'admin.water.1_1' },
  { value: '1/2', labelKey: 'admin.water.1_2' },
  { value: '1/3', labelKey: 'admin.water.1_3' },
  { value: '1/5', labelKey: 'admin.water.1_5' },
  { value: '1/7', labelKey: 'admin.water.1_7' },
  { value: '1/14', labelKey: 'admin.water.1_14' },
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
  const { t } = useI18n();

  const loadPlants = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminMarketplacePlants({ limit: 20 });
      setPlants(data?.items || []);
    } catch (err) {
      setPlants([]);
      setError(err?.message || t('admin.marketplace.error.load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

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
      setNotice(t('admin.marketplace.notice.uploaded'));
    } catch (err) {
      setFormError(err?.message || t('admin.marketplace.error.upload'));
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
      const payload = {
        ...form,
        careLevel: isPlantCategory ? form.careLevel : null,
        light: isPlantCategory ? form.light : null,
        water: isPlantCategory ? form.water : null,
        attributesJson: isPlantCategory ? null : form.attributesJson,
      };
      if (editingId) {
        await updateAdminMarketplacePlant(editingId, payload);
        setNotice(t('admin.marketplace.notice.updated'));
      } else {
        await createAdminMarketplacePlant(payload);
        setNotice(t('admin.marketplace.notice.created'));
      }
      setForm(emptyListingForm);
      setEditingId('');
      await loadPlants();
    } catch (err) {
      setFormError(err?.message || t('admin.marketplace.error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (plant) => {
    if (!window.confirm(t('admin.marketplace.confirmDelete', { name: plant.name }))) return;
    setDeletingId(plant.id);
    setFormError('');
    setNotice('');
    try {
      await deleteAdminMarketplacePlant(plant.id);
      setPlants((current) => current.filter((item) => item.id !== plant.id));
      if (editingId === plant.id) resetForm();
      setNotice(t('admin.marketplace.notice.deleted'));
    } catch (err) {
      setFormError(err?.message || t('admin.marketplace.error.delete'));
    } finally {
      setDeletingId('');
    }
  };

  const isPlantCategory = form.category === 'plant';

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.marketplace.badge')}</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.marketplace.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.marketplace.description')}
        </p>
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

        <form onSubmit={handleSubmitListing} className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{editingId ? t('admin.marketplace.editListing') : t('admin.marketplace.createListing')}</h2>
              <p className="text-xs font-semibold text-slate-400">{t('admin.marketplace.formNote')}</p>
            </div>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700">
                {t('admin.marketplace.cancelEdit')}
              </button>
            )}
          </div>
          {formError && <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{formError}</p>}
          {notice && <p className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.name')}
            <input name="name" value={form.name} onChange={updateListingField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.priceText')}
            <input name="priceText" value={form.priceText} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="350.000 VND" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.category')}
            <select name="category" value={form.category} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {categoryOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.field.description')}
            <textarea name="description" value={form.description} onChange={updateListingField} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.imageUrl')}
            <input name="imageUrl" value={form.imageUrl} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.uploadImage')}
            <input type="file" accept="image/*" onChange={handleUploadImage} disabled={uploading} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          {isPlantCategory ? (
            <>
              <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                {t('admin.field.careLevel')}
                <select name="careLevel" value={form.careLevel} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                  <option value="">{t('admin.field.selectCareLevel')}</option>
                  {careLevelOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                {t('admin.field.light')}
                <select name="light" value={form.light} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                  <option value="">{t('admin.field.selectLight')}</option>
                  {lightOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                {t('admin.field.water')}
                <select name="water" value={form.water} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                  <option value="">{t('admin.field.selectWater')}</option>
                  {waterOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                </select>
              </label>
            </>
          ) : (
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
              {t('admin.field.attributesJson')}
              <textarea name="attributesJson" value={form.attributesJson} onChange={updateListingField} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder='{"material":"ceramic","size":"small"}' />
              <span className="block text-xs font-bold text-slate-400">{t('admin.marketplace.attributesNote')}</span>
            </label>
          )}
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.field.status')}
            <select name="status" value={form.status} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.field.contactUrl')}
            <input name="contactUrl" value={form.contactUrl} onChange={updateListingField} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder="https://zalo.me/..." />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving || uploading} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? t('common.saving') : editingId ? t('admin.marketplace.saveChanges') : t('admin.marketplace.createListing')}
            </button>
            {uploading && <span className="text-xs font-black text-slate-400">{t('upload.uploading')}</span>}
          </div>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">{t('admin.marketplace.loading')}</p>
          ) : plants.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.marketplace.empty')}</p>
          ) : (
            plants.map((plant) => (
              <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex gap-3">
                  <img src={plant.imageUrl} alt={plant.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">{plant.name}</p>
                    <p className="mt-1 text-sm font-black text-[#4CAF50]">{plant.priceText}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{plant.category || t('admin.category.plant')} - {plant.status} - {t('admin.marketplace.contactSellerOnly')}</p>
                    <p className="mt-2 truncate rounded-xl bg-[#4CAF50]/10 px-3 py-2 text-xs font-black text-[#4CAF50]">{t('admin.marketplace.contactCta')}: {plant.contactUrl}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(plant)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                        {t('common.edit')}
                      </button>
                      <button type="button" onClick={() => handleDeleteListing(plant)} disabled={deletingId === plant.id} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-950/50 dark:text-red-300">
                        {deletingId === plant.id ? t('admin.action.deleting') : t('common.delete')}
                      </button>
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

export default AdminMarketplace;
