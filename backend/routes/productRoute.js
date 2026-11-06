import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  productById,
  getProducts,
  changeStock,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authSeller, upload.array("images"), addProduct);
productRouter.get("/list", getProducts);
productRouter.get("/:id", productById);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
