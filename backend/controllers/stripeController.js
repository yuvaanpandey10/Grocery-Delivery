import Stripe from "stripe";
import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    const error = new Error("Stripe payments are not configured");
    error.statusCode = 503;
    throw error;
  }
  const mode =
    process.env.STRIPE_MODE ||
    (process.env.NODE_ENV === "production" ? "" : "test");
  if (!["test", "live"].includes(mode)) {
    const error = new Error("Set STRIPE_MODE to test or live");
    error.statusCode = 503;
    throw error;
  }
  const expectedPrefix = mode === "test" ? "sk_test_" : "sk_live_";
  if (!secretKey.startsWith(expectedPrefix)) {
    const error = new Error(
      `The configured Stripe secret key does not match STRIPE_MODE=${mode}`,
    );
    error.statusCode = 503;
    throw error;
  }
  return new Stripe(secretKey);
};

const getClientUrl = () => {
  const configuredUrl =
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    "http://localhost:5173";
  return new URL(configuredUrl).origin;
};

const validateOrderInput = (items, address) => {
  if (
    typeof address !== "string" ||
    !/^[a-f\d]{24}$/i.test(address) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100
  ) {
    return false;
  }

  if (
    items.some(
      (item) =>
        !item ||
        typeof item.product !== "string" ||
        !/^[a-f\d]{24}$/i.test(item.product) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99,
    )
  ) {
    return false;
  }

  return new Set(items.map((item) => item.product)).size === items.length;
};

export const buildStripeLineItems = (items, products) => {
  const productsById = new Map(
    products.map((product) => [product._id.toString().toLowerCase(), product]),
  );
  let subtotalCents = 0;
  const lineItems = items.map(({ product: productId, quantity }) => {
    const product = productsById.get(productId.toLowerCase());
    if (!product || !Number.isFinite(product.offerPrice)) {
      throw new Error("An ordered product has an invalid price");
    }

    const unitAmount = Math.round(product.offerPrice * 100);
    if (unitAmount < 1) {
      throw new Error("Product prices must be at least one cent");
    }

    subtotalCents += unitAmount * quantity;
    return {
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: unitAmount,
      },
      quantity,
    };
  });

  const taxCents = Math.round(subtotalCents * 0.02);
  if (taxCents > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Tax (2%)" },
        unit_amount: taxCents,
      },
      quantity: 1,
    });
  }

  return {
    amount: (subtotalCents + taxCents) / 100,
    lineItems,
  };
};

const markOrderPaid = async (order, session) => {
  const orderId = order._id.toString();
  if (
    session.mode !== "payment" ||
    session.payment_status !== "paid" ||
    session.currency !== "usd" ||
    session.client_reference_id !== orderId ||
    session.metadata?.orderId !== orderId ||
    session.metadata?.userId !== order.userId ||
    session.amount_total !== Math.round(order.amount * 100)
  ) {
    throw new Error("Stripe Checkout session does not match the order");
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: order._id,
      stripeSessionId: session.id,
      paymentMethod: "Stripe",
      isPaid: false,
    },
    { $set: { isPaid: true, stripePaymentIntentId: paymentIntentId } },
    { new: true },
  );
  if (updatedOrder) return updatedOrder;

  const alreadyPaidOrder = await Order.findOne({
    _id: order._id,
    stripeSessionId: session.id,
    paymentMethod: "Stripe",
    isPaid: true,
  });
  if (alreadyPaidOrder) return alreadyPaidOrder;

  throw new Error("Unable to mark the Stripe order as paid");
};

export const createStripeCheckout = async (req, res) => {
  const { items, address } = req.body;
  if (!validateOrderInput(items, address)) {
    return res.status(400).json({
      success: false,
      message: "Invalid address or order items",
    });
  }
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return res.status(503).json({
      success: false,
      message: "Stripe payments are not configured",
    });
  }

  let order;
  try {
    const savedAddress = await Address.findOne({
      _id: address,
      userId: req.userId,
    });
    if (!savedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery address not found" });
    }

    const products = await Product.find({
      _id: { $in: items.map((item) => item.product) },
    });
    if (products.length !== items.length) {
      return res
        .status(404)
        .json({ success: false, message: "An ordered product was not found" });
    }

    const productsById = new Map(
      products.map((product) => [product._id.toString().toLowerCase(), product]),
    );
    const unavailableProduct = items.find(
      (item) => !productsById.get(item.product.toLowerCase()).inStock,
    );
    if (unavailableProduct) {
      return res
        .status(409)
        .json({ success: false, message: "An ordered product is out of stock" });
    }

    const { amount, lineItems } = buildStripeLineItems(items, products);
    order = await Order.create({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
    });

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId: req.userId,
      },
      success_url: `${getClientUrl()}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getClientUrl()}/cart?payment=cancelled`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(201).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    if (order && !order.stripeSessionId) {
      try {
        await Order.deleteOne({ _id: order._id, isPaid: false });
      } catch (cleanupError) {
        console.error("Unable to remove pending Stripe order:", cleanupError);
      }
    }
    if (error.statusCode === 503) {
      return res.status(503).json({ success: false, message: error.message });
    }
    console.error("Unable to create Stripe Checkout session:", error);
    return res.status(502).json({
      success: false,
      message: "Unable to start secure payment. Please try again.",
    });
  }
};

export const verifyStripeCheckout = async (req, res) => {
  try {
    const order = await Order.findOne({
      userId: req.userId,
      stripeSessionId: req.params.sessionId,
      paymentMethod: "Stripe",
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Payment session not found" });
    }

    const session = await getStripe().checkout.sessions.retrieve(
      order.stripeSessionId,
    );
    if (session.payment_status !== "paid") {
      return res
        .status(409)
        .json({ success: false, message: "Payment has not been completed" });
    }

    const paidOrder = await markOrderPaid(order, session);
    return res.status(200).json({ success: true, order: paidOrder });
  } catch (error) {
    if (error.statusCode === 503) {
      return res.status(503).json({ success: false, message: error.message });
    }
    console.error("Unable to verify Stripe Checkout session:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to verify payment" });
  }
};

export const handleStripeWebhook = async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    return res
      .status(503)
      .json({ success: false, message: "Stripe webhooks are not configured" });
  }

  let event;
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Stripe signature" });
    }
    event = getStripe().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    if (error.statusCode === 503) {
      return res.status(503).json({ success: false, message: error.message });
    }
    return res
      .status(400)
      .json({ success: false, message: "Invalid Stripe webhook signature" });
  }

  const isPaidCheckoutEvent =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded";
  if (!isPaidCheckoutEvent || event.data.object.payment_status !== "paid") {
    return res.status(200).json({ received: true });
  }

  try {
    const session = event.data.object;
    const order = await Order.findOne({
      _id: session.metadata?.orderId,
      userId: session.metadata?.userId,
      stripeSessionId: session.id,
      paymentMethod: "Stripe",
    });
    if (!order) {
      throw new Error("No matching order found for the Stripe Checkout session");
    }

    await markOrderPaid(order, session);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Unable to process Stripe webhook:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to process Stripe payment" });
  }
};
