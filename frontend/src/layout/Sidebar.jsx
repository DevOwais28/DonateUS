import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';
import { useAppStore } from '../lib/store.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/receipts', label: 'Receipts' },
  { to: '/settings', label: 'Settings' },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard' },
  { to: '/admin/campaigns/new', label: 'Create Campaign' },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar({ variant = 'user', onNavigate }) {
  const links = variant === 'admin' ? adminLinks : userLinks;
  const navigate = useNavigate();
  const clearUser = useAppStore((s) => s.clearUser);
  const user = useAppStore((s) => s.user);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex items-center gap-3 px-2 pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 ring-1 ring-white/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
            <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M10.2 11.7h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 9.9v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <div className="text-sm font-bold text-slate-100">DonateUS</div>
          <div className="text-xs text-slate-400">{variant === 'admin' ? 'Admin' : 'User'} Panel</div>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'block rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-500/5 to-sky-500/5 p-4 ring-1 ring-emerald-500/20">
        <div className="flex items-center gap-3 mb-3">
          <ProfileAvatar 
            user={user} 
            size="sm" 
            className="ring-1 ring-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <div className="text-xs text-slate-300">
          {variant === 'admin' ? 'Administrator' : 'Donor'} Account
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-sky-500/5 p-3 ring-1 ring-emerald-500/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
              <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-xs font-semibold text-emerald-300">Secure Platform</div>
        </div>
        <div className="text-xs text-slate-400">All donations are verified and tracked with transparent receipts.</div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-center text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
      >
        Logout
      </button>
    </div>
  );
}
