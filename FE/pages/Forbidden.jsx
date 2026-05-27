import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const Forbidden = () => {
  const { t } = useI18n();

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#F7F9F8] dark:bg-[#10221f] px-4 py-8">
    <div className="w-full max-w-md rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 sm:p-8 text-center shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#4CAF50]/10 text-[#4CAF50]">
        <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('forbidden.area')}</p>
      <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('forbidden.title')}</h1>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
        {t('forbidden.description')}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/app/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-[#4CAF50] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-[1.02]">
          {t('forbidden.dashboard')}
        </Link>
        <Link to="/" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:border-[#4CAF50] hover:text-[#4CAF50]">
          {t('forbidden.home')}
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Forbidden;
