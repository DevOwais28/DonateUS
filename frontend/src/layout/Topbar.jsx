import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAppStore } from '../lib/store.js';

export default function Topbar({ title, onMenu }) {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const role = useAppStore((s) => s.role);
  const clearUser = useAppStore((s) => s.clearUser);

  // Generate profile picture URL
  const isGoogleAuth = user?.googleId || user?.provider === 'google';
  const profilePicture = user?.picture || (isGoogleAuth && `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4285f4&color=fff&size=128`);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition lg:hidden"
          aria-label="Open sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-100">{title}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {user && (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
            {profilePicture && (
              <img
                src={profilePicture}
                alt={user.name}
                className="h-6 w-6 rounded-full object-cover"
                onError={(e) => {
                  console.log('Profile picture failed to load, using fallback');
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4285f4&color=fff&size=128`;
                }}
              />
            )}
            <div className="text-sm">
              <div className="font-semibold text-slate-100">{user.name}</div>
              <div className="text-xs text-slate-400 capitalize">{role}</div>
            </div>
          </div>
        )}
        <Link to="/campaigns">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto">Campaigns</Button>
        </Link>
      </div>
    </div>
  );
}
