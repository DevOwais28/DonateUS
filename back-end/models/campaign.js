import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    targetAmount: {
      type: Number,
      required: true,
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General Relief',
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Completed", "Suspended", "Closed"],
      default: "Active",
    },
    imageUrl: String,
    startDate: Date,
    endDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', campaignSchema);
