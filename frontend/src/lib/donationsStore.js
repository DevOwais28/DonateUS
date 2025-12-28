const STORAGE_KEY = 'dz_donations_v1';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function getDonations() {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY) || '[]', []);
}

export function saveDonations(donations) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
}

export function createDonation(payload) {
  const donations = getDonations();
  const donation = {
    id: `don_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    donorName: payload.donorName || 'User',
    donorEmail: payload.donorEmail || 'user@example.com',
    amount: Number(payload.amount || 0),
    donationType: payload.donationType || 'General',
    category: payload.category || 'General Relief',
    paymentMethod: payload.paymentMethod || 'Card',
    campaignId: payload.campaignId || 'unknown',
    campaignTitle: payload.campaignTitle || 'Unknown Campaign',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  saveDonations([donation, ...donations]);
  return donation;
}

export function getDonationById(id) {
  const donations = getDonations();
  return donations.find((d) => d.id === id) || null;
}

export function setDonationStatus(id, status) {
  const donations = getDonations();
  const updated = donations.map((d) => (d.id === id ? { ...d, status } : d));
  saveDonations(updated);
  return updated.find((d) => d.id === id) || null;
}
