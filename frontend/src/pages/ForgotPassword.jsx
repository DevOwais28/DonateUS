import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import { apiRequest } from '../api.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Call backend forgot password API
      const res = await apiRequest('POST', 'users/forgot-password', { email });
      console.log('Forgot password response:', res.data);
      
      // Send password reset email using secure service
      const resetToken = res.data.token || 'default-reset-token';
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (emailSent) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                    <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M10.2 11.7h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 9.9v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-base font-semibold tracking-tight text-slate-100">DonationZakat System</div>
                  <div className="text-xs text-slate-300">Password recovery</div>
                </div>
              </Link>

              <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white">Reset your password</h1>
              <p className="mt-3 max-w-md text-sm text-slate-300">
                No worries! We'll send you instructions to reset your password and get you back to your account.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Quick recovery</div>
                  <div className="mt-1 text-xs text-slate-300">Enter your email and we'll handle the rest.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Secure process</div>
                  <div className="mt-1 text-xs text-slate-300">Password reset links are valid for 24 hours.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mx-auto flex w-full max-w-md flex-col items-center">
              <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                    <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M10.2 11.7h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 9.9v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-slate-100">DonationZakat System</div>
                  <div className="text-xs text-slate-300">Password recovery</div>
                </div>
              </Link>

              <Card className="w-full p-6 sm:p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="text-2xl font-bold text-white mb-2">Forgot Password?</div>
                <div className="text-sm text-slate-300">We'll send you a link to reset your password</div>

                {success ? (
                  <div className="mt-8 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-300">Reset link sent!</h3>
                        <p className="text-xs text-emerald-200 mt-1">Check your email for password reset instructions.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
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
                          Sending Reset Link...
                        </span>
                      ) : 'Send Reset Link'}
                    </Button>

                    <div className="text-center">
                      <Link to="/login" className="text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                        ← Back to Login
                      </Link>
                    </div>
                  </form>
                )}
              </Card>

              <div className="mt-6 text-center text-xs text-slate-400">
                Need help? Contact support at ra930453@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
