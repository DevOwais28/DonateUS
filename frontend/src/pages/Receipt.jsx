import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../api.js';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import { useAppStore } from '../lib/store.js';

export default function Receipt() {
  const { id } = useParams();
  const user = useAppStore((s) => s.user);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchDonation = async () => {
      try {
        console.log('Fetching receipt for donation ID:', id);
        const res = await apiRequest('GET', `donations/donation/${id}`);
        console.log('Receipt response:', res.data);
        setDonation(res.data);
      } catch (err) {
        console.error('Receipt fetch error:', err);
        console.error('Error response:', err.response);
        setError(err?.response?.data?.message || 'Receipt not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const status = donation?.status || 'Pending';
  const isVerified = status === 'Verified';

  // Auto-print when component mounts
  useEffect(() => {
    if (donation && !loading && !error) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        // Create a clean print window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Donation Receipt #${donation._id}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #000;
                background: #fff;
                padding: 40px;
                line-height: 1.6;
                margin: 0;
              }
              h1, h2, h3, p, span, div, strong {
                color: #000 !important;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
              }
              .header {
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                font-size: 28px;
                margin-bottom: 5px;
              }
              .header p {
                font-size: 14px;
                color: #000;
              }
              .receipt-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
              }
              .receipt-info div {
                text-align: right;
              }
              .receipt-info p {
                margin: 5px 0;
                font-size: 14px;
              }
              .section {
                margin-bottom: 30px;
              }
              .section h2 {
                font-size: 18px;
                margin-bottom: 15px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
              }
              .section h3 {
                font-size: 16px;
                margin-bottom: 10px;
              }
              .section p {
                margin: 8px 0;
                font-size: 14px;
              }
              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
              }
              .donor-info {
                background: #f8f8f8;
                padding: 20px;
                border-radius: 5px;
                border: 1px solid #ddd;
              }
              .donor-info p {
                margin: 5px 0;
              }
              .status {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
                background-color: ${isVerified ? '#d4edda' : '#fff3cd'};
                color: ${isVerified ? '#155724' : '#856404'};
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                text-align: center;
                font-size: 14px;
                color: #000;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
              }
              @media print {
                body {
                  padding: 20px;
                  color: #000 !important;
                  background: #fff !important;
                }
                * {
                  color: #000 !important;
                  background: #fff !important;
                }
                @page {
                  margin: 0.5in;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Donation Receipt</h1>
                <p>Thank you for your generous contribution</p>
              </div>

              <div class="receipt-info">
                <div>
                  <p><strong>Receipt Number:</strong> ${donation._id}</p>
                  <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span class="status">${isVerified ? 'Verified' : 'Pending'}</span></p>
                </div>
              </div>

              <div class="section">
                <h2>Donation Details</h2>
                <div class="grid">
                  <div>
                    <h3>Campaign Information</h3>
                    <p><strong>Campaign:</strong> ${donation.campaignTitle}</p>
                    <p><strong>Donation Type:</strong> ${donation.donationType}</p>
                    <p><strong>Category:</strong> ${donation.category}</p>
                  </div>
                  <div>
                    <h3>Payment Information</h3>
                    <p><strong>Amount:</strong> <span class="amount">$${donation.amount.toFixed(2)}</span></p>
                    <p><strong>Payment Method:</strong> ${donation.paymentMethod}</p>
                    <p><strong>Transaction Date:</strong> ${new Date(donation.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3>Donor Information</h3>
                <div class="donor-info">
                  <p><strong>${donation.donorName}</strong></p>
                  <p>${donation.donorEmail}</p>
                </div>
              </div>

              <div class="footer">
                <p>Thank you for your generous support!</p>
                <p>This receipt confirms your donation to our organization.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to fully load, then trigger print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [donation, loading, error]);

  // Print styles with proper text colors
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #receipt-print, #receipt-print * {
        visibility: visible;
        color: #000000 !important;
        background: #ffffff !important;
      }
      #receipt-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        max-width: 100%;
        padding: 20px;
        color: #000000 !important;
        background: #ffffff !important;
      }
      #receipt-print * {
        color: #000000 !important;
        background: transparent !important;
        border-color: #e2e8f0 !important;
      }
      #receipt-print h1,
      #receipt-print h2,
      #receipt-print h3 {
        color: #000000 !important;
      }
      #receipt-print p,
      #receipt-print span,
      #receipt-print div {
        color: #000000 !important;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: auto;
        margin: 0.5in;
      }
    }
  `;

  if (loading) {
    return (
      <ThemeLayout className="px-4 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-300">Loading receipt...</p>
        </div>
      </ThemeLayout>
    );
  }

  if (error) {
    return (
      <ThemeLayout className="px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6 text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <Link to="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </ThemeLayout>
    );
  }

  return (
    <ThemeLayout className="px-4 py-10">
      <style>{printStyles}</style>
      <div className="mx-auto max-w-2xl">
        <div id="receipt-print" className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-black">Donation Receipt</h1>
                <p className="text-sm sm:text-base text-black">Thank you for your generous contribution</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-black break-all">Receipt #: {donation?._id}</p>
                <p className="text-xs sm:text-sm text-black">Date: {new Date(donation?.createdAt).toLocaleDateString()}</p>
                <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-black mb-3 sm:mb-4">Donation Details</h2>
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-6">
              <div>
                <h3 className="font-medium text-black mb-2">Campaign Information</h3>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base text-black break-words"><span className="font-medium">Campaign:</span> {donation?.campaignTitle}</p>
                  <p className="text-sm sm:text-base text-black"><span className="font-medium">Donation Type:</span> {donation?.donationType}</p>
                  <p className="text-sm sm:text-base text-black"><span className="font-medium">Category:</span> {donation?.category}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-black mb-2">Payment Information</h3>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base text-black"><span className="font-medium">Amount:</span> <span className="text-lg sm:text-xl font-bold">${donation?.amount?.toFixed(2)}</span></p>
                  <p className="text-sm sm:text-base text-black"><span className="font-medium">Payment Method:</span> {donation?.paymentMethod}</p>
                  <p className="text-sm sm:text-base text-black break-words"><span className="font-medium">Transaction Date:</span> {new Date(donation?.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-medium text-black mb-2">Donor Information</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded">
              <p className="font-medium text-black text-sm sm:text-base break-words">{donation?.donorName}</p>
              <p className="text-sm sm:text-base text-black break-words">{donation?.donorEmail}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 sm:pt-6 mt-6 sm:mt-8">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 no-print text-sm sm:text-base"
              >
                Print Receipt
              </button>
              <div className="text-xs sm:text-sm text-black text-center sm:text-left">
                <p>Thank you for your generous support!</p>
                <p>This receipt confirms your donation to our organization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
