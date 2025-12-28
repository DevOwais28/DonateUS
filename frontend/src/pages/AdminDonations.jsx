import React, { useEffect, useState } from 'react';
import AppShell from '../layout/AppShell';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { apiRequest } from '../api.js';

export default function AdminDonations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await apiRequest('GET', 'donations/donation');
        setRows(res.data || []);
        setFilteredRows(res.data || []);
      } catch (err) {
        console.error('Failed to fetch donations:', err);
        setRows([]);
        setFilteredRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRows(rows);
    } else {
      // Case-insensitive comparison to handle "Pending" vs "pending"
      setFilteredRows(rows.filter(r => r.status?.toLowerCase() === filterStatus.toLowerCase()));
    }
  }, [filterStatus, rows]);

  const updateStatus = async (id, newStatus) => {
    if (!id) {
      console.error('Invalid donation ID:', id);
      alert('Invalid donation ID');
      return;
    }

    try {
      await apiRequest('PUT', `donations/donation/${id}`, { status: newStatus });
      // Refresh the list
      const res = await apiRequest('GET', 'donations/donation');
      setRows(res.data || []);
      
      // Apply current filter to fresh data
      if (filterStatus === 'all') {
        setFilteredRows(res.data || []);
      } else {
        setFilteredRows((res.data || []).filter(r => r.status?.toLowerCase() === filterStatus.toLowerCase()));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <AppShell title="Donations Management" sidebarVariant="admin">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Donations Management</h1>
              <p className="mt-1 text-slate-300">Review and verify donation transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="text-slate-400">Total: </span>
                <span className="font-bold text-white">{rows.length}</span>
                <span className="text-slate-400 ml-2">Pending: </span>
                <span className="font-bold text-yellow-300">{rows.filter(r => r.status === 'Pending').length}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">All Donations</h2>
                <p className="mt-1 text-sm text-slate-300">Update donation status to verify transactions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400 whitespace-nowrap">Status:</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors min-w-[120px]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all whitespace-nowrap">
                  Apply Filter
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-300">Loading donations...</p>
                <p className="mt-1 text-xs text-slate-400">Fetching donation records</p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">No donations found</h3>
                <p className="mt-2 text-sm text-slate-400">No donation records available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="py-3 pl-6 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Donor Information</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Donation Amount</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign Details</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Donation Date</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Status</th>
                        <th className="py-3 pl-4 pr-6 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRows.map((r) => (
                        <tr key={r._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pl-6 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-white truncate">
                                  {r.donorNote ? 'Deleted Account' : (r.donorName || 'Anonymous')}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                  {r.donorNote ? 'Account deleted' : (r.donorEmail || 'No email')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-bold text-white">${r.amount}</div>
                            <div className="text-xs text-slate-400">{r.paymentMethod}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-slate-300 truncate">{r.campaignTitle || 'General'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-slate-300">{new Date(r.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              r.status === 'Verified'
                                ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'
                                : 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20'
                            }`}>
                              <svg className={`mr-1 h-3 w-3 ${r.status === 'Verified' ? 'text-emerald-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                {r.status === 'Verified' ? (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                ) : (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                )}
                              </svg>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 pl-4 pr-6">
                            <select
                              value={r.status}
                              onChange={(e) => updateStatus(r._id, e.target.value)}
                              className="h-8 rounded-lg bg-white/5 border border-white/10 px-3 text-xs font-semibold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all w-full"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-4 lg:hidden">
                  {filteredRows.map((r) => (
                    <div key={r._id} className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              {r.donorNote ? 'Deleted Account' : (r.donorName || 'Anonymous')}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {r.donorNote ? 'Account deleted' : (r.donorEmail || 'No email')}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Amount</span>
                          <span className="text-sm font-bold text-white">${r.amount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Campaign</span>
                          <span className="text-sm text-slate-300">{r.campaignTitle || 'General'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Date</span>
                          <span className="text-sm text-slate-300">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 block mb-2">Update Status</label>
                          <select
                            value={r.status}
                            onChange={(e) => updateStatus(r._id, e.target.value)}
                            className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm font-semibold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
