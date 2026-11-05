import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies; // Ensure you are using 'cookie-parser' in your app

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecoded && tokenDecoded.id) {
      // Best Practice: Attach to req.userId or req.user instead of req.body
      req.userId = tokenDecoded.id;
      // OR: req.user = tokenDecoded; (if you want to store the whole payload)
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (err) {
    // FIX: Changed 'error' to 'err' to match the catch parameter
    return res.status(401).json({ success: false, message: err.message });
  }
};

export default authUser;
