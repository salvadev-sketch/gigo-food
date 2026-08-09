import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/cart/add - body: { foodId }
router.post("/add", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cartData = user.cartData || {};
    cartData[req.body.foodId] = (cartData[req.body.foodId] || 0) + 1;
    await User.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Added to cart", cartData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
});

// POST /api/cart/remove - body: { foodId }
router.post("/remove", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cartData = user.cartData || {};
    if (cartData[req.body.foodId] > 0) {
      cartData[req.body.foodId] -= 1;
      if (cartData[req.body.foodId] === 0) delete cartData[req.body.foodId];
    }
    await User.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Removed from cart", cartData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove from cart" });
  }
});

// GET /api/cart/get
router.get("/get", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
});

export default router;
