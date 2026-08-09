import express from "express";
import fs from "fs";
import Food from "../models/Food.js";
import { upload } from "../middleware/upload.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/food/list - public, used by customer menu
router.get("/list", async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch food list" });
  }
});

// POST /api/food/add - admin only
router.post("/add", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.filename,
    });
    await food.save();
    res.json({ success: true, message: "Food item added", data: food });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add food item" });
  }
});

// POST /api/food/remove - admin only, body: { id }
router.post("/remove", requireAuth, requireAdmin, async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });

    fs.unlink(`uploads/${food.image}`, () => {}); // best-effort cleanup, ignore errors
    await Food.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove food item" });
  }
});

export default router;
