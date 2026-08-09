import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    amount: { type: Number, required: true }, // total in FRw, includes delivery fee
    deliveryFee: { type: Number, default: 1500 },
    address: {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      province: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Food Processing",
    },
    payment: {
      method: { type: String, default: "MTN MoMo" },
      momoPhone: { type: String },
      momoReferenceId: { type: String }, // MoMo transaction reference id (UUID)
      status: {
        type: String,
        enum: ["Pending", "Successful", "Failed"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
