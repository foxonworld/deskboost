import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminUserPlant,
  getAdminUserPlants,
} from '../../services/adminApi';
import { useI18n } from '../../i18n';

const plantStatusOptions = [
  { value: 'healthy', labelKey: 'admin.plants.status.healthy' },
  { value: 'needs-water', labelKey: 'admin.plants.status.needsWater' },
  { value: 'issue', labelKey: 'admin.plants.status.issue' },
];

const filterOptions = [
  { value: 'all', labelKey: 'admin.plants.filter.all' },
  { value: 'attention', labelKey: 'admin.plants.filter.attention' },
  ...plantStatusOptions,
];

const statusTone = {
  healthy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  'needs-water': 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  issue: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

const normalizeStatus = (status) => String(status || 'healthy').toLowerCase();
const isAttentionStatus = (status) => ['needs-water', 'issue'].includes(normalizeStatus(status));

const formatDate = (value, fallback) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatSignal = (value, fallback) => {
  if (!value || value === 'unknown') return fallback;
  return value;
};

const getPlantImage = (plant) => plant?.imageUrl || plant?.image || plant?.ImageUrl || plant?.Image;

const getOwnerName = (plant) => plant?.userName || plant?.userEmail;

const OwnerLink = ({ plant, children, className = '' }) => {
  if (!plant?.userId) return <span className={className}>{children}</span>;
  return (
    <Link to={`/admin/users?userId=${plant.userId}`} className={`${className} underline decoration-slate-300 underline-offset-4 transition hover:text-[#4CAF50] hover:decoration-[#4CAF50]`}>
      {children}
    </Link>
  );
};

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useI18n();

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
          setError(err?.message || t('admin.plants.error.load'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [t]);

  const summary = useMemo(() => {
    const base = { total: plants.length, healthy: 0, 'needs-water': 0, issue: 0 };
    plants.forEach((plant) => {
      const status = normalizeStatus(plant.status);
      if (base[status] !== undefined) base[status] += 1;
    });
    return base;
  }, [plants]);

  const filteredPlants = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return plants.filter((plant) => {
      const status = normalizeStatus(plant.status);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'attention' ? isAttentionStatus(status) : status === statusFilter);
      const haystack = [plant.name, plant.nickname, plant.species, plant.userName, plant.userEmail]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [plants, searchTerm, statusFilter]);

  const statusLabel = (status) => {
    const value = normalizeStatus(status);
    const option = plantStatusOptions.find((item) => item.value === value);
    return option ? t(option.labelKey) : value;
  };

  const openDetail = async (plantId) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const data = await getAdminUserPlant(plantId);
      setSelectedPlant(data);
    } catch (err) {
      setSelectedPlant(null);
      setDetailError(err?.message || t('admin.plants.error.detail'));
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.plants.badge')}</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.plants.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.plants.description')}
        </p>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{t('admin.plants.backendUnavailable')}</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { key: 'total', label: t('admin.plants.summary.total'), value: summary.total },
            { key: 'healthy', label: t('admin.plants.status.healthy'), value: summary.healthy },
            { key: 'needs-water', label: t('admin.plants.status.needsWater'), value: summary['needs-water'] },
            { key: 'issue', label: t('admin.plants.status.issue'), value: summary.issue },
          ].map((item) => (
            <div key={item.key} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">search</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('admin.plants.search')}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
                {filterOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </div>

            {loading ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">{t('admin.plants.loading')}</p>
            ) : error ? (
              <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.plants.emptyBackend')}</p>
            ) : filteredPlants.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.plants.empty')}</p>
            ) : (
              <div className="grid gap-3">
                {filteredPlants.map((plant) => {
                  const currentStatus = normalizeStatus(plant.status);
                  return (
                    <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-black text-slate-900 dark:text-white">{plant.nickname || plant.name}</p>
                            <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${statusTone[currentStatus] || statusTone.healthy}`}>{statusLabel(currentStatus)}</span>
                          </div>
                          <p className="mt-1 text-xs font-semibold text-slate-400">
                            {plant.species || t('admin.unknown')} - {t('admin.plants.owner')}: <OwnerLink plant={plant}>{getOwnerName(plant) || t('admin.unknown')}</OwnerLink>
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">{t('admin.plants.claim')}: {plant.ownershipStatus || plant.claimCodeStatus || t('admin.unknown')}</span>
                            {(plant.ownershipCode || plant.claimCode) && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">{t('admin.plants.code')}: {plant.ownershipCode || plant.claimCode}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => openDetail(plant.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                            {t('admin.plants.detail')}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('admin.plants.detailStatus')}</p>
            {detailLoading ? (
              <p className="mt-3 text-sm font-bold text-slate-400">{t('admin.plants.detailLoading')}</p>
            ) : detailError ? (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{detailError}</p>
            ) : !selectedPlant ? (
              <p className="mt-3 text-sm font-bold text-slate-400">{t('admin.plants.selectDetail')}</p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40">
                  {getPlantImage(selectedPlant) ? (
                    <img src={getPlantImage(selectedPlant)} alt={selectedPlant.nickname || selectedPlant.name} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">{t('admin.plants.noImage')}</div>
                  )}
                  <div className="p-4">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{selectedPlant.nickname || selectedPlant.name || t('admin.unknown')}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#4CAF50]">{selectedPlant.species || t('admin.unknown')}</p>
                  </div>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('admin.plants.statusSignals')}</p>
                  <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <p>{t('admin.field.status')}: {statusLabel(selectedPlant.status)}</p>
                    <p>{t('admin.plants.statusSource')}: {formatSignal(selectedPlant.statusSource, t('admin.plants.noSignal'))}</p>
                    <p>{t('admin.plants.statusUpdatedAt')}: {formatDate(selectedPlant.statusUpdatedAt, t('admin.plants.noSignal'))}</p>
                    <p>{t('admin.plants.lastWateredAt')}: {formatDate(selectedPlant.lastWateredAt, t('admin.plants.noSignal'))}</p>
                    <p>{t('admin.plants.lastDiagnosisAt')}: {formatDate(selectedPlant.lastDiagnosisAt, t('admin.plants.noSignal'))}</p>
                  </div>
                </section>

                <div className="grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <p>{t('admin.plants.owner')}: <OwnerLink plant={selectedPlant} className="text-slate-700 dark:text-slate-200">{getOwnerName(selectedPlant) || t('admin.unknown')}</OwnerLink></p>
                  <p>{t('admin.plants.location')}: {selectedPlant.location || t('admin.notSet')}</p>
                  <p>{t('admin.plants.wateringCycle')}: {selectedPlant.wateringCycleDays || t('admin.notSet')}</p>
                  <p>{t('admin.plants.notes')}: {selectedPlant.notes || t('admin.notSet')}</p>
                  <p>{t('admin.users.created')}: {formatDate(selectedPlant.createdAt, t('admin.unknown'))}</p>
                  <p>{t('admin.plants.updatedAt')}: {formatDate(selectedPlant.updatedAt, t('admin.notSet'))}</p>
                  <p>{t('admin.plants.claimedAt')}: {formatDate(selectedPlant.claimedAt, t('admin.notSet'))}</p>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#4CAF50]" aria-hidden="true">key</span>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{t('admin.plants.claimCode')}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">{t('admin.plants.claimCodeNote')}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('admin.plants.code')}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{selectedPlant.ownershipCode || selectedPlant.claimCode || t('admin.plants.notLinked')}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('admin.plants.claimStatus')}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{selectedPlant.ownershipStatus || selectedPlant.claimCodeStatus || t('admin.unknown')}</p>
                    </div>
                  </div>
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
