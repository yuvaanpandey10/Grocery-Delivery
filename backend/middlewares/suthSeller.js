import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (tokenDecoded.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default authSeller;
