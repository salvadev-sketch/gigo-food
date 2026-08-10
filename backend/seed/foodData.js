// Shared seed data — used by both seed/seedFoods.js (CLI) and routes/seedRoute.js (HTTP,
// for free-tier Render where Shell access isn't available).
const RATE = 1000; // $1 -> FRw 1000 (placeholder, adjust to real exchange rate)
const DESC = "Food provides essential nutrients for overall health and well-being";

export const rawFoods = [
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

export const seedFoodDocs = () =>
  rawFoods.map((f) => ({ ...f, price: f.price * RATE, description: DESC }));
