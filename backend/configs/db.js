import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });
  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
