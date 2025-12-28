import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../layout/AppShell';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';
import { useAppStore } from '../lib/store.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

export default function Dashboard() {
  const user = useAppStore((s) => s.user);
  const role = useAppStore((s) => s.role);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debug: Log user info
  console.log('Dashboard - User:', user);
  console.log('Dashboard - Role:', role);
  console.log('Dashboard - User isVerified:', user?.isVerified);
  console.log('Dashboard - User googleId:', user?.googleId);

  // Redirect admin to admin dashboard
  React.useEffect(() => {
    if (role === 'admin') {
      window.location.href = '/admin';
    }
  }, [role]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Fetch only current user's donations
        const res = await apiRequest('GET', 'donations/my-donations');
        setRows(res.data || []);
      } catch (err) {
        console.error('Failed to fetch donations:', err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const totalAmount = useMemo(() => rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0), [rows]);
  const campaignsSupported = useMemo(() => {
    const uniqueCampaigns = new Set(rows.map((r) => r.campaignId).filter(Boolean));
    return uniqueCampaigns.size;
  }, [rows]);
  const verifiedCount = useMemo(() => rows.filter((r) => r.status === 'Verified').length, [rows]);

  return (
    <AppShell title="User Dashboard" sidebarVariant="user">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <ProfileAvatar 
              name={user?.name} 
              picture={user?.picture} 
              size="xl" 
              className="ring-2 ring-white/20 shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome back, {user?.name}</h1>
              <p className="mt-1 text-sm text-slate-300">Track your donations and make a difference</p>
            </div>
            <Link to="/campaigns" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold shadow-lg">
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-400">Total Donations</div>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">${totalAmount.toLocaleString()}</div>
                <p className="mt-1 text-xs text-slate-400">Lifetime contribution</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-sky-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-400">Campaigns Supported</div>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">{campaignsSupported}</div>
                <p className="mt-1 text-xs text-slate-400">Different causes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-400">Verified Receipts</div>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">{verifiedCount}</div>
                <p className="mt-1 text-xs text-slate-400">Confirmed donations</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Donation History
                </h2>
                <p className="mt-1 text-sm text-slate-300">Track your generous contributions and download receipts</p>
              </div>
              <Link to="/campaigns" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="gap-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 w-full sm:w-auto">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Donation
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-emerald-500/20"></div>
              </div>
              <p className="mt-6 text-sm font-medium text-slate-300">Loading your donations...</p>
              <p className="mt-1 text-xs text-slate-400">Fetching your generous contributions</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gradient-to-br from-white/5 to-emerald-500/5 py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 ring-1 ring-emerald-500/30">
                <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">No donations yet</h3>
              <p className="mt-2 text-sm text-slate-400 text-center max-w-md">Start making a difference! Your first donation will appear here with full tracking and receipt generation.</p>
              <Link to="/campaigns" className="mt-8">
                <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 shadow-lg shadow-emerald-500/25">
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-slate-900/50 backdrop-blur-sm shadow-xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-800/30">
                      <th className="px-6 pb-6 pt-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 pb-6 pt-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 pb-6 pt-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 pb-6 pt-6 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 pb-6 pt-6 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rows.map((r, index) => (
                      <tr key={r._id} className="hover:bg-white/5 transition-all duration-300 group">
                        <td className="py-6 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-sky-500/10 flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all duration-300">
                              <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{r.campaignTitle}</div>
                              <div className="text-xs text-slate-400 mt-1">{r.donationType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="text-sm font-bold text-white">${r.amount}</div>
                        </td>
                        <td className="py-6">
                          <div className="text-sm text-slate-300">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-6">
                          <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                            r.status === 'Verified'
                              ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20 hover:bg-yellow-500/20'
                          }`}>
                            <svg className={`mr-2 h-3 w-3 ${r.status === 'Verified' ? 'text-emerald-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20">
                              {r.status === 'Verified' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              )}
                            </svg>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-6 pr-6">
                          <Link to={`/receipt/${r._id}`}>
                            <Button variant="secondary" size="sm" className="gap-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Receipt
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-6 lg:hidden">
                {rows.map((r, index) => (
                  <div key={r._id} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-sm p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-lg group">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-sky-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all duration-300">
                        <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{r.campaignTitle}</h3>
                        <p className="text-xs text-slate-400 mt-2">{r.donationType}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                        r.status === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20 hover:bg-yellow-500/20'
                      }`}>
                        <svg className={`mr-2 h-3 w-3 ${r.status === 'Verified' ? 'text-emerald-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          {r.status === 'Verified' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          )}
                        </svg>
                        {r.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-white">${r.amount}</div>
                        <div className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <Link to={`/receipt/${r._id}`} className="w-full sm:w-auto">
                        <Button variant="secondary" size="sm" className="gap-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 w-full sm:w-auto">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Receipt
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
