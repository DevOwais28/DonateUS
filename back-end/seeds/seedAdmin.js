import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config({ path: '../.env' });

const MONGO_URI = "mongodb+srv://786admin:Owais1234@786betcluster.wmondix.mongodb.net/DonationManagementSystem";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const seedAdmin = async () => {
  try {
    const email = "ra920453@gmail.com";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

seedAdmin();
