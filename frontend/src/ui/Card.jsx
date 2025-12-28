import React from 'react';
import { cn } from '../lib/cn';

export default function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
