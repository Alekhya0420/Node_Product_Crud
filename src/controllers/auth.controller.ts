import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { sendMail } from "../utils/mail";

/** REGISTER */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    console.info("hashed password is", hashPassword);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,

    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

/** LOGIN */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

/** REFRESH TOKEN */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, () => {});

    const newAccessToken = generateAccessToken({ id: user._id });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Token refresh failed" });
  }
};

/** LOGOUT */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    await UserModel.updateOne(
      { refreshToken },
      { $unset: { refreshToken: 1 } },
    );

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

/** FORGOT PASSWORD */
export const forgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.info("case is", email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    const usermail = user?.email;

    if (!user) {
      return res.status(404).json({
        message: "Email does not exist",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your password reset OTP is:</p>
        <h2 style="letter-spacing:4px">${otp}</h2>
        <p>This OTP is valid for 2 minutes.</p>
      `,
    });

    if (usermail === email) {
      return res.status(200).json({
        message: "Otp has sent to your email",
      });
    }
  } catch (error) {
    console.error("❌ OTP ERROR:", error);
    return res.status(500).json({ message: "OTP sending failed" });
  }
};

/** Verify Otp */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await UserModel.findOne({
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otpVerified = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/** Reset Password */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and new password required",
      });
    }

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase(),
      otpVerified: true,
    });

    if (!user) {
      return res.status(400).json({
        message: "OTP not verified or session expired",
      });
    }

    user.password = await hashPassword(password);

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpVerified = false;
    user.refreshToken = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("❌ RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      message: "Reset password failed",
    });
  }
};
//Profile Api
export const showProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    //Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }
    const token = authHeader.split(" ")[1];

    //Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };

    console.info("decoded is", decoded);
    //Find user(excluding all of the fields which i have shown)
    const user = await UserModel.findById(decoded.id).select(
      "-password -refreshToken -otp -otpExpiry",
    );
    console.info("user is", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Return profile data
    return res.status(200).json({
      message: "Profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
