import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecoded?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const user = await User.findById(tokenDecoded.id).select("tokenVersion");
    if (!user || (tokenDecoded.ver ?? 0) !== user.tokenVersion) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired. Please sign in again." });
    }

    req.userId = user._id.toString();
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired. Please sign in again." });
    }
    console.error("User authentication failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to verify your session." });
  }
};

export default authUser;
