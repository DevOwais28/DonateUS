import Donation from "../models/donation.js";
import Campaign from "../models/campaign.js";

// Get public donations for stats (no auth required)
export const getPublicDonations = async (req, res) => {
  try {
    console.log('Fetching public donations for stats...');
    
    // If no donations exist, create sample data for testing
    const existingDonations = await Donation.find({});
    if (existingDonations.length === 0) {
      console.log('No donations found, creating sample donations...');
      const sampleDonations = [
        {
          donorName: 'Anonymous Donor',
          donorEmail: 'donor1@example.com',
          amount: 500,
          paymentMethod: 'Card',
          donationType: 'Zakat',
          category: 'General Relief',
          campaignId: 'sample-campaign-1',
          campaignTitle: 'Help Build Clean Water Wells',
          status: 'Verified'
        },
        {
          donorName: 'Community Supporter',
          donorEmail: 'donor2@example.com',
          amount: 250,
          paymentMethod: 'Bank',
          donationType: 'Sadaqah',
          category: 'Emergency Relief',
          campaignId: 'sample-campaign-1',
          campaignTitle: 'Help Build Clean Water Wells',
          status: 'Verified'
        },
        {
          donorName: 'Monthly Giver',
          donorEmail: 'donor3@example.com',
          amount: 1000,
          paymentMethod: 'JazzCash',
          donationType: 'General',
          category: 'General Relief',
          campaignId: 'sample-campaign-1',
          campaignTitle: 'Help Build Clean Water Wells',
          status: 'Pending'
        }
      ];
      
      await Donation.insertMany(sampleDonations);
      console.log('Sample donations created');
    }
    
    const donations = await Donation.find({})
      .select('amount status donorEmail createdAt')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${donations.length} public donations`);
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching public donations:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user's donations
export const getMyDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    console.log(`Fetching donations for user: ${userId}, email: ${userEmail}`);
    
    // Find donations by userId OR by email (for restored accounts where userId was unset)
    const donations = await Donation.find({
      $or: [
        { userId: userId },
        { userId: { $exists: false }, donorEmail: userEmail }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${donations.length} donations for user ${userId}`);
    console.log('User total amount:', donations.reduce((sum, d) => sum + (d.amount || 0), 0));
    console.log('User campaigns supported:', [...new Set(donations.map(d => d.campaignId))].length);
    
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    console.log('Creating donation with data:', req.body);
    console.log('User from request:', req.user);
    
    const { 
      campaignId, 
      amount, 
      paymentMethod, 
      donationType, 
      category, 
      campaignTitle, 
      donorName, 
      donorEmail 
    } = req.body;

    if (!campaignId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'campaignId, amount, paymentMethod are required.' });
    }

    const donation = await Donation.create({
      userId: req.user?.id,
      campaignId,
      campaignTitle,
      amount: Number(amount),
      paymentMethod,
      donationType: donationType || 'General',
      category: category || 'General Relief',
      donorName: donorName || req.user?.name || 'Anonymous',
      donorEmail: donorEmail || req.user?.email,
      status: 'Pending'
    });

    console.log('Donation created successfully:', donation);

    // Update campaign's collected amount
    console.log('Updating campaign collected amount for campaignId:', campaignId);
    console.log('Amount to add:', Number(amount));
    
    try {
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { $inc: { collectedAmount: Number(amount) } },
        { new: true }
      );
      
      if (!updatedCampaign) {
        console.log('Campaign not found with ID:', campaignId);
      } else {
        console.log('Campaign updated successfully. New collected amount:', updatedCampaign.collectedAmount);
        console.log('Full updated campaign:', updatedCampaign);
      }
    } catch (campaignError) {
      console.error('Error updating campaign:', campaignError);
    }

    res.status(201).json({ message: "Donation created", donation: donation });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all donations (admin only)
export const getAllDonations = async (req, res) => {
  try {
    // Only admin can access this endpoint
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    console.log('Fetching all donations for admin dashboard...');
    const donations = await Donation.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    
    console.log(`Found ${donations.length} total donations`);
    console.log('Total amount:', donations.reduce((sum, d) => sum + (d.amount || 0), 0));
    console.log('Donations per campaign:', donations.reduce((acc, d) => {
      acc[d.campaignId] = (acc[d.campaignId] || 0) + 1;
      return acc;
    }, {}));

    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching all donations:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get donation by ID
export const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching donation with ID: ${id}`);
    
    const donation = await Donation.findById(id)
      .populate("userId", "name email");

    if (!donation) {
      console.log('Donation not found');
      return res.status(404).json({ message: "Donation not found" });
    }

    console.log('Found donation:', donation._id);
    console.log('Donation userId:', donation.userId);
    console.log('Request user ID:', req.user?.id);
    console.log('Request user role:', req.user?.role);

    // Users can only view their own donations unless they're admin
    // Check by userId first, then by email if userId is not available
    const donationUserId = donation.userId?._id?.toString() || donation.userId?.toString();
    const canAccess = 
      req.user?.role === 'admin' ||
      donationUserId === req.user?.id ||
      (!donationUserId && donation.donorEmail === req.user?.email);
    
    if (!canAccess) {
      console.log('Access denied - user trying to access another user\'s donation');
      console.log('Donation userId:', donationUserId);
      console.log('Donation email:', donation.donorEmail);
      console.log('Request user ID:', req.user?.id);
      console.log('Request user email:', req.user?.email);
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a donation
export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const donation = await Donation.findByIdAndUpdate(id, updatedData, { new: true });

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json({ message: "Donation updated", donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    res.status(200).json({ message: "Donation deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
