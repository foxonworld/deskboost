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

export const LoadingState = ({ message }) => {
  const { t } = useI18n();
  const shownMessage = message || t('common.loading');

  return (
    <div role="status" className="rounded-3xl border border-[#E4EEE6] bg-surface-light p-8 text-center text-sm font-semibold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300">
      <span className="inline-flex items-center justify-center gap-2">
        <Spinner />
        {shownMessage}
      </span>
    </div>
  );
};

export const EmptyState = ({ icon = 'potted_plant', title, description, action }) => {
  const { t } = useI18n();
  const shownTitle = title || t('common.emptyTitle');

  return (
    <div className="rounded-3xl border border-dashed border-[#E4EEE6] p-8 text-center dark:border-[#2A4532]">
      <span className="material-symbols-outlined text-5xl text-text-secondary/50 dark:text-slate-500" aria-hidden="true">{icon}</span>
      <p className="mt-3 text-lg font-bold text-text-main dark:text-slate-100">{shownTitle}</p>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-text-secondary dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export const formControlClass = 'w-full rounded-xl border-[#E4EEE6] px-4 text-sm font-medium text-text-main focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#2A4532] dark:bg-surface-dark dark:text-white';

export const primaryButtonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';
