//Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Address and items are required" });
    }

    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
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
