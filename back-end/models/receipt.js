import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
    pdfUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Receipt', receiptSchema);
