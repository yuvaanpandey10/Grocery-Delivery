import express from "express";
import { rateLimit } from "express-rate-limit";
import { sendContactMessage } from "../controllers/contactController.js";
import authUser from "../middlewares/authUser.js";

const contactRouter = express.Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

contactRouter.post("/", authUser, contactLimiter, sendContactMessage);

export default contactRouter;
