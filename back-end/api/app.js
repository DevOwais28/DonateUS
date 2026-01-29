import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "./config/passport.js";

import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./lib/db.js";

import donationRoutes from "./routes/donation.js";
import campaignRoutes from "./routes/campaign.js";
import receiptRoutes from "./routes/receipt.js";
import userRoutes from "./routes/user.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import authenticate from "./middlewares/authentication.js";

import { v2 as cloudinary } from "cloudinary";

const app = express();

// DB
await connectDB(process.env.MONGO_URI);

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Security (SAFE)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://donate-us.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.get("/", (req, res) => res.send("API running on Vercel 🚀"));

app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaigns/admin", authenticate, campaignRoutes);
app.use("/api/receipts", authenticate, receiptRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", googleAuthRoutes);

// Errors
app.use(errorMiddleware);

// ✅ EXPORT ONLY
export default app;
