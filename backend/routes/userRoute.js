import express from "express";
import {
  registerUser,
  login,
  isAuth,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { rateLimit } from "express-rate-limit";

const userRouter = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});
const resetRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

userRouter.post("/register", authLimiter, registerUser);
userRouter.post("/login", authLimiter, login);
userRouter.post("/forgot-password", resetRequestLimiter, requestPasswordReset);
userRouter.post("/reset-password", authLimiter, resetPassword);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);

export default userRouter;
