import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api.js';
import { useAppStore } from '../lib/store.js';
import Modal from '../ui/Modal';

const formatMoney = (n) => `$${n.toLocaleString()}`;

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState({});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState('Zakat');
  const [category, setCategory] = useState('General Relief');
  const [payment, setPayment] = useState('Card');
  const [donationLoading, setDonationLoading] = useState(false);
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);

  const presets = [25, 50, 100, 250];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log('Fetching featured campaigns...');
        const res = await apiRequest('GET', 'campaigns');
        console.log('Campaigns response:', res.data);
        const campaignData = res.data?.slice(0, 3) || [];
        console.log('Setting campaigns:', campaignData);
        setCampaigns(campaignData); // Show only first 3 campaigns
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonate = (campaign) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelected(campaign);
    setOpen(true);
  };

  const handleConfirmDonation = async () => {
    if (!user || !selected) return;
    
    setDonationLoading(true);
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
      setDonationLoading(false);
    }
  };

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
            {console.log('Rendering campaigns:', campaigns.length)}
            {campaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100));
              const isLoaded = Boolean(loaded[c._id]);
              console.log('Rendering campaign:', c.title, 'with button');
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
                      {console.log('Featured campaigns - User:', user, 'Campaign:', c.title)}
                      {user ? (
                        <button
                          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200 rounded-lg px-4 py-3 text-sm"
                          onClick={() => {
                            console.log('Featured campaigns - Donate button clicked for campaign:', c.title);
                            handleDonate(c);
                          }}
                        >
                          Donate Now
                        </button>
                      ) : (
                        <div className="text-center text-sm text-slate-400">
                          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                            Login to donate
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </div>
      
      {/* Donation Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm your donation"
        description="Focused flow: amount • type • category • payment"
      >
        <div className="grid gap-5">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-slate-300">Campaign</div>
            <div className="mt-1 text-sm font-semibold text-slate-100">{selected?.title || 'No campaign selected'}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-300">Amount</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`h-10 rounded-2xl px-4 text-sm font-semibold ring-1 transition ${
                    amount === p
                      ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 ring-transparent'
                      : 'bg-white/5 text-slate-100 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  ${p}
                </button>
              ))}
              <div className="flex items-center gap-2 rounded-2xl px-4 ring-1 ring-white/10 bg-white/5">
                <span className="text-sm font-semibold text-slate-300">$</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="h-10 w-24 bg-transparent text-sm font-semibold text-slate-100 outline-none"
                  inputMode="numeric"
                  min="1"
                  max="100000"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">Donation type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl bg-white/5 px-3 py-2 text-slate-100 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-emerald-400"
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
              You're donating <span className="font-semibold text-slate-100">${amount}</span> as{' '}
              <span className="font-semibold text-slate-100">{type}</span>.
            </div>
            <Button
              onClick={handleConfirmDonation}
              disabled={donationLoading || amount < 1}
            >
              {donationLoading ? 'Processing...' : 'Confirm Donation'}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default FeaturedCampaigns;
