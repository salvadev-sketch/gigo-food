// Seeds the database with the 32 sample foods from the reference tutorial.
// Prices converted from $ to FRw at a placeholder rate ($1 -> 1000 FRw) — adjust as needed.
// Usage: node seed/seedFoods.js
// Requires food_1.png..food_32.png already copied into backend/uploads/ first.

import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/Food.js";
import { seedFoodDocs } from "./foodData.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[seed] Connected to MongoDB");

  await Food.deleteMany({});
  const docs = seedFoodDocs();
  await Food.insertMany(docs);

  console.log(`[seed] Inserted ${docs.length} foods`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[seed] Failed:", err.message);
  process.exit(1);
});
