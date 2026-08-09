import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cartData: { type: Object, default: {} }, // { foodId: quantity }
    // reset password flow (matches gigo-delivery / gigo-pharmacy pattern)
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
