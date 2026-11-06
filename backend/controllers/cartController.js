import User from "../models/user.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { cartItems, userId } = req.body;
    if (userId && userId !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot update another user's cart" });
    }
    if (
      !cartItems ||
      typeof cartItems !== "object" ||
      Array.isArray(cartItems) ||
      Object.entries(cartItems).some(
        ([id, quantity]) =>
          !/^[a-f\d]{24}$/i.test(id) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 99,
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cart contents" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { cartItems },
      { new: true },
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
