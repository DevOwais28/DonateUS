import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    campaignId: {
      type: String, // Using string for now since we have sample campaigns
      required: true,
    },
    campaignTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Bank", "Bank Transfer", "JazzCash", "EasyPaisa", "Wallet"],
      default: "Card",
    },
    donationType: {
      type: String,
      default: "General",
    },
    category: {
      type: String,
      default: "General Relief",
    },
    donorName: {
      type: String,
      required: true,
    },
    donorEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Verified"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
