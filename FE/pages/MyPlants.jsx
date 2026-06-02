import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { getMyPlants } from '../services/plantApi';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';

const normalizeItems = (res) => (Array.isArray(res) ? res : res?.items || res?.data || []);

const MyPlants = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useI18n();

  const tabs = [
    { value: 'All', labelKey: 'myPlants.tab.all' },
    { value: 'healthy', labelKey: 'myPlants.tab.healthy' },
    { value: 'needs-water', labelKey: 'myPlants.tab.needsWater' },
    { value: 'issue', labelKey: 'myPlants.tab.issue' },
  ];
  const getStatusLabel = (status = 'healthy') => {
    const value = String(status || 'healthy');
    const key = `myPlants.status.${value.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`;
    const label = t(key);
    return label === key ? value.replace('-', ' ') : label;
  };

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getMyPlants();
        const items = normalizeItems(res);
        if (alive) setPlants(items);
      } catch (err) {
        if (alive) {
          setPlants([]);
          setError(err?.message || t('myPlants.fallbackError'));
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [t]);

  const filteredPlants = useMemo(() => plants.filter(plant =>
    (activeTab === 'All' || plant.status === activeTab) &&
    (`${plant.nickname || ''} ${plant.species || ''}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [plants, activeTab, searchTerm]);

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('myPlants.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              {t('myPlants.summary', { count: plants.length })}
            </p>
          </div>
          <Link to="/app/add-plant" className="flex items-center justify-center gap-3 bg-[#4CAF50] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined font-bold">add</span>
            {t('myPlants.addNew')}
          </Link>
        </div>

        {error && <StateNotice tone="warning">{error}</StateNotice>}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`whitespace-nowrap px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.value ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>{t(tab.labelKey)}</button>
            ))}
          </div>
          <div className="relative w-full lg:w-auto lg:min-w-[320px] group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#4CAF50] transition-colors">search</span>
            <input type="text" placeholder={t('myPlants.search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#4CAF50]/5 focus:border-[#4CAF50] transition-all outline-none" />
          </div>
        </div>

        {isLoading ? (
          <LoadingState message={t('common.loading')} />
        ) : filteredPlants.length === 0 ? (
          <EmptyState title={t('myPlants.emptyTitle')} description={t('myPlants.emptyDescription')} action={<Link to="/app/add-plant" className="inline-flex px-6 py-3 rounded-2xl bg-[#4CAF50] text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/20">{t('myPlants.addPlant')}</Link>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
            {filteredPlants.map(plant => (
              <div key={plant.id} className="group flex flex-col rounded-[32px] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="relative aspect-[5/4] w-full overflow-hidden">
                  <div className="absolute top-4 right-4 z-10"><span className="inline-flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border text-[#4CAF50] border-[#A5D6A7]">{getStatusLabel(plant.status)}</span></div>
                  <img src={plant.image || plant.imageUrl} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={plant.nickname || plant.name} />
                </div>
                <div className="flex flex-col p-8 gap-6 flex-1">
                  <div><h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{plant.nickname || plant.name}</h3><p className="text-xs text-[#4CAF50] font-black uppercase tracking-widest mt-1.5">{plant.species}</p></div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{plant.notes || t('myPlants.notesFallback')}</p>
                  <Link to={`/app/my-plants/${plant.id}/profile`} className="mt-auto w-full h-14 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">{t('myPlants.inspection')}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyPlants;
