import React from 'react';
import { cn } from '../lib/cn';

const styles = {
  base: 'inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none',
  primary: 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-sm hover:opacity-95',
  secondary: 'bg-white/5 text-slate-100 ring-1 ring-white/10 hover:bg-white/10',
  ghost: 'bg-transparent text-slate-200 hover:bg-white/5',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  sm: 'h-9 px-3',
  md: 'h-11 px-4',
  lg: 'h-12 px-5 text-base',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  return <Comp className={cn(styles.base, styles[variant], styles[size], className)} {...props} />;
}
