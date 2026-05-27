import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';
import { getMyPlant } from '../services/plantApi';
import { useI18n } from '../i18n';

const PlantProfile = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getMyPlant(id);
        if (alive) setPlant(res?.data || res);
      } catch (err) {
        const fallback = MY_PLANTS.find(p => p.id === id) || null;
        if (alive) {
          setPlant(fallback);
          setError(fallback ? (err?.message || t('plantProfile.fallbackError')) : t('plantProfile.notFoundError'));
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [id, t]);

  return (
    <UserLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <Link to="/app/my-plants" className="text-sm font-bold text-[#4CAF50] hover:underline">{t('plantProfile.back')}</Link>
        {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">{error}</div>}
        {isLoading ? (
          <div className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center font-black text-slate-500">{t('plantProfile.loading')}</div>
        ) : !plant ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
            <p className="text-xl font-black text-slate-700 dark:text-white">{t('plantProfile.notFound')}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <img src={plant.image || plant.imageUrl} alt={plant.nickname || plant.name} className="w-full aspect-square object-cover rounded-[28px]" />
              <div className="space-y-6">
                <div><h1 className="text-4xl font-black text-slate-900 dark:text-white">{plant.nickname || plant.name}</h1><p className="text-[#4CAF50] font-black uppercase tracking-widest mt-2">{plant.species}</p></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{plant.notes || t('plantProfile.notesFallback')}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.light')}</p><p className="font-bold">{plant.light || t('common.nA')}</p></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.water')}</p><p className="font-bold">{plant.water || t('common.nA')}</p></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.status')}</p><p className="font-bold">{plant.status || t('common.nA')}</p></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">{t('plantProfile.nextWatering')}</p><p className="font-bold">{plant.nextWatering || t('common.nA')}</p></div>
                </div>
                <Link to="/app/ai-analysis" className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-[#4CAF50] text-white font-black uppercase tracking-widest">{t('plantProfile.bioScan')}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default PlantProfile;
