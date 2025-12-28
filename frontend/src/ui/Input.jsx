import React from 'react';
import { cn } from '../lib/cn';

export default function Input({ label, hint, error, className, inputClassName, ...props }) {
  return (
    <label className={cn('block', className)}>
      {label ? <span className="mb-1.5 block text-sm font-semibold text-slate-100">{label}</span> : null}
      <input
        className={cn(
          'h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-slate-100 ring-1 ring-white/10 outline-none transition placeholder:text-slate-400 focus:bg-white/7 focus:ring-2 focus:ring-emerald-400/70',
          error ? 'ring-rose-500 focus:ring-rose-500' : '',
          inputClassName
        )}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-300">{error}</span> : null}
      {!error && hint ? <span className="mt-1.5 block text-xs text-slate-300">{hint}</span> : null}
    </label>
  );
}
