import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    legacyId: { type: String, unique: true, sparse: true },
    description: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({ category: 1, createdAt: -1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
