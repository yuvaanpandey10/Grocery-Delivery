import dotenv from "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow requests from specific origins
const allowedOrigins = ["http://localhost:5173"];

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Define routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
