import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Progress from '../ui/Progress';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { apiRequest } from '../api.js';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import Navbar from '../components/Navbar.jsx';
import { useAppStore } from '../lib/store.js';

function formatMoney(n) {
  if (n === undefined || n === null || isNaN(n)) {
    return '$0';
  }
  return `$${Number(n).toLocaleString()}`;
}

export default function Campaigns() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const role = useAppStore((state) => state.role);
  const [open, setOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState('Zakat');
  const [category, setCategory] = useState('General Relief');
  const [payment, setPayment] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [errors, setErrors] = useState({
    amount: '',
    campaign: ''
  });
  const [notification, setNotification] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const updateCampaignStatus = async (campaignId, newStatus) => {
    try {
      await apiRequest('PUT', `campaigns/campaign/${campaignId}`, { status: newStatus });
      // Refresh campaigns
      const campaignsRes = await apiRequest('GET', 'campaigns');
      setCampaigns(campaignsRes.data || []);
      showNotification(`Campaign status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error('Failed to update campaign status:', err);
      showNotification('Failed to update campaign status', 'error');
    }
  };

  const validateDonation = () => {
    const newErrors = {
      amount: '',
      campaign: ''
    };

    // Validate campaign selection
    if (!selected) {
      newErrors.campaign = 'Please select a campaign to donate to';
    }

    // Validate amount
    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    } else if (amount < 1) {
      newErrors.amount = 'Minimum donation amount is $1';
    } else if (amount > 100000) {
      newErrors.amount = 'Maximum donation amount is $100,000';
    }

    setErrors(newErrors);
    return !newErrors.amount && !newErrors.campaign;
  };

  const handleAmountChange = (value) => {
    const numValue = Number(value || 0);
    setAmount(numValue);
    
    // Clear amount error when user changes the value
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const presets = useMemo(() => [25, 50, 100, 250], []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log('Fetching campaigns from frontend...');
        
        // Test the campaigns API first
        try {
          const testRes = await apiRequest('GET', 'campaigns/test');
          console.log('Test endpoint response:', testRes.data);
        } catch (testErr) {
          console.error('Test endpoint failed:', testErr);
        }
        
        // Now try the actual campaigns endpoint
        const res = await apiRequest('GET', 'campaigns');
        console.log('Full response:', res);
        console.log('Response data:', res.data);
        console.log('Response status:', res.status);
        setCampaigns(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelected(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        console.error('Error response:', err.response);
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <ThemeLayout>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-emerald-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified campaigns
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">Choose a cause to support</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Every campaign includes a clear goal, live progress tracking, and transparent donation tracking.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge tone="verified">Transparent</Badge>
          </div>
        </div>

        {campaignsLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center py-16">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"></div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-300">Loading campaigns...</p>
            <p className="mt-1 text-xs text-slate-400">Fetching the latest verified campaigns</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">No campaigns available</h3>
            <p className="mt-2 text-sm text-slate-400">Check back later for new campaigns to support</p>
            {user?.role === 'admin' && (
              <Link to="/admin/campaigns/new">
                <button className="mt-6 px-4 py-2 bg-white/5 text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 transition-colors gap-2 inline-flex items-center">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Campaign
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {campaigns.map((c) => {
              const collected = Number(c.collectedAmount) || 0;
              const target = Number(c.targetAmount) || 1;
              const pct = Math.min(100, (collected / target) * 100);
              const displayPct = pct < 1 ? pct.toFixed(1) : Math.round(pct);
              return (
                <Card key={c._id} className="group border border-white/10 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={c.imageUrl || 'https://splash.com/photo-1509099836664-375ba776d393?auto=format&fit=crop&w=1400&q=70'} 
                      alt={c.title} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-emerald-500 px-2 sm:px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                      <svg className="mr-1 h-3 w-3 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">{c.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-3">{c.description}</p>
                      
                      <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-white/5 px-2 sm:px-3 py-2">
                          <span className="text-xs font-medium text-slate-400">Goal</span>
                          <span className="text-xs sm:text-sm font-bold text-white">{formatMoney(c.targetAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-2 sm:px-3 py-2">
                          <span className="text-xs font-medium text-emerald-300">Raised</span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-300">{formatMoney(c.collectedAmount || 0)}</span>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-400">Progress</span>
                          <span className="text-xs font-bold text-emerald-300">{displayPct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 border-t border-white/10 pt-4">
                      {role === 'admin' ? (
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-2">Campaign Status</label>
                          <select
                            value={c.status}
                            onChange={(e) => updateCampaignStatus(c._id, e.target.value)}
                            className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400/70"
                          >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      ) : user ? (
                        <button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            if (c.status !== 'Active' && c.status !== 'Completed') {
                              showNotification(`Cannot donate to ${c.status.toLowerCase()} campaign`, 'error');
                              return;
                            }
                            setSelected(c);
                            setOpen(true);
                          }}
                          disabled={c.status !== 'Active'}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {c.status === 'Active' ? 'Donate Now' : `${c.status} - No Donations`}
                          </span>
                        </button>
                      ) : (
                        <div className="text-center text-xs sm:text-sm text-slate-400">
                          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                            Login to donate
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm your donation"
        description="Focused flow: amount • type • category • payment"
      >
        <div className="grid gap-5">
          <div className={`rounded-2xl bg-white/5 p-4 ring-1 ${errors.campaign ? 'ring-red-500/20 bg-red-500/5' : 'ring-white/10'}`}>
            <div className="text-xs font-semibold text-slate-300">Campaign</div>
            <div className="mt-1 text-sm font-semibold text-slate-100">{selected?.title || 'No campaign selected'}</div>
            {errors.campaign && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.campaign}
              </p>
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-300">Amount</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handleAmountChange(p)}
                  className={`h-10 rounded-2xl px-4 text-sm font-semibold ring-1 transition ${
                    amount === p
                      ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 ring-transparent'
                      : 'bg-white/5 text-slate-100 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  ${p}
                </button>
              ))}
              <div className={`flex items-center gap-2 rounded-2xl px-4 ring-1 transition ${
                errors.amount ? 'ring-red-500/20 bg-red-500/5' : 'ring-white/10 bg-white/5'
              }`}>
                <span className="text-sm font-semibold text-slate-300">$</span>
                <input
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-10 w-24 bg-transparent text-sm font-semibold text-slate-100 outline-none"
                  inputMode="numeric"
                  min="1"
                  max="100000"
                />
              </div>
            </div>
            {errors.amount && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">Donation type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400/70"
              >
                {['Zakat', 'Sadqah', 'Fitra', 'General'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Category</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400/70"
              >
                {['General Relief', 'Food', 'Education', 'Medical'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Payment</div>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm font-semibold text-slate-100 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400/70"
              >
                {['Card', 'Bank Transfer', 'Wallet'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div className="text-sm text-slate-300">
              You’re donating <span className="font-semibold text-slate-100">${amount}</span> as{' '}
              <span className="font-semibold text-slate-100">{type}</span>.
            </div>
            <button
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (!user) {
                  navigate('/login');
                  return;
                }

                // Validate donation before processing
                if (!validateDonation()) {
                  return;
                }
                
                setLoading(true);
                try {
                  const res = await apiRequest('POST', 'donations/donation', {
                    amount,
                    donationType: type,
                    category,
                    paymentMethod: payment,
                    campaignId: selected._id,
                    campaignTitle: selected.title,
                    donorName: user.name,
                    donorEmail: user.email,
                  });

                  setOpen(false);
                  navigate(`/receipt/${res.data.donation._id}`);
                } catch (err) {
                  console.error('Donation failed:', err);
                  alert('Donation failed. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !!errors.amount || !!errors.campaign}
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </div>
      </Modal>
    </ThemeLayout>
  );
}


