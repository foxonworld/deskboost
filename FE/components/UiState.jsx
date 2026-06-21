import React from 'react';
import { useI18n } from '../i18n';

const toneStyles = {
  error: 'border-red-100 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  success: 'border-primary/20 bg-primary/10 text-[#2E7D32] dark:border-primary/30 dark:bg-primary/15 dark:text-green-200',
  info: 'border-[#E4EEE6] bg-surface-light text-text-secondary dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300',
};

export const Spinner = ({ className = 'text-base' }) => (
  <span className={`material-symbols-outlined animate-spin ${className}`} aria-hidden="true">progress_activity</span>
);

export const StateNotice = ({ children, tone = 'info', className = '', role }) => (
  <div role={role || (tone === 'error' ? 'alert' : 'status')} className={`rounded-2xl border px-5 py-4 text-sm font-semibold leading-6 ${toneStyles[tone] || toneStyles.info} ${className}`}>
    {children}
  </div>
);

const glassStateClass = "bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]";

export const LoadingState = ({ message }) => {
  const { t } = useI18n();
  const shownMessage = message || t('common.loading');

  return (
    <div role="status" className={`rounded-[2rem] p-12 text-center flex flex-col items-center justify-center gap-4 ${glassStateClass}`}>
      <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
        <Spinner className="text-3xl" />
      </div>
      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
        {shownMessage}
      </span>
    </div>
  );
};

export const EmptyState = ({ icon = 'potted_plant', title, description, action }) => {
  const { t } = useI18n();
  const shownTitle = title || t('common.emptyTitle');

  return (
    <div className={`rounded-[2rem] p-12 text-center flex flex-col items-center ${glassStateClass}`}>
      <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shadow-inner mb-6">
        <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{shownTitle}</p>
      {description && <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-8 w-full max-w-xs">{action}</div>}
    </div>
  );
};

export const formControlClass = 'w-full rounded-xl border-[#E4EEE6] px-4 text-sm font-medium text-text-main focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#2A4532] dark:bg-surface-dark dark:text-white';

export const primaryButtonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';
