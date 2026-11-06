import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    cartItems: { type: Object, default: {} },
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
  },
  { minimize: false },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
