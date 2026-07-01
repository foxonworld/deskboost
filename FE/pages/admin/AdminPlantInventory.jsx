import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useI18n } from '../../i18n/I18nContext';
import {
  createAdminPlantInventory,
  deleteAdminPlantInventory,
  getAdminMarketplacePlants,
  getAdminPlantInventory,
  getPlantSpecies,
  regenerateAdminPlantInventoryCode,
} from '../../services/adminApi';

const defaultLocation = 'HCM';

const normalizeCategory = (value) => String(value || '').toLowerCase();

const parseWateringCycleDays = (water) => {
  const match = String(water || '').match(/^1\/(\d+)$/);
  return match ? Number(match[1]) : 3;
};

const padSequence = (value) => String(value).padStart(3, '0');

const AdminPlantInventory = () => {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [regeneratingId, setRegeneratingId] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [generatedPlant, setGeneratedPlant] = useState(null);
  const [draft, setDraft] = useState({
    name: '',
    imageUrl: '',
    plantSpeciesId: '',
    speciesName: '',
    location: defaultLocation,
    wateringCycleDays: '3',
    notes: '',
  });
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
      const [itemData, inventoryData, speciesData] = await Promise.all([
        getAdminMarketplacePlants({ limit: 100, category: 'plant' }),
        getAdminPlantInventory(),
        getPlantSpecies().catch(() => ({ items: [] })),
      ]);
      setItems(itemData?.items || []);
      setInventory(inventoryData?.items || []);
      setSpeciesOptions(speciesData?.items || []);
    } catch (err) {
      setItems([]);
      setInventory([]);
      setSpeciesOptions([]);
      setError(err?.message || t('admin.plantInventory.error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getNextName = (item) => {
    const count = inventory.filter((plant) => plant.marketplaceItemId === item.id).length + 1;
    return `${item.name} #${padSequence(count)}`;
  };

  const getSpeciesLabel = (species) =>
    species?.vietnameseName || species?.name || '';

  const findDefaultSpecies = (item) => {
    const itemName = String(item?.name || '').trim().toLowerCase();
    if (!itemName) return null;
    return speciesOptions.find((species) =>
      [species.name, species.vietnameseName]
        .filter(Boolean)
        .some((name) => String(name).trim().toLowerCase() === itemName),
    ) || null;
  };

  const openGenerateModal = (item) => {
    const defaultSpecies = findDefaultSpecies(item);
    setSelectedItem(item);
    setGeneratedPlant(null);
    setDraft({
      name: getNextName(item),
      imageUrl: item.imageUrl || '',
      plantSpeciesId: defaultSpecies?.id || '',
      speciesName: getSpeciesLabel(defaultSpecies) || item.name || '',
      location: defaultLocation,
      wateringCycleDays: String(parseWateringCycleDays(item.water)),
      notes: '',
    });
    setError('');
    setNotice('');
  };

  const closeGenerateModal = () => {
    setSelectedItem(null);
    setGeneratedPlant(null);
    setDraft({
      name: '',
      imageUrl: '',
      plantSpeciesId: '',
      speciesName: '',
      location: defaultLocation,
      wateringCycleDays: '3',
      notes: '',
    });
  };

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setError('');
    setNotice('');
    setDraft((current) => {
      if (name === 'plantSpeciesId') {
        const species = speciesOptions.find((item) => item.id === value);
        return {
          ...current,
          plantSpeciesId: value,
          speciesName: species ? getSpeciesLabel(species) : current.speciesName,
        };
      }
      return { ...current, [name]: value };
    });
  };

  const handleGenerateCode = async (event) => {
    event.preventDefault();
    if (!selectedItem) return;
    if (!draft.name.trim()) {
      setError(t('admin.plantInventory.error.nameRequired'));
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const result = await createAdminPlantInventory({
        marketplaceItemId: selectedItem.id,
        plantSpeciesId: draft.plantSpeciesId || null,
        name: draft.name.trim(),
        speciesName: draft.speciesName.trim() || selectedItem.name,
        imageUrl: draft.imageUrl.trim() || selectedItem.imageUrl || null,
        location: draft.location.trim() || defaultLocation,
        careLevel: selectedItem.careLevel || null,
        light: selectedItem.light || null,
        water: selectedItem.water || null,
        wateringCycleDays: Number(draft.wateringCycleDays || 3),
        notes: draft.notes.trim() || null,
      });
      setGeneratedPlant(result);
      setNotice(t('admin.plantInventory.notice.generated'));
      await loadData();
    } catch (err) {
      setError(err?.message || t('admin.plantInventory.error.generateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plant) => {
    if (!window.confirm(t('admin.plantInventory.deleteConfirm', { name: plant.name }))) return;
    setDeletingId(plant.id);
    setError('');
    setNotice('');
    try {
      await deleteAdminPlantInventory(plant.id);
      setInventory((current) => current.filter((item) => item.id !== plant.id));
      setNotice(t('admin.plantInventory.notice.deleted'));
    } catch (err) {
      setError(err?.message || t('admin.plantInventory.error.deleteFailed'));
    } finally {
      setDeletingId('');
    }
  };

  const handleRegenerate = async (plant) => {
    if (!window.confirm(t('admin.plantInventory.regenerateConfirm', { name: plant.name }))) return;
    setRegeneratingId(plant.id);
    setError('');
    setNotice('');
    try {
      const updated = await regenerateAdminPlantInventoryCode(plant.id);
      setInventory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setNotice(t('admin.plantInventory.notice.regenerated'));
    } catch (err) {
      setError(err?.message || t('admin.plantInventory.error.regenerateFailed'));
    } finally {
      setRegeneratingId('');
    }
  };

  const findMarketplaceName = (plant) =>
    plantItems.find((item) => item.id === plant.marketplaceItemId)?.name || t('admin.plantInventory.fallbackMarketplaceName');

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.plantInventory.badge')}</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{t('admin.plantInventory.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.plantInventory.description')}
        </p>
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        {notice && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">{t('admin.plantInventory.loading')}</p>
          ) : plantItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.plantInventory.emptyMarketplace')}</p>
          ) : (
            plantItems.map((item) => {
              const generatedCount = inventory.filter((plant) => plant.marketplaceItemId === item.id).length;
              return (
                <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <span className="material-symbols-outlined">potted_plant</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900 dark:text-white">{item.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{t('admin.plantInventory.generatedCount', { count: generatedCount })}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.careLevel && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-800">{t('admin.plantInventory.careLevel', { level: item.careLevel })}</span>}
                        {item.light && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-800">{t('admin.plantInventory.light', { level: item.light })}</span>}
                        {item.water && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-800">{t('admin.plantInventory.water', { level: item.water })}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openGenerateModal(item)}
                    className="mt-4 w-full rounded-2xl bg-[#4CAF50] px-4 py-3 text-sm font-black text-white transition hover:bg-[#43A047]"
                  >
                    Generate code
                  </button>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.plantInventory.generatedBadge')}</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{t('admin.plantInventory.listTitle')}</h2>
          </div>
          <p className="text-sm font-bold text-slate-400">{t('admin.plantInventory.recordsCount', { count: inventory.length })}</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          {loading ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('admin.plantInventory.loadingGenerated')}</p>
          ) : inventory.length === 0 ? (
            <p className="p-5 text-sm font-bold text-slate-400">{t('admin.plantInventory.emptyGenerated')}</p>
          ) : (
            inventory.map((plant) => (
              <div key={plant.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800 lg:grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_auto] lg:items-center">
                <div className="flex items-center gap-3">
                  {plant.imageUrl ? (
                    <img src={plant.imageUrl} alt={plant.name} className="h-12 w-12 rounded-2xl object-cover" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <span className="material-symbols-outlined text-xl">potted_plant</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">{plant.name}</p>
                    <p className="text-xs font-semibold text-slate-400">{findMarketplaceName(plant)} - {plant.location || t('admin.plantInventory.noLocation')}</p>
                  </div>
                </div>
                <p className="rounded-xl bg-[#4CAF50]/10 px-3 py-2 text-xs font-black text-[#4CAF50]">{t('admin.plantInventory.codeLabel', { code: plant.ownershipCode || t('admin.plantInventory.notGenerated') })}</p>
                <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${plant.isClaimed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {plant.isClaimed ? t('status.claimed') : t('status.unclaimed')}
                </span>
                <p className="text-xs font-bold text-slate-400">{plant.userEmail || t('admin.plantInventory.noUser')}</p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => handleRegenerate(plant)}
                    disabled={plant.isClaimed || regeneratingId === plant.id}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    {regeneratingId === plant.id ? t('admin.plantInventory.regenerating') : t('admin.plantInventory.regenerateCode')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plant)}
                    disabled={plant.isClaimed || deletingId === plant.id}
                    className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-950/50 dark:text-red-300"
                  >
                    {deletingId === plant.id ? t('admin.plantInventory.deleting') : t('common.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.plantInventory.modal.badge')}</p>
                <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{selectedItem.name}</h2>
                <p className="mt-2 text-sm font-bold text-slate-400">{t('admin.plantInventory.modal.description')}</p>
              </div>
              <button
                type="button"
                onClick={closeGenerateModal}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700"
                aria-label="Close generate code modal"
              >
                <span className="material-symbols-rounded text-xl">close</span>
              </button>
            </div>

            {generatedPlant ? (
              <div className="mt-6 rounded-3xl border border-[#4CAF50]/20 bg-[#4CAF50]/5 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-[#4CAF50]">{t('admin.plantInventory.modal.successBadge')}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-[120px_1fr]">
                  {generatedPlant.imageUrl ? (
                    <img src={generatedPlant.imageUrl} alt={generatedPlant.name} className="h-28 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="grid h-28 place-items-center rounded-2xl bg-white text-[#4CAF50] dark:bg-slate-950">
                      <span className="material-symbols-outlined text-5xl">potted_plant</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{generatedPlant.name}</h3>
                    <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-lg font-black text-[#4CAF50] dark:bg-slate-950">
                      {generatedPlant.ownershipCode || t('admin.plantInventory.modal.codeUnavailable')}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                      {t('admin.plantInventory.modal.statusLocation', { status: generatedPlant.ownershipStatus || t('status.unclaimed'), location: generatedPlant.location || defaultLocation })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeGenerateModal}
                  className="mt-5 rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white transition hover:bg-[#43A047]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateCode} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                  Inventory name
                  <input name="name" value={draft.name} onChange={updateDraft} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                  Location
                  <input name="location" value={draft.location} onChange={updateDraft} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
                </label>
                {speciesOptions.length > 0 && (
                  <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    Plant species
                    <select name="plantSpeciesId" value={draft.plantSpeciesId} onChange={updateDraft} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                      <option value="">{t('admin.plantInventory.form.noSpecies')}</option>
                      {speciesOptions.map((species) => (
                        <option key={species.id} value={species.id}>
                          {getSpeciesLabel(species)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                  Species name
                  <input name="speciesName" value={draft.speciesName} onChange={updateDraft} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
                  Watering cycle days
                  <input name="wateringCycleDays" type="number" min="1" value={draft.wateringCycleDays} onChange={updateDraft} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
                  Image URL
                  <input name="imageUrl" value={draft.imageUrl} onChange={updateDraft} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
                  Note
                  <textarea name="notes" value={draft.notes} onChange={updateDraft} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder={t('admin.plantInventory.form.notePlaceholder')} />
                </label>
                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <p>{t('admin.plantInventory.form.careInfo', { care: selectedItem.careLevel || t('common.nA'), light: selectedItem.light || t('common.nA'), water: selectedItem.water || t('common.nA') })}</p>
                  <p className="mt-1">{t('admin.plantInventory.form.careHint')}</p>
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? t('admin.plantInventory.generating') : t('admin.plantInventory.generateCode')}
                  </button>
                  <button type="button" onClick={closeGenerateModal} disabled={saving} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700">
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPlantInventory;
