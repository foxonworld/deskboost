import React from 'react';

const variantClasses = {
  default: 'border-[#E4EEE6] bg-surface-light shadow-sm dark:border-[#2A4532] dark:bg-surface-dark',
  elevated: 'border-[#E4EEE6] bg-surface-light shadow-lg shadow-primary/5 dark:border-[#2A4532] dark:bg-surface-dark dark:shadow-none',
  subtle: 'border-[#E4EEE6] bg-white/70 shadow-sm dark:border-[#2A4532] dark:bg-white/5',
};

const paddingClasses = {
  none: '',
  compact: 'p-4',
  default: 'p-5',
  feature: 'p-6',
};

const radiusClasses = {
  lg: 'rounded-2xl',
  hero: 'rounded-3xl',
};

export const Card = ({ as: Component = 'div', variant = 'default', padding = 'default', radius = 'lg', interactive = false, className = '', children, ...props }) => (
  <Component
    className={`border ${variantClasses[variant] || variantClasses.default} ${paddingClasses[padding] ?? paddingClasses.default} ${radiusClasses[radius] || radiusClasses.lg} ${interactive ? 'transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10' : ''} ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export default Card;
