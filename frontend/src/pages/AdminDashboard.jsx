import React, { useEffect, useState } from 'react';
import AppShell from '../layout/AppShell';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { apiRequest } from '../api.js';

const calculateDonationTrends = (donations) => {
  const trends = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const monthDonations = donations.filter(d => {
      const donationDate = new Date(d.createdAt);
      return donationDate >= monthDate && donationDate < nextMonthDate;
    });
    
    const totalAmount = monthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    trends.push({
      month: monthDate.toLocaleDateString('en', { month: 'short' }),
      amount: totalAmount,
      count: monthDonations.length
    });
  }
  
  return trends;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeCampaigns: 0,
    pendingVerifications: 0,
    donationTrends: []
  });
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch donations
        const donationsRes = await apiRequest('GET', 'donations/donation');
        const donations = donationsRes.data || [];
        
        // Fetch campaigns
        const campaignsRes = await apiRequest('GET', 'campaigns');
        const campaignsData = campaignsRes.data || [];
        setCampaigns(campaignsData);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(campaignsData.map(c => c.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Filter donations by selected category
        const filteredDonations = selectedCategory === 'All' 
          ? donations 
          : donations.filter(d => {
              const campaign = campaignsData.find(c => c._id === d.campaignId);
              return campaign && campaign.category === selectedCategory;
            });
        
        // Calculate stats
        const totalDonations = filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const activeCampaigns = campaignsData.filter(c => c.status === 'Active').length;
        const pendingVerifications = filteredDonations.filter(d => d.status === 'Pending').length;
        
        // Calculate donation trends (last 6 months)
        const donationTrends = calculateDonationTrends(filteredDonations);
        
        setStats({
          totalDonations,
          activeCampaigns,
          pendingVerifications,
          donationTrends
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedCategory]);

  return (
    <AppShell title="Admin Dashboard" sidebarVariant="admin">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-slate-300">Manage campaigns and monitor donations</p>
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800 text-white">
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
                <div className="mt-3 text-3xl font-bold text-white">
                  ${loading ? '...' : stats.totalDonations.toLocaleString()}
                </div>
                <p className="mt-1 text-xs text-slate-400">All time contributions</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-400">Active Campaigns</div>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">
                  {loading ? '...' : stats.activeCampaigns}
                </div>
                <p className="mt-1 text-xs text-slate-400">Live fundraising campaigns</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-slate-400">Pending Verifications</div>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">
                  {loading ? '...' : stats.pendingVerifications}
                </div>
                <p className="mt-1 text-xs text-slate-400">Awaiting admin approval</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns by Category */}
        <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Campaigns by Category</h2>
            <p className="mt-1 text-sm text-slate-300">
              {selectedCategory === 'All' ? 'All campaigns' : `Campaigns in "${selectedCategory}" category`}
            </p>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-8 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : campaigns.filter(c => selectedCategory === 'All' || c.category === selectedCategory).length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns
                  .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
                  .map(campaign => (
                    <div key={campaign._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white text-sm leading-tight">{campaign.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' :
                          campaign.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          campaign.status === 'Completed' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{campaign.description || 'No description'}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Category</span>
                          <span className="text-xs font-medium text-slate-200">{campaign.category || 'General'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className="text-xs font-medium text-emerald-400">
                            ${campaign.collectedAmount?.toLocaleString() || 0} / ${campaign.targetAmount?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-sky-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(Math.max((campaign.collectedAmount / campaign.targetAmount) * 100 || 0, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">No campaigns found</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {selectedCategory === 'All' ? 'No campaigns available' : `No campaigns in "${selectedCategory}" category`}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Donation Trends */}
        <Card className="p-6 border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Donation Trends</h2>
            <p className="mt-1 text-sm text-slate-300">Monthly donation amounts for the last 6 months</p>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-6">
                {[42, 55, 38, 70, 61, 80].map((h, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex h-32 items-end rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 w-full">
                      <div className="w-full rounded-xl bg-gradient-to-t from-emerald-500 to-sky-500 animate-pulse" style={{ height: `${h}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Loading...</div>
                  </div>
                ))}
              </div>
            ) : stats.donationTrends.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-6">
                {stats.donationTrends.map((trend, i) => {
                  const maxAmount = Math.max(...stats.donationTrends.map(t => t.amount));
                  const height = maxAmount > 0 ? (trend.amount / maxAmount) * 80 : 5;
                  return (
                    <div key={i} className="flex flex-col items-center group">
                      <div className="flex h-32 items-end rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 w-full group-hover:bg-white/10 transition-colors">
                        <div 
                          className="w-full rounded-xl bg-gradient-to-t from-emerald-500 to-sky-500 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-sky-400" 
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${trend.month}: $${trend.amount.toLocaleString()} (${trend.count} donations)`}
                        />
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-400">{trend.month}</div>
                      <div className="text-xs text-slate-500">${(trend.amount / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-slate-600">{trend.count} donations</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">No donation data</h3>
                <p className="mt-2 text-sm text-slate-400">No donations found for the selected period</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
