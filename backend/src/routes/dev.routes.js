import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/create-admin", async (req, res) => {
  try {
    const exists = await User.findOne({ email: "rully@rully.com" });
    if (exists) return res.json({ message: "Admin already exists" });

    const admin = await User.create({
      name: "Admin",
      email: "rully@rully.com",
      password: "Abd123456", // otomatis di-hash oleh pre-save
      role: "admin",
      isVerified: true,
    });

    res.json({ success: true, admin });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
