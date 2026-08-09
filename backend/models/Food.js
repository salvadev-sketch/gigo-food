import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // stored in FRw
    image: { type: String, required: true }, // filename in /uploads
    category: {
      type: String,
      required: true,
      enum: [
        "Salad",
        "Rolls",
        "Deserts",
        "Sandwich",
        "Cake",
        "Pure Veg",
        "Pasta",
        "Noodles",
      ],
    },
  },
  { timestamps: true }
);

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
export default Food;
