import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { apiRequest } from '../api.js';
import { useAppStore } from '../lib/store.js';

export default function CreateCampaignModal({ open, onClose }) {
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    goal: '',
    image: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: 10000,
    category: 'General Relief',
    image: ''
  });

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Campaign title is required';
        } else if (value.trim().length < 3) {
          error = 'Title must be at least 3 characters long';
        } else if (value.trim().length > 100) {
          error = 'Title must be less than 100 characters';
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters long';
        } else if (value.trim().length > 1000) {
          error = 'Description must be less than 1000 characters';
        }
        break;
        
      case 'goal':
        const goalAmount = Number(value);
        if (!value || goalAmount <= 0) {
          error = 'Goal amount is required';
        } else if (goalAmount < 100) {
          error = 'Minimum goal amount is $100';
        } else if (goalAmount > 1000000) {
          error = 'Maximum goal amount is $1,000,000';
        }
        break;
        
      case 'image':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          error = 'Please enter a valid URL';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      goal: validateField('goal', formData.goal),
      image: validateField('image', formData.image)
    };

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description && !newErrors.goal && !newErrors.image;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiRequest('POST', 'campaigns/campaign', formData);
      onClose();
      window.location.reload(); // Refresh to show new campaign
    } catch (err) {
      console.error('Failed to create campaign:', err);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Campaign Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none transition ${
              errors.title 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-white/10 focus:border-emerald-500'
            }`}
            placeholder="Enter campaign title"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none resize-none transition ${
              errors.description 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-white/10 focus:border-emerald-500'
            }`}
            placeholder="Describe your campaign"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Goal Amount ($)
            </label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              min="100"
              max="1000000"
              className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none transition ${
                errors.goal 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              }`}
            />
            {errors.goal && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.goal}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/5 border px-3 py-2 text-slate-100 focus:outline-none transition border-white/10 focus:border-emerald-500"
            >
              <option value="General Relief">General Relief</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Emergency">Emergency</option>
              <option value="Water">Water</option>
              <option value="Food">Food</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none transition ${
              errors.image 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-white/10 focus:border-emerald-500'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.image}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !!errors.title || !!errors.description || !!errors.goal || !!errors.image}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
