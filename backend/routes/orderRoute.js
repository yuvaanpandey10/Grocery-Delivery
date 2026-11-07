import express from "express";
import { rateLimit } from "express-rate-limit";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import {
  placeOrderCOD,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  createStripeCheckout,
  verifyStripeCheckout,
} from "../controllers/stripeController.js";

const orderRouter = express.Router();
const stripeCheckoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.userId,
  message: {
    success: false,
    message: "Too many payment attempts. Please try again later.",
  },
});

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post(
  "/stripe/checkout",
  authUser,
  stripeCheckoutLimiter,
  createStripeCheckout,
);
orderRouter.get(
  "/stripe/verify/:sessionId",
  authUser,
  verifyStripeCheckout,
);
orderRouter.get("/user", authUser, getOrdersByUserId);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.patch("/:id/status", authSeller, updateOrderStatus);

export default orderRouter;
