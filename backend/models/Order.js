import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    items: [
      {
        product: {
          type: String,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, ref: "Address", required: true },
    status: { type: String, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
