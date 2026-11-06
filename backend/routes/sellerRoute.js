import express from "express";
import {
  sellerLogin,
  isSellerAuth,
  sellerLogout,
} from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";
import { rateLimit } from "express-rate-limit";

const sellerRouter = express.Router();
const sellerLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

sellerRouter.post("/login", sellerLoginLimiter, sellerLogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.get("/logout", authSeller, sellerLogout);

export default sellerRouter;
