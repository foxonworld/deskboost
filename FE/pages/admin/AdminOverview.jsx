import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminSummary } from '../../services/adminApi';
import { useI18n } from '../../i18n';

const cards = [
  { key: 'users', labelKey: 'admin.overview.card.users', icon: 'group', noteKey: 'admin.overview.card.usersNote' },
  { key: 'userPlants', labelKey: 'admin.overview.card.userPlants', icon: 'potted_plant', noteKey: 'admin.overview.card.userPlantsNote' },
  { key: 'marketplacePlants', labelKey: 'admin.overview.card.marketplace', icon: 'storefront', noteKey: 'admin.overview.card.marketplaceNote' },
  { key: 'aiDialogs', labelKey: 'admin.overview.card.aiDialogs', icon: 'smart_toy', noteKey: 'admin.overview.card.aiDialogsNote' },
];

const AdminOverview = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      setSummary(null);
      try {
        const data = await getAdminSummary();
        const hasSummaryFields = cards.every((card) => Object.prototype.hasOwnProperty.call(data || {}, card.key));
        if (!hasSummaryFields) throw new Error(t('admin.overview.error.incomplete'));
        if (active) setSummary(data);
      } catch (err) {
        if (active) setError(err?.message || t('admin.overview.error.load'));
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [t]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.overview.badge')}</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.overview.title')}</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            {t('admin.overview.description')}
          </p>
          {error && (
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              {t('admin.overview.error.backend')}
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            cards.map((card) => (
              <article key={card.key} className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              </article>
            ))
          ) : error || !summary ? (
            <article className="rounded-[28px] border border-dashed border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:col-span-2 xl:col-span-4">
              {t('admin.overview.emptyMetrics')}
            </article>
          ) : (
            cards.map((card) => (
              <article key={card.key} className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-2xl bg-[#4CAF50]/10 p-3 text-[#4CAF50]">
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-400">{t('admin.overview.phase')}</span>
                </div>
                <h2 className="mt-4 text-sm font-black uppercase tracking-widest text-slate-400">{t(card.labelKey)}</h2>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{summary[card.key]}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{t(card.noteKey)}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
