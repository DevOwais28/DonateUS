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
      {/* Public routes (blocked when logged in) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Auth related */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify/:token" element={<EmailVerification />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Public pages */}
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/receipt/:id" element={<Receipt />} />
      <Route path="/receipt" element={<Navigate to="/dashboard" replace />} />

      {/* User protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receipts"
        element={
          <ProtectedRoute>
            <Receipts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/campaigns/new"
        element={
          <ProtectedRoute adminOnly>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute adminOnly>
            <AdminDonations />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
