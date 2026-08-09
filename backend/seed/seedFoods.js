// Seeds the database with the 32 sample foods from the reference tutorial.
// Prices converted from $ to FRw at a placeholder rate ($1 -> 1000 FRw) — adjust as needed.
// Usage: node seed/seedFoods.js
// Requires food_1.png..food_32.png already copied into backend/uploads/ first.

import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/Food.js";

dotenv.config();

const RATE = 1000; // $1 -> FRw 1000 (placeholder, adjust to real exchange rate)
const DESC = "Food provides essential nutrients for overall health and well-being";

const foods = [
  { name: "Greek salad", price: 12, image: "food_1.png", category: "Salad" },
  { name: "Veg salad", price: 18, image: "food_2.png", category: "Salad" },
  { name: "Clover Salad", price: 16, image: "food_3.png", category: "Salad" },
  { name: "Chicken Salad", price: 24, image: "food_4.png", category: "Salad" },
  { name: "Lasagna Rolls", price: 14, image: "food_5.png", category: "Rolls" },
  { name: "Peri Peri Rolls", price: 12, image: "food_6.png", category: "Rolls" },
  { name: "Chicken Rolls", price: 20, image: "food_7.png", category: "Rolls" },
  { name: "Veg Rolls", price: 15, image: "food_8.png", category: "Rolls" },
  { name: "Ripple Ice Cream", price: 14, image: "food_9.png", category: "Deserts" },
  { name: "Fruit Ice Cream", price: 22, image: "food_10.png", category: "Deserts" },
  { name: "Jar Ice Cream", price: 10, image: "food_11.png", category: "Deserts" },
  { name: "Vanilla Ice Cream", price: 12, image: "food_12.png", category: "Deserts" },
  { name: "Chicken Sandwich", price: 12, image: "food_13.png", category: "Sandwich" },
  { name: "Vegan Sandwich", price: 18, image: "food_14.png", category: "Sandwich" },
  { name: "Grilled Sandwich", price: 16, image: "food_15.png", category: "Sandwich" },
  { name: "Bread Sandwich", price: 24, image: "food_16.png", category: "Sandwich" },
  { name: "Cup Cake", price: 14, image: "food_17.png", category: "Cake" },
  { name: "Vegan Cake", price: 12, image: "food_18.png", category: "Cake" },
  { name: "Butterscotch Cake", price: 20, image: "food_19.png", category: "Cake" },
  { name: "Sliced Cake", price: 15, image: "food_20.png", category: "Cake" },
  { name: "Garlic Mushroom", price: 14, image: "food_21.png", category: "Pure Veg" },
  { name: "Fried Cauliflower", price: 22, image: "food_22.png", category: "Pure Veg" },
  { name: "Mix Veg Pulao", price: 10, image: "food_23.png", category: "Pure Veg" },
  { name: "Rice Zucchini", price: 12, image: "food_24.png", category: "Pure Veg" },
  { name: "Cheese Pasta", price: 12, image: "food_25.png", category: "Pasta" },
  { name: "Tomato Pasta", price: 18, image: "food_26.png", category: "Pasta" },
  { name: "Creamy Pasta", price: 16, image: "food_27.png", category: "Pasta" },
  { name: "Chicken Pasta", price: 24, image: "food_28.png", category: "Pasta" },
  { name: "Butter Noodles", price: 14, image: "food_29.png", category: "Noodles" },
  { name: "Veg Noodles", price: 12, image: "food_30.png", category: "Noodles" },
  { name: "Somen Noodles", price: 20, image: "food_31.png", category: "Noodles" },
  { name: "Cooked Noodles", price: 15, image: "food_32.png", category: "Noodles" },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[seed] Connected to MongoDB");

  await Food.deleteMany({});
  const docs = foods.map((f) => ({ ...f, price: f.price * RATE, description: DESC }));
  await Food.insertMany(docs);

  console.log(`[seed] Inserted ${docs.length} foods`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[seed] Failed:", err.message);
  process.exit(1);
});
