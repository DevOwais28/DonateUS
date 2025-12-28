import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api.js';
import { useAppStore } from '../lib/store.js';
import { sendVerificationEmail } from '../services/emailService.js';
import Button from '../ui/Button';
import ThemeLayout from '../layout/ThemeLayout.jsx';
import Card from '../ui/Card';
import Input from '../ui/Input';

export default function Signup() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGmail, setIsGmail] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Pakistan phone number validation regex
  const validatePakistanPhone = (phone) => {
    if (!phone) return true; // Optional field
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Pakistan phone formats:
    // 0345-2899485, 03452899485 (mobile)
    // +923452899485, 00923452899485 (international)
    const pakistanPhoneRegex = /^(?:\+92|0092|0)?3[0-9]{2}[0-9]{7}$/;
    
    return pakistanPhoneRegex.test(cleanPhone);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 03XX-XXXXXXX
    if (cleaned.length <= 11) {
      if (cleaned.length <= 4) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
    }
    
    return cleaned.slice(0, 11);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Name should only contain letters and spaces';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
          error = 'Only Gmail accounts are allowed';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;
        
      case 'phone':
        if (value && !validatePakistanPhone(value)) {
          error = 'Please enter a valid Pakistan phone number (e.g., 0300-1234567)';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
    
    const error = validateField('phone', formattedPhone);
    setErrors(prev => ({ ...prev, phone: error }));
  };

  // Check if email is Gmail
  const checkGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    setIsGmail(gmailRegex.test(email));
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    checkGmail(emailValue);
    
    const error = validateField('email', emailValue);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    setName(nameValue);
    
    const error = validateField('name', nameValue);
    setErrors(prev => ({ ...prev, name: error }));
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    
    const error = validateField('password', passwordValue);
    setErrors(prev => ({ ...prev, password: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all fields
    const nameError = validateField('name', name);
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const phoneError = validateField('phone', phone);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      phone: phoneError
    });

    // If any validation errors exist, stop submission
    if (nameError || emailError || passwordError || phoneError) {
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with:', { name, email, phone: phone || 'Not provided' });
      const res = await apiRequest('POST', 'users/signup', { name, email, password, phone });
      console.log('Signup response:', res.data);
      
      // Get the verification token from backend response
      const verificationToken = res.data.verificationToken || 'default-token';
      
      console.log('Verification token from backend:', verificationToken);

      // Send verification email using secure service
      const emailSent = await sendVerificationEmail(email, verificationToken);
      
      if (emailSent) {
        console.log('Verification email sent successfully to:', email);
      } else {
        console.error('Failed to send verification email to:', email);
      }

      // Redirect to login with verification message
      navigate('/login', { 
        state: { 
          message: `Account created! Verification email sent to ${email}. Please check your inbox (including spam folder).`,
          type: 'verification'
        }
      });
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err?.response?.data);
      
      // Provide more specific error messages
      if (err?.response?.status === 400) {
        if (err?.response?.data?.message?.includes('already exists')) {
          setError('An account with this email already exists. Try logging in instead.');
        } else {
          setError(err?.response?.data?.message || 'Invalid information provided.');
        }
      } else if (err?.response?.status === 500) {
        setError('Server error during signup. Please try again or contact support.');
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please check your information and try again.');
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
                  <div className="text-xs text-slate-300">Create your donor account</div>
                </div>
              </Link>

              <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white">Start giving with clarity</h1>
              <p className="mt-3 max-w-md text-sm text-slate-300">
                Join to support campaigns, track receipts, and see verification status.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Clean receipts</div>
                  <div className="mt-1 text-xs text-slate-300">All donations get a receipt with status.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Built for trust</div>
                  <div className="mt-1 text-xs text-slate-300">Designed to feel calm, premium, and transparent.</div>
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
                  <div className="text-xs text-slate-300">Create your donor account</div>
                </div>
              </Link>

              <Card className="w-full p-6 sm:p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                <div className="text-2xl font-bold text-white mb-2">Create Account</div>
                <div className="text-sm text-slate-300">Join our community of compassionate donors</div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <Input 
                      placeholder="Ayesha Khan" 
                      value={name} 
                      onChange={handleNameChange}
                      required
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address (Gmail only)</label>
                    <Input 
                      type="email" 
                      placeholder="yourname@gmail.com" 
                      value={email} 
                      onChange={handleEmailChange} 
                      required
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all ${
                        errors.email || (email && !isGmail)
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.email ? (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    ) : email && !isGmail ? (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Only Gmail accounts are allowed
                      </p>
                    ) : email && isGmail ? (
                      <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Gmail address verified
                      </p>
                    ) : null}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number (Optional)</label>
                    <Input 
                      type="tel" 
                      placeholder="0300-1234567" 
                      value={phone} 
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                    {phone && !errors.phone && (
                      <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Valid Pakistan phone number
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={handlePasswordChange}
                      required
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all ${
                        errors.password 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                    {password && !errors.password && (
                      <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Password meets requirements
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200" 
                    type="submit" 
                    disabled={loading || !isGmail || !!errors.name || !!errors.email || !!errors.password || !!errors.phone}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : 'Create Account'}
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
                    href="https://donateus-production.up.railway.app/api/auth/google"
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
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                      Sign in
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
