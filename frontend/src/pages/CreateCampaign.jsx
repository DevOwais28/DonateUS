import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../layout/AppShell';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { apiRequest } from '../api.js';
import { useAppStore } from '../lib/store.js';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('General Relief');
  const [status, setStatus] = useState('Active');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const uploadImage = async (file) => {
    // For now, return a placeholder URL
    // In production, you'd upload to a service like Cloudinary or AWS S3
    return `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('targetAmount', Number(goal));
      formData.append('category', category);
      formData.append('status', status);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = useAppStore.getState().token;
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/campaigns/campaign', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Create Campaign" sidebarVariant="admin">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
          <p className="mt-2 text-slate-300">Launch a new fundraising campaign to support your cause</p>
        </div>

        <Card className="p-6 sm:p-8 border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Campaign Title</span>
                  <Input 
                    placeholder="Ramadan Food Parcels 2024" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Campaign Description</span>
                  <textarea
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                    rows={5}
                    placeholder="Describe the purpose, beneficiaries, and how funds will be used. Be specific and compelling to encourage donations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Goal Amount (USD)</span>
                  <Input 
                    type="number"
                    placeholder="150000" 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value)} 
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <p className="mt-1 text-xs text-slate-400">Set a realistic fundraising goal</p>
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="General Relief">General Relief</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Water">Water</option>
                    <option value="Food">Food</option>
                    <option value="Orphans">Orphans</option>
                    <option value="Ramadan">Ramadan</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Campaign Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block">
                  <span className="block text-sm font-semibold text-white mb-2">Campaign Image</span>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex h-12 items-center justify-between rounded-lg border border-dashed border-white/20 bg-white/5 px-4 cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-sm text-slate-300">
                          {imageFile ? imageFile.name : 'Choose an image file'}
                        </span>
                        <span className="text-xs font-medium text-emerald-300">Browse Files</span>
                      </div>
                    </div>
                    
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Campaign preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400">
                      Recommended: High-quality image (1200x600px). Max size: 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-sky-600 hover:shadow-emerald-500/40 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Campaign...
                  </span>
                ) : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
