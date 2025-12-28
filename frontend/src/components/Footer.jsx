import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 ring-1 ring-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                  <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M10.2 11.7h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M12 9.9v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-100">DonateUS</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-slate-300">
              A premium, trustworthy donation experience built for transparency, dignity, and impact.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">Explore</div>
              <div className="mt-3 space-y-2 text-sm">
                <a href="#campaigns" className="block text-slate-300 hover:text-white transition">Campaigns</a>
                <a href="#impact" className="block text-slate-300 hover:text-white transition">Impact</a>
                <a href="#how" className="block text-slate-300 hover:text-white transition">How it works</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Trust</div>
              <div className="mt-3 space-y-2 text-sm">
                <a href="#faq" className="block text-slate-300 hover:text-white transition">Verification</a>
                <a href="#faq" className="block text-slate-300 hover:text-white transition">Receipts</a>
                <a href="#faq" className="block text-slate-300 hover:text-white transition">Transparency</a>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Get started</div>
              <div className="mt-3 space-y-2 text-sm">
                <a href="#donate" className="block text-slate-300 hover:text-white transition">Donate</a>
                <a href="#campaigns" className="block text-slate-300 hover:text-white transition">Browse</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} DonateUS. All rights reserved.</p>
          <p className="text-xs text-slate-400">Built with premium micro-interactions and calm, humanitarian design.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
