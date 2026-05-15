import React from 'react';

const toneStyles = {
  error: 'border-red-100 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  success: 'border-[#A5D6A7] bg-[#F0FDF4] text-[#2E7D32] dark:border-[#2E7D32]/40 dark:bg-[#2E7D32]/20 dark:text-[#A5D6A7]',
  info: 'border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

export const Spinner = ({ className = 'text-base' }) => (
  <span className={`material-symbols-outlined animate-spin ${className}`} aria-hidden="true">progress_activity</span>
);

export const StateNotice = ({ children, tone = 'info', className = '', role }) => (
  <div role={role || (tone === 'error' ? 'alert' : 'status')} className={`rounded-2xl border px-5 py-4 text-sm font-bold ${toneStyles[tone] || toneStyles.info} ${className}`}>
    {children}
  </div>
);

export const LoadingState = ({ message = 'Loading...' }) => (
  <div role="status" className="rounded-[28px] border border-slate-100 bg-white p-10 text-center text-sm font-black text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
    <span className="inline-flex items-center justify-center gap-2">
      <Spinner />
      {message}
    </span>
  </div>
);

export const EmptyState = ({ icon = 'potted_plant', title = 'No data found', description, action }) => (
  <div className="rounded-[28px] border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
    <span className="material-symbols-outlined text-5xl text-slate-300" aria-hidden="true">{icon}</span>
    <p className="mt-3 text-lg font-black text-slate-700 dark:text-slate-100">{title}</p>
    {description && <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const formControlClass = 'w-full rounded-xl border-gray-200 px-4 text-sm font-medium focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

export const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white transition-all shadow-md shadow-primary/20 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60';
