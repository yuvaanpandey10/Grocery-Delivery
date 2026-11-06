import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import authCatalog from "../middlewares/authCatalog.js";
import {
  addProduct,
  productById,
  getProducts,
  changeStock,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authSeller, upload.array("images"), addProduct);
productRouter.get("/list", authCatalog, getProducts);
productRouter.get("/:id", authCatalog, productById);
productRouter.post("/stock", authSeller, changeStock);
productRouter.put("/:id", authSeller, upload.array("images"), updateProduct);
productRouter.delete("/:id", authSeller, deleteProduct);

export default productRouter;
