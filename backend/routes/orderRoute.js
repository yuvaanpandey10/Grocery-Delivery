import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import {
  placeOrderCOD,
  getOrdersByUserId,
  getAllOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getOrdersByUserId);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
