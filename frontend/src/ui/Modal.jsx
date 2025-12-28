import React, { useEffect } from 'react';
import { cn } from '../lib/cn';

export default function Modal({ open, title, description, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto flex min-h-full max-w-2xl items-center px-4 py-10">
        <div className={cn('w-full rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.70)] backdrop-blur')}> 
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <div className="text-base font-semibold text-slate-100">{title}</div>
              {description ? <div className="mt-1 text-sm text-slate-300">{description}</div> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-300 hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
