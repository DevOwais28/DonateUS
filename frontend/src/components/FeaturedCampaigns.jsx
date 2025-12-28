import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';

const formatMoney = (n) => `$${n.toLocaleString()}`;

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await apiRequest('GET', 'campaigns');
        setCampaigns(res.data?.slice(0, 3) || []); // Show only first 3 campaigns
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section id="campaigns" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-300">Featured campaigns</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Give with confidence</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Clean summaries, visible progress, and a calm donation experience.
            </p>
          </div>
          <Link to="/campaigns" className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition">
            View all campaigns
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm animate-pulse"></div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">No campaigns yet</h3>
            <p className="mt-2 text-sm text-slate-400">Check back soon for featured campaigns</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100));
              const isLoaded = Boolean(loaded[c._id]);
            return (
              <article key={c._id} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="relative h-48 overflow-hidden sm:h-44">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                  {!isLoaded ? (
                    <div className="absolute inset-0 animate-pulse bg-white/5" />
                  ) : null}
                  <img
                    src={c.imageUrl || 'https://images.unsplash.com/photo-1509099836664-375ba776d393?auto=format&fit=crop&w=1200&q=70'}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() =>
                      setLoaded((prev) => ({
                        ...prev,
                        [c._id]: true,
                      }))
                    }
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isLoaded ? 'opacity-85' : 'opacity-0'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                    <svg className="mr-1 inline h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {c.category || 'General'}
                  </div>
                </div>

                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">{c.title}</h3>
                  
                  <div className="mt-4 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Raised</span>
                        <span className="font-bold text-white">{formatMoney(c.collectedAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Goal</span>
                        <span className="font-semibold text-slate-300">{formatMoney(c.targetAmount)}</span>
                      </div>

                      <div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Progress</span>
                          <span className="font-semibold text-emerald-300">{pct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <Link
                        to="/campaigns"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
