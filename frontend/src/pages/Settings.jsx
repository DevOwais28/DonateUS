import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../layout/AppShell';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAppStore } from '../lib/store.js';
import { apiRequest } from '../api.js';
import ProfileAvatar from '../components/ProfileAvatar.jsx';

export default function Settings() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const clearUser = useAppStore((s) => s.clearUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Pakistan phone number validation
  const validatePakistanPhone = (phone) => {
    if (!phone) return true; // Optional field
    const cleanPhone = phone.replace(/\D/g, '');
    // Accept formats: 03452899485, 0345-2899485, +923452899485, 00923452899485
    const pakistanPhoneRegex = /^(?:\+92|0092|0)?3[0-9]{2}[0-9]{7}$/;
    return pakistanPhoneRegex.test(cleanPhone);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
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
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
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
  
  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiRequest('GET', 'users/me');
        if (res.success && res.user) {
          console.log('Fetched user data:', res.user);
          setUser(res.user, useAppStore.getState().token, res.user.role);
          
          // If user has GoogleId but no picture, manually set Google profile picture
          if (res.user.googleId && !res.user.picture && res.user.email) {
            // Try multiple Google profile picture URL formats
            const googleId = res.user.googleId;
            const possibleUrls = [
              `https://lh3.googleusercontent.com/a/${googleId}=s128-c`,
              `https://lh3.googleusercontent.com/a/${googleId}`,
              `https://lh3.googleusercontent.com/a/${googleId}?sz=128`,
              `https://lh3.googleusercontent.com/a/AGNmyxZ${googleId}=s128-c`
            ];
            
            // Use the first URL format
            const googlePictureUrl = possibleUrls[0];
            const updatedUser = { ...res.user, picture: googlePictureUrl };
            setUser(updatedUser, useAppStore.getState().token, updatedUser.role);
            console.log('Set Google profile picture:', googlePictureUrl);
            console.log('Google ID:', googleId);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    
    fetchUserData();
  }, [user, setUser]);
  
  // Check if user is from Google Auth
  const isGoogleAuth = user?.googleId || user?.provider === 'google';
  
  // Generate profile picture URL
  const profilePicture = user?.picture || (isGoogleAuth && `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4285f4&color=fff&size=128`);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate all fields
    const nameError = validateField('name', profileForm.name);
    const emailError = validateField('email', profileForm.email);
    const phoneError = validateField('phone', profileForm.phone);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError
    });

    // If any validation errors exist, stop submission
    if (nameError || emailError || phoneError) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest('PUT', 'users/profile', profileForm);
      setUser(res.data.user, useAppStore.getState().token, res.data.user.role);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await apiRequest('PUT', 'users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage('File must be an image');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:4000/api/users/profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${useAppStore.getState().token}`
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload profile picture');
      }

      setUser(data.user, useAppStore.getState().token, data.user.role);
      setMessage('Profile picture updated successfully!');
    } catch (err) {
      setMessage(err.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiRequest('DELETE', 'users/delete-account');
      clearUser();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      setMessage('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setProfileForm({ ...profileForm, phone: formattedPhone });
    
    const error = validateField('phone', formattedPhone);
    setErrors(prev => ({ ...prev, phone: error }));
  };

  return (
    <AppShell title="Settings" sidebarVariant="user">
      <div className="space-y-6">
        {message && (
          <div className={`p-4 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-300 border border-red-500/20'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-1 rounded-lg bg-white/5 p-1">
          {['profile', 'security', 'account'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100">Profile Information</h3>
              <p className="mt-1 text-sm text-slate-300">Update your personal information</p>
            </div>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <ProfileAvatar 
                    user={user} 
                    size="xl" 
                    className="ring-4 ring-white/10"
                  />
                  {isGoogleAuth && (
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {!isGoogleAuth && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                        id="profile-picture"
                      />
                      <label
                        htmlFor="profile-picture"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition"
                      >
                        Change Photo
                      </label>
                      <p className="mt-1 text-xs text-slate-400">JPG, PNG, GIF. Max 5MB</p>
                    </>
                  )}
                  {isGoogleAuth && (
                    <p className="text-sm text-slate-400">Profile synced with Google</p>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Input
                  label="Name"
                  value={profileForm.name}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, name: e.target.value });
                    const error = validateField('name', e.target.value);
                    setErrors(prev => ({ ...prev, name: error }));
                  }}
                  required
                  disabled={isGoogleAuth}
                  className={errors.name ? 'border-red-500' : ''}
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
                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, email: e.target.value });
                    const error = validateField('email', e.target.value);
                    setErrors(prev => ({ ...prev, email: error }));
                  }}
                  required
                  disabled={isGoogleAuth}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="0300-1234567"
                  value={profileForm.phone}
                  onChange={handlePhoneChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
                {profileForm.phone && !errors.phone && (
                  <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Valid Pakistan phone number
                  </p>
                )}
              </div>
              
              {isGoogleAuth && (
                <p className="text-sm text-slate-400">Name and email are managed through your Google account</p>
              )}
              
              {/* Show success/error message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('success') 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message}
                </div>
              )}
              
              <Button type="submit"  disabled={loading || isGoogleAuth || !!errors.name || !!errors.email || !!errors.phone}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100">Security</h3>
              <p className="mt-1 text-sm text-slate-300">Manage your password and security settings</p>
            </div>

            {isGoogleAuth ? (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-blue-300">Google Authentication</p>
                    <p className="text-sm text-blue-400">Your account is secured with Google authentication. Password management is handled through your Google account settings.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </Card>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100">Account Management</h3>
              <p className="mt-1 text-sm text-slate-300">Manage your account settings</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100">Account Type</h4>
                    <p className="text-sm text-slate-300 capitalize">{user?.role || 'User'}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium">
                    Active
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100">Authentication Method</h4>
                    <p className="text-sm text-slate-300">
                      {isGoogleAuth ? 'Google Account' : 'Email & Password'}
                    </p>
                  </div>
                  {isGoogleAuth && (
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100">Member Since</h4>
                    <p className="text-sm text-slate-300">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-100">Delete Account</h4>
                      <p className="text-sm text-slate-300">Permanently delete your account and data</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 text-sm font-medium text-red-300 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
            <div className="mx-4 max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
              <p className="text-sm text-slate-300 mb-4">
                Are you sure you want to delete your account? This action cannot be undone. Your donation history will be preserved for financial records.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}


