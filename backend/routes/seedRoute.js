import express from "express";
import Food from "../models/Food.js";
import { seedFoodDocs } from "../seed/foodData.js";

const router = express.Router();

// GET /api/seed/foods?secret=xxx
// Workaround for Render's free tier not supporting Shell access — visit this
// URL in a browser (with the correct secret) instead of running the CLI script.
// Set SEED_SECRET as an env var on Render before using this, then remove/rotate
// it once seeding is done if you want to lock this route back down.
router.get("/foods", async (req, res) => {
  if (!process.env.SEED_SECRET) {
    return res.status(503).json({ success: false, message: "SEED_SECRET env var is not set on the server" });
  }
  if (req.query.secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ success: false, message: "Invalid or missing secret" });
  }

  try {
    await Food.deleteMany({});
    const docs = seedFoodDocs();
    await Food.insertMany(docs);
    res.json({ success: true, message: `Inserted ${docs.length} foods` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Seeding failed", error: err.message });
  }
});

export default router;
