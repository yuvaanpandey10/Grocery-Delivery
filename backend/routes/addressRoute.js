import express from "express";
import authUser from "../middleware/authUser.js";
import { addAddress } from "../models/addressModel.js";

const addressRouter = express.Router();

addressRouter.use(authUser);

addressRouter.post("/add", authUser, addAddress);
addressRouter.get("/get", authUser, getAddresses);

export default addressRouter;
