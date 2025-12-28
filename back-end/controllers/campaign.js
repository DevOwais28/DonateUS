import Campaign from "../models/campaign.js";
import Donation from "../models/donation.js";
import mongoose from "mongoose";

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create campaigns.' });
    }

    const { title, description, targetAmount, category, status } = req.body;
    
    // Get image URL from Cloudinary (uploaded by multer-storage-cloudinary)
    const imageUrl = req.file ? req.file.path : '';

    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'title and targetAmount are required.' });
    }

    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      category,
      status,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Campaign created", campaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCampaignDonors = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const isOwner = campaign.createdBy?.toString() === req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view donors for this campaign.' });
    }

    const donations = await Donation.find({ campaignId: id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      campaignId: id,
      donors: donations.map((d) => ({
        id: d._id,
        amount: d.amount,
        paymentMethod: d.paymentMethod,
        transactionId: d.transactionId,
        createdAt: d.createdAt,
        donor: d.userId,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    console.log('Fetching all campaigns...');
    console.log('Database connected:', mongoose.connection.readyState === 1 ? 'Yes' : 'No');
    
    const campaigns = await Campaign.find().populate("createdBy").sort({ createdAt: -1 });
    
    // Recalculate collected amounts from donations (include both Pending and Verified)
    for (const campaign of campaigns) {
      const Donation = await import("../models/donation.js").then(m => m.default);
      const donations = await Donation.find({ 
        campaignId: campaign._id.toString(), 
        status: { $in: ['Pending', 'Verified'] }
      });
      const totalCollected = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      
      console.log(`Campaign "${campaign.title}": current collected=${campaign.collectedAmount}, calculated=${totalCollected}`);
      
      // Force update to ensure consistency
      await Campaign.findByIdAndUpdate(campaign._id, { collectedAmount: totalCollected });
      console.log(`Updated campaign "${campaign.title}" to collectedAmount: ${totalCollected}`);
    }
    
    const updatedCampaigns = await Campaign.find().populate("createdBy").sort({ createdAt: -1 });
    console.log('Found campaigns:', updatedCampaigns.length);
    
    res.status(200).json(updatedCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id).populate("createdBy");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    res.status(200).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const campaign = await Campaign.findByIdAndUpdate(id, updatedData, { new: true });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    res.status(200).json({ message: "Campaign updated", campaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    res.status(200).json({ message: "Campaign deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
