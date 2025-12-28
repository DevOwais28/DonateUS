import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Campaigns from './pages/Campaigns.jsx';
import Receipt from './pages/Receipt.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateCampaign from './pages/CreateCampaign.jsx';
import AdminDonations from './pages/AdminDonations.jsx';
import Settings from './pages/Settings.jsx';
import Receipts from './pages/Receipts.jsx';
import EmailVerification from './pages/EmailVerification.jsx';
import { useAppStore } from './lib/store.js';

function ProtectedRoute({ children, adminOnly = false }) {
  const token = useAppStore((s) => s.token);
  const role = useAppStore((s) => s.role);
  
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const token = useAppStore((s) => s.token);
  const role = useAppStore((s) => s.role);
  
  if (token) {
    // Redirect based on user role
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route key="landing" path="/" element={<Landing />} />
      <Route key="login" path="/login" element={<Login />} />
      <Route key="signup" path="/signup" element={<Signup />} />
      <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />
      <Route key="reset-password" path="/reset-password/:token" element={<ResetPassword />} />
      <Route key="verify" path="/verify/:token" element={<EmailVerification />} />
      <Route key="auth-callback" path="/auth/callback" element={<AuthCallback />} />

      <Route key="campaigns" path="/campaigns" element={<Campaigns />} />
      <Route key="receipt-detail" path="/receipt/:id" element={<Receipt />} />
      <Route key="receipt-redirect" path="/receipt" element={<Navigate to="/dashboard" replace />} />

      <Route key="dashboard" path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route key="receipts" path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
      <Route key="settings" path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route key="admin-dashboard" path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route key="admin-create-campaign" path="/admin/campaigns/new" element={<ProtectedRoute adminOnly><CreateCampaign /></ProtectedRoute>} />
      <Route key="admin-donations" path="/admin/donations" element={<ProtectedRoute adminOnly><AdminDonations /></ProtectedRoute>} />

      <Route key="catch-all" path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
