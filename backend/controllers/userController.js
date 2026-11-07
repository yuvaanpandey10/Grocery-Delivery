import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const passwordResetEmailTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    process.env.RENDER_EXTERNAL_URL;
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !SMTP_FROM ||
    !frontendUrl
  ) {
    return null;
  }

  const parsedFrontendUrl = new URL(frontendUrl);
  if (
    process.env.NODE_ENV === "production" &&
    parsedFrontendUrl.protocol !== "https:"
  ) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    }),
    from: SMTP_FROM,
    frontendUrl: parsedFrontendUrl.origin,
  };
};

// Register User : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100 ||
      !email ||
      email.length > 254 ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Enter a valid name, email, and password (8-128 characters)",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, ver: user.tokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        cartItems: user.cartItems,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "An account with this email already exists." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    // Check if user exists
    if (!email || email.length > 254 || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, ver: user.tokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        cartItems: user.cartItems,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  const response = {
    success: true,
    message:
      "If an account exists for that email, password reset instructions will be sent.",
  };

  try {
    const mail = passwordResetEmailTransport();
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!mail && !isDevelopment) {
      return res.status(503).json({
        success: false,
        message: "Password reset is temporarily unavailable.",
      });
    }

    const email = normalizeEmail(req.body.email);
    if (!email || email.length > 254) {
      return res.status(200).json(response);
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json(response);

    const resetToken = randomBytes(32).toString("base64url");
    user.passwordResetTokenHash = createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetPath = `/reset-password/${resetToken}`;
    if (!mail) {
      return res.status(200).json({
        ...response,
        resetUrl: resetPath,
        developmentOnly: true,
      });
    }

    try {
      const resetUrl = new URL(resetPath, mail.frontendUrl).toString();
      await mail.transporter.sendMail({
        from: mail.from,
        to: user.email,
        subject: "Reset your Grocery Delivery password",
        text: `Use this link within 30 minutes to reset your password: ${resetUrl}\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use this link within 30 minutes to reset your password:</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (mailError) {
      console.error("Password reset email delivery failed:", mailError.message);
      if (isDevelopment) {
        return res.status(200).json({
          ...response,
          resetUrl: resetPath,
          developmentOnly: true,
        });
      }

      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      try {
        await user.save();
      } catch (saveError) {
        console.error(
          "Unable to clear failed password reset token:",
          saveError.message,
        );
      }
      return res.status(503).json({
        success: false,
        message: "Password reset is temporarily unavailable.",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Password reset is temporarily unavailable.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (
      typeof token !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(token) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid reset link and a password of 8-128 characters.",
      });
    }

    const passwordResetTokenHash = createHash("sha256")
      .update(token)
      .digest("hex");
    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      {
        passwordResetTokenHash,
        passwordResetExpires: { $gt: new Date() },
      },
      {
        $set: {
          password: newPassword,
          passwordResetTokenHash: null,
          passwordResetExpires: null,
        },
        $inc: { tokenVersion: 1 },
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please sign in.",
    });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Unable to reset your password." });
  }
};

//Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Logout User : /api/user/logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
