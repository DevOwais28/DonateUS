import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../lib/store.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

const Navbar = () => {
  const location = useLocation();
  const token = useAppStore((s) => s.token);
  const user = useAppStore((s) => s.user);
  const role = useAppStore((s) => s.role);
  const clearUser = useAppStore((s) => s.clearUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isCampaignsPage = location.pathname === '/campaigns';
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/admin';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 ${isScrolled ? 'backdrop-blur-none md:backdrop-blur bg-slate-950/60 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] ring-1 ring-white/10' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="#top" className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                    <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M10.2 11.7h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 9.9v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-lg font-semibold tracking-tight text-slate-100">DonateUS</span>
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isCampaignsPage && token ? (
                <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              ) : !token ? (
                <>
                  <a href="#campaigns" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">Campaigns</a>
                  <a href="#how" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</a>
                  <a href="#impact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">Impact</a>
                  <a href="#faq" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">Trust</a>
                </>
              ) : null}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            {token && !isDashboardPage ? (
              <>
                <Link to="/settings" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  <span className="hidden md:inline">{user?.name || 'Profile'}</span>
                </Link>
              </>
            ) : token && isDashboardPage ? (
              <div className="flex items-center gap-2">
                <ProfileAvatar user={user} />
              </div>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200">
                  Login
                </Link>
                <Link to="/signup" className="rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200">
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-none md:backdrop-blur p-2 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)]">
          <div className="space-y-1">
            {token ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">Dashboard</Link>
                <Link to="/settings" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">Profile</Link>
              </>
            ) : (
              <>
                <a href="#campaigns" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">Campaigns</a>
                <a href="#how" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">How it works</a>
                <a href="#impact" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">Impact</a>
                <a href="#faq" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5">Trust</a>
              </>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {token ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/10 transition-all duration-200">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  {user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={() => clearUser()}
                  className="rounded-lg bg-red-500/10 px-3 py-2.5 text-center text-sm font-medium text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/20 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/10 transition-all duration-200">Login</Link>
                <Link to="/signup" className="rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
