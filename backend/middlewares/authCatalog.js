import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authCatalog = async (req, res, next) => {
  const cookies = req.cookies || {};

  let decodedUser;
  try {
    const userToken = cookies.token;
    if (userToken) {
      decodedUser = jwt.verify(userToken, process.env.JWT_SECRET);
    }
  } catch {
    decodedUser = null;
  }

  if (decodedUser?.id) {
    try {
      const user = await User.findById(decodedUser.id).select("tokenVersion");
      if (user && (decodedUser.ver ?? 0) === user.tokenVersion) {
        req.userId = user._id.toString();
        return next();
      }
    } catch (error) {
      console.error("Unable to verify catalog session:", error);
      return res
        .status(500)
        .json({ success: false, message: "Unable to verify your session" });
    }
  }

  let decodedSeller;
  try {
    const sellerToken = cookies.sellerToken;
    if (sellerToken) {
      decodedSeller = jwt.verify(sellerToken, process.env.JWT_SECRET);
    }
  } catch {
    decodedSeller = null;
  }
  if (decodedSeller?.email === process.env.ADMIN_EMAIL) return next();

  return res
    .status(401)
    .json({ success: false, message: "Please sign in to view products" });
};

export default authCatalog;
