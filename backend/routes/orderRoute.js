import express from "express";
import { authUser } from "../middleware/authMiddleware.js";
import {
  placeOrderCOD,
  getOrdersByUserId,
  getAllOrders,
} from "../controllers/orderController.js";
import { authSeller } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getOrdersByUserId);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
