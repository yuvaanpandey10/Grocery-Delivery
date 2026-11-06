import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files || [];

    const uploadedImages = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const product = await Product.create({
      ...productData,
      image: [...(productData.image || []), ...uploadedImages],
    });

    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const uploadedImages = await Promise.all(
      (req.files || []).map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    const { name, category, description, price, offerPrice } = productData;
    Object.assign(product, { name, category, description, price, offerPrice });
    if (Array.isArray(productData.image) || uploadedImages.length > 0) {
      product.image = [
        ...(Array.isArray(productData.image) ? productData.image : product.image),
        ...uploadedImages,
      ];
    }

    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const referencedOrder = await Order.exists({
      "items.product": req.params.id,
    });
    if (referencedOrder) {
      return res.status(409).json({
        success: false,
        message: "Products in existing orders cannot be deleted",
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product : /api/product/list
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Product : /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true },
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
