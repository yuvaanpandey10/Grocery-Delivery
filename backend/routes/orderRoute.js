import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import {
  placeOrderCOD,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getOrdersByUserId);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.patch("/:id/status", authSeller, updateOrderStatus);

export default orderRouter;
