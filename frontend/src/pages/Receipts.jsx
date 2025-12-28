import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAppStore } from '../lib/store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ThemeLayout from '../layout/ThemeLayout';

export default function Receipts() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await apiRequest('GET', 'donations/my-donations');
        setDonations(res.data || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <ThemeLayout className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </ThemeLayout>
    );
  }

  return (
    <ThemeLayout className="px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Your Donation Receipts</h1>
          <p className="text-slate-400">View and print your donation receipts</p>
        </div>

        {donations.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-slate-400 mb-4">You don't have any donation receipts yet.</div>
            <Link to="/campaigns">
              <Button>Donate Now</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation._id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-100">{donation.campaignTitle}</div>
                    <div className="text-sm text-slate-400">
                      {formatDate(donation.createdAt)} • ${donation.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge tone={donation.status === 'Verified' ? 'verified' : 'pending'}>
                      {donation.status}
                    </Badge>
                    <a
                      href={`/receipt/${donation._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      View/Print
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ThemeLayout>
  );
}
