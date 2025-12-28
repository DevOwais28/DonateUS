import React from 'react';
import { cn } from '../lib/cn';

export default function Progress({ value = 0, className }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-2 rounded-full bg-white/10', className)}>
      <div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
