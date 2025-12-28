import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });
console.log('After load - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('After load - JWT_SECRET:', process.env.JWT_SECRET);

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
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

connectDB(mongoURI);

const app = express();




app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://donate-us.vercel.app', credentials: true }));

// Initialize passport after dotenv loads
const { default: passport } = await import("./config/passport.js");
app.use(passport.initialize());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/donations', donationRoutes);
app.use('/api/campaigns', campaignRoutes); // Public campaigns route (GET only)
app.use('/api/campaigns/admin', authenticate, campaignRoutes); // Admin campaigns route
app.use('/api/receipts', authenticate , receiptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', googleAuthRoutes);

// your routes here


app.use(errorMiddleware);

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));
