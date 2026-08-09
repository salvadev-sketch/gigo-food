import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendResetEmail } from "../config/email.js";

const router = express.Router();

// POST /api/password/forgot - body: { email }
router.post("/forgot", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // always respond success, even if user not found, to avoid leaking which emails are registered
    if (!user) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(user.email, resetUrl);

    res.json({ success: true, message: "If that email exists, a reset link has been sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, please try again" });
  }
});

// POST /api/password/reset/:token - body: { password }
router.post("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated — you can now log in" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, please try again" });
  }
});

export default router;
