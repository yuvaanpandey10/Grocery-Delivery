import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 4000;

// Allow requests from specific origins
const allowedOrigins = ["http://localhost:5173"];

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Define routes

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
