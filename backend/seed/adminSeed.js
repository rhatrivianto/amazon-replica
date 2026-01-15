// File: seeds/adminSeed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env dari root backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const adminData = {
  name: "Admin",
  email: "rully@rully.com",
  password: "Abd123456",
};

async function seedAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    await User.create({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password, // "Abd123456"
      role: "admin",
      isVerified: true,
    });

    console.log("🔥 Admin successfully created");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seedAdmin();

