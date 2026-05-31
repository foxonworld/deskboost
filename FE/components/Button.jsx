import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from './UiState';

const variantClasses = {
  primary: 'bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-primary/20',
  secondary: 'border border-[#E4EEE6] bg-surface-light text-text-main hover:border-primary/40 hover:bg-primary/5 dark:border-[#2A4532] dark:bg-surface-dark dark:text-white dark:hover:bg-primary/10',
  ghost: 'text-text-secondary hover:bg-primary/10 hover:text-primary dark:text-slate-300',
  destructive: 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50',
  channel: 'text-white shadow-sm hover:shadow-lg',
};

const sizeClasses = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-6 text-base',
};

export const Button = ({
  as: Component = 'button',
  to,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const Element = to ? Link : href ? 'a' : Component;
  const elementProps = to ? { to } : href ? { href } : { type };

  return (
    <Element
      {...elementProps}
      aria-disabled={isDisabled || undefined}
      disabled={Element === 'button' ? isDisabled : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/25 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {loading && <Spinner className="text-base" />}
      {children}
    </Element>
  );
};

export default Button;
