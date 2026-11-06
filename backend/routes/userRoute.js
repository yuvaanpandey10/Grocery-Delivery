import express from "express";
import { registerUser, login } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/is-auth", isAuth);
userRouter.post("/logout", logout);

export default userRouter;
