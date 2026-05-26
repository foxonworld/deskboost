import React from 'react';

const toneClasses = {
  neutral: 'border-[#E4EEE6] bg-surface-light text-text-secondary dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300',
  primary: 'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-green-200',
  success: 'border-primary/20 bg-primary/10 text-[#2E7D32] dark:border-primary/30 dark:bg-primary/15 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  danger: 'border-red-100 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300',
  overlay: 'border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/60 dark:text-green-200',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export const Badge = ({ tone = 'neutral', size = 'sm', icon, className = '', children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold leading-none ${toneClasses[tone] || toneClasses.neutral} ${sizeClasses[size] || sizeClasses.sm} ${className}`}>
    {icon && <span className="material-symbols-outlined text-[1.1em]" aria-hidden="true">{icon}</span>}
    {children}
  </span>
);

export const Chip = ({ active = false, icon, className = '', children, ...props }) => (
  <button
    type="button"
    className={`inline-flex min-h-10 flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 ${
      active
        ? 'border-primary bg-primary text-white shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark'
        : 'border-[#E4EEE6] bg-surface-light text-text-secondary hover:border-primary/50 hover:text-primary dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-200'
    } ${className}`}
    {...props}
  >
    {icon && <span className="material-symbols-outlined text-[18px]" aria-hidden="true">{icon}</span>}
    {children}
  </button>
);

export default Badge;
