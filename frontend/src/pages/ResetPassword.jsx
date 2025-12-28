import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import { apiRequest } from '../api.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link');
      return;
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to reset password with token:', token);
      console.log('New password length:', password.length);
      
      const res = await apiRequest('POST', `users/reset-password/${token}`, { newPassword: password });
      console.log('Reset password response:', res.data);
      
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Reset password error:', err);
      console.error('Error response:', err?.response?.data);
      console.error('Error status:', err?.response?.status);
      console.error('Error message:', err?.response?.data?.message);
      console.error('Full error:', JSON.stringify(err, null, 2));
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <ThemeLayout className="px-4 py-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-md flex-col items-center min-h-[60vh]">
            <Card className="w-full p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-500/20">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h1>
                <p className="text-slate-300 mb-6">{error}</p>
                <Button 
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold"
                >
                  Request New Reset Link
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </ThemeLayout>
    );
  }

  if (success) {
    return (
      <ThemeLayout className="px-4 py-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-md flex-col items-center min-h-[60vh]">
            <Card className="w-full p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-500/20">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Password Reset Successfully!</h1>
                <p className="text-slate-300 mb-6">Your password has been updated. You can now login with your new password.</p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold"
                >
                  Go to Login
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </ThemeLayout>
    );
  }

  return (
    <ThemeLayout className="px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur lg:col-span-5 lg:block">
            <div className="absolute inset-0">
              <div className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-sky-500/12 blur-3xl" />
            </div>

            <div className="relative">
              <div className="text-3xl font-semibold tracking-tight text-white">Reset Password</div>
              <p className="mt-3 max-w-md text-sm text-slate-300">
                Enter your new password to secure your account.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Strong password</div>
                  <div className="mt-1 text-xs text-slate-300">Use at least 6 characters with letters and numbers.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Secure process</div>
                  <div className="mt-1 text-xs text-slate-300">Your password is encrypted and stored securely.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mx-auto flex w-full max-w-md flex-col items-center">
              <Card className="w-full p-6 sm:p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="text-2xl font-bold text-white mb-2">Create New Password</div>
                <div className="text-sm text-slate-300">Enter your new password below</div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="Enter new password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                    <Input 
                      type="password" 
                      placeholder="Confirm new password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting Password...
                      </span>
                    ) : 'Reset Password'}
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                      ← Back to Login
                    </Link>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
