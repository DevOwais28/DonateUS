import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';

const ImpactStats = () => {
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsCount: 0,
    verifiedCount: 0,
    donorsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch donations and campaigns
        const [donationsRes, campaignsRes] = await Promise.all([
          apiRequest('GET', 'donations/public'),
          apiRequest('GET', 'campaigns')
        ]);
        
        const donations = donationsRes.data || [];
        const campaigns = campaignsRes.data || [];
        
        // Calculate stats
        const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const campaignsCount = campaigns.length;
        const verifiedCount = donations.filter(d => d.status === 'Verified').length;
        const donorsCount = new Set(donations.map(d => d.donorEmail)).size;
        
        setStats({
          totalDonated,
          campaignsCount,
          verifiedCount,
          donorsCount
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsDisplay = [
    { label: 'Total donated', value: loading ? '...' : `$${(stats.totalDonated / 1000000).toFixed(1)}M+` },
    { label: 'Donors', value: loading ? '...' : `${(stats.donorsCount / 1000).toFixed(0)}K+` },
    { label: 'Campaigns', value: loading ? '...' : stats.campaignsCount },
    { label: 'Verified', value: loading ? '...' : stats.verifiedCount },
  ];

  return (
    <section id="impact" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur sm:p-10">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/12 blur-3xl" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Trust through transparency</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Your giving, measurable and verified.</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                We show you where funds go, when donations are verified, and how communities benefit.
              </p>
            </div>
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition"
            >
              View campaigns
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsDisplay.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold tracking-tight text-slate-100">{s.value}</p>
                <p className="mt-1 text-sm text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
