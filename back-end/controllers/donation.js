import Donation from "../models/donation.js";

// Get current user's donations
export const getMyDonations = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Fetching donations for user: ${userId}`);
    
    const donations = await Donation.find({ userId: userId }).sort({ createdAt: -1 });
    
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

    res.status(201).json({ message: "Donation created", donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    if (req.user?.role !== 'admin' && donation.userId?._id?.toString() !== req.user?.id) {
      console.log('Access denied - user trying to access another user\'s donation');
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
