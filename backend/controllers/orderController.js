import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!address || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Address and items are required" });
    }

    const savedAddress = await Address.findOne({
      _id: address,
      userId: req.userId,
    });
    if (!savedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery address not found" });
    }

    let subtotal = 0;
    for (const item of items) {
      if (!item.product || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid order item" });
      }
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "An ordered product was not found" });
      }
      if (!product.inStock) {
        return res
          .status(409)
          .json({ success: false, message: `${product.name} is out of stock` });
      }
      subtotal += product.offerPrice * item.quantity;
    }

    const amount = Number((subtotal * 1.02).toFixed(2));

    const newOrder = await Order.create({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Orders by User ID : /api/order/user
export const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders ( for seller / admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
