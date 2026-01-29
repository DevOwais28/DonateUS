import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./lib/db.js";
import donationRoutes from "./routes/donation.js";
import campaignRoutes from "./routes/campaign.js";
import receiptRoutes from "./routes/receipt.js";
import userRoutes from "./routes/user.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import authenticate from "./middlewares/authentication.js";
import { v2 as cloudinary } from "cloudinary";

export const envMode = process.env.NODE_ENV || "DEVELOPMENT";
const port = process.env.PORT || 3000;

// DB
connectDB(process.env.MONGO_URI);

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);

// CORS
const allowedOrigins =
  envMode === "DEVELOPMENT"
    ? ["http://localhost:5173", "http://localhost:3000"]
    : ["https://donate-us.vercel.app"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
const { default: passport } = await import("./config/passport.js");
app.use(passport.initialize());

// Routes
app.get("/", (req, res) => res.send("Hello World"));

app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaigns/admin", authenticate, campaignRoutes);
app.use("/api/receipts", authenticate, receiptRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", googleAuthRoutes);

// Errors
app.use(errorMiddleware);

app.listen(port, () =>
  console.log(`Server running on port ${port} in ${envMode}`)
);
