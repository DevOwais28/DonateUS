import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api.js';

const Hero = () => {
  const [featuredCampaign, setFeaturedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCampaign = async () => {
      try {
        console.log('Fetching featured campaign...');
        const res = await apiRequest('GET', 'campaigns');
        console.log('Campaigns response:', res.data);
        const campaigns = res.data || [];
        if (campaigns.length > 0) {
          console.log('Setting featured campaign:', campaigns[0]);
          setFeaturedCampaign(campaigns[0]); // Show first campaign
        } else {
          console.log('No campaigns found');
        }
      } catch (err) {
        console.error('Failed to fetch featured campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCampaign();
  }, []);
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-300/12 blur-3xl md:h-[520px] md:w-[520px] md:bg-emerald-300/25" />
        <div className="absolute -top-24 right-[-120px] h-[420px] w-[420px] rounded-full bg-blue-900/6 blur-3xl md:h-[520px] md:w-[520px] md:bg-blue-900/10" />
        <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-sky-300/10 blur-3xl md:h-[520px] md:w-[520px] md:bg-sky-300/18" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified giving • Clear receipts • Calm UX
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Give with <span className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">trust</span>.
              <span className="block text-slate-200">Make your giving count.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              A premium donation experience built for transparency and dignity—so generosity feels effortless and measurable.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#campaigns"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 hover:opacity-95 transition"
              >
                Donate now
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition"
              >
                How it works
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <a href="/login" className="font-semibold text-slate-200 hover:text-white">Login</a>
              <span className="text-slate-500">•</span>
              <a href="/signup" className="font-semibold text-emerald-300 hover:text-emerald-200">Create an account</a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">100%</div>
                <div className="mt-1 text-xs text-slate-300">Donation focused</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Receipts</div>
                <div className="mt-1 text-xs text-slate-300">Downloadable proof</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Fast</div>
                <div className="mt-1 text-xs text-slate-300">Verification flow</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />
              <div className="relative grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-semibold text-slate-300">Donation type</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Zakat', 'Sadaqah', 'Fitra', 'General'].map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">A clean, guided flow</div>
                  <div className="mt-1 text-xs text-slate-300">Designed to reduce friction and increase trust.</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Live campaign</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {loading ? 'Loading...' : featuredCampaign?.title || 'No campaigns available'}
                      </div>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                        <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-white/10">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" 
                        style={{ 
                          width: loading ? '0%' : featuredCampaign ? `${Math.min(100, Math.round((featuredCampaign.collectedAmount / featuredCampaign.targetAmount) * 100))}%` : '0%'
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-300">Raised</span>
                      <span className="font-semibold text-white">
                        {loading ? 'Loading...' : featuredCampaign ? `$${featuredCampaign.collectedAmount.toLocaleString()} / $${featuredCampaign.targetAmount.toLocaleString()}` : 'No data'}
                      </span>
                    </div>
                  </div>
                  <a href="#campaigns" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition">
                    View campaigns
                  </a>
                </div>
              </div>

              <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-white">Premium, trustworthy, humanitarian.</div>
                  <div className="text-xs text-slate-300">Unique spacing • subtle gradients • premium micro-interactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
