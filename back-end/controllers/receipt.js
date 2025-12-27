import Receipt from "../models/receipt.js";
import Donation from "../models/donation.js";

// Create a receipt
export const createReceipt = async (req, res) => {
  try {
    const { donationId } = req.body;

    // Check if donation exists
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Create receipt number
    const receiptNumber = "REC-" + Date.now();

    const receipt = await Receipt.create({
      donationId,
      receiptNumber,
      pdfUrl: "" // Fill after generating PDF
    });

    res.status(201).json({ message: "Receipt created", receipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate({
        path: "donationId",
        populate: { path: "userId campaignId" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single receipt
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await Receipt.findById(id)
      .populate({
        path: "donationId",
        populate: { path: "userId campaignId" }
      });

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
