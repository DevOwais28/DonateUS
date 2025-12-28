import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import { useAppStore } from '../lib/store.js';
import { apiRequest } from '../api.js';
import { sendVerificationEmail } from '../services/emailService.js';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const token = useAppStore((s) => s.token);
  const role = useAppStore((s) => s.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();

  // Handle signup success message
  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === 'verification') {
        setRequiresVerification(true);
        setError(location.state.message);
      } else {
        setError(location.state.message);
      }
      // Clear the state to prevent showing message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Store verification link if provided
  const verificationLink = location.state?.verificationLink;

  // Redirect if already logged in
  React.useEffect(() => {
    if (token) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [token, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Clear only invalid auth items, not all localStorage
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        // Ignore localStorage errors
      }
      
      const res = await apiRequest('POST', 'users/login', { email, password });
      console.log('Login response:', res.data);
      const { token, user } = res.data;
      const role = user?.role || 'user';
      setUser(user, token, role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle verification requirement
      if (err?.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        setUserEmail(err?.response?.data?.email || email);
        setError(err?.response?.data?.message || 'Please verify your email before logging in.');
      } else {
        setError(err?.response?.data?.message || 'Login failed');
      }
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
                  <div className="text-xs text-slate-300">Secure donor access</div>
                </div>
              </Link>

              <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
              <p className="mt-3 max-w-md text-sm text-slate-300">
                Sign in to track donations, receipts, and verification status.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Verification-first</div>
                  <div className="mt-1 text-xs text-slate-300">Pending → Verified receipts for transparency.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Private by default</div>
                  <div className="mt-1 text-xs text-slate-300">Calm UI, clear records, and secure access.</div>
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
                  <div className="text-sm font-semibold tracking-tight text-slate-100">DonateUS</div>
                  <div className="text-xs text-slate-300">Secure donor access</div>
                </div>
              </Link>

              <Card className="w-full p-6 sm:p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="text-2xl font-bold text-white mb-2">Welcome back</div>
                <div className="text-sm text-slate-300">Sign in to your account to continue</div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  {error && (
                    <div className={`p-3 rounded-lg border text-sm ${
                      requiresVerification 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
                        : 'bg-red-500/10 border-red-500/20 text-red-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        {requiresVerification ? (
                          <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div>
                          <p>{error}</p>
                          {requiresVerification && userEmail && (
                            <div className="mt-2 space-y-2">
                              <p className="text-xs opacity-90">Check your Gmail inbox for the verification email.</p>
                              
                              {/* Show verification link if available */}
                              {verificationLink && (
                                <div className="p-2 rounded bg-slate-800 border border-white/10">
                                  <p className="text-xs text-slate-400 mb-1">Verification Link:</p>
                                  <a 
                                    href={verificationLink} 
                                    className="text-xs text-emerald-400 hover:text-emerald-300 underline break-all"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {verificationLink}
                                  </a>
                                </div>
                              )}
                              
                              <button
                                onClick={async () => {
                                  try {
                                    // Call backend to get user's actual token
                                    const res = await apiRequest('POST', 'users/resend-verification', { email: userEmail });
                                    console.log('Resend response:', res.data);
                                    
                                    // Send verification email using secure service
                                    const emailSent = await sendVerificationEmail(userEmail, res.data.token);
                                    
                                    if (emailSent) {
                                      setError('Verification email resent! Please check your inbox (including spam folder).');
                                    } else {
                                      setError('Failed to send email. Please try again or check your spam folder.');
                                    }
                                  } catch (error) {
                                    console.error('Error resending verification email:', error);
                                    setError('Failed to resend verification email. Please try again.');
                                  }
                                }}
                                className="text-xs font-medium underline hover:no-underline"
                              >
                                Resend verification email
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-emerald-500/20 text-emerald-500 focus:ring-emerald-500/20" />
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

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
                        Signing in...
                      </span>
                    ) : 'Sign in'}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900 text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <a
                    href="http://localhost:4000/api/auth/google"
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 hover:bg-white/10 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </a>

                  <div className="text-center text-sm text-slate-300">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                      Sign up for free
                    </Link>
                  </div>
                </form>
              </Card>

              <div className="mt-6 text-center text-xs text-slate-400">
                By continuing you agree to transparent donation practices and secure processing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}
