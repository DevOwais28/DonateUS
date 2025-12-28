import React from 'react';

export default function ThemeLayout({ children, className = '' }) {
  return (
    <div
      className={
        `min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 ${className}`
      }
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_15%_10%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(800px_circle_at_85%_0%,rgba(30,64,175,0.18),transparent_55%),radial-gradient(900px_circle_at_50%_100%,rgba(14,165,233,0.12),transparent_55%)] md:fixed" />
      {children}
    </div>
  );
}
