import React from 'react';
import { cn } from '../lib/cn';

const styles = {
  base: 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
  verified: 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20',
  pending: 'bg-amber-300/10 text-amber-200 ring-amber-300/25',
  neutral: 'bg-white/5 text-slate-200 ring-white/10',
};

export default function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span className={cn(styles.base, styles[tone], className)} {...props}>
      {children}
    </span>
  );
}
