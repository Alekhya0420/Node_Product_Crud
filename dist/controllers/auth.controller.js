"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showProfile = exports.resetPassword = exports.verifyOtp = exports.forgotPasswordOTP = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const mail_1 = require("../utils/mail");
const conversation_model_1 = require("../models/socket/conversation.model");
/** REGISTER */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await (0, hash_1.hashPassword)(password);
        console.info("hashed password is", hash_1.hashPassword);
        // await UserModel.create({
        //   name,
        //   email,
        //   password: hashedPassword,
        // });
        const newUser = await user_model_1.UserModel.create({
            name,
            email,
            password: hashedPassword,
        });
        await conversation_model_1.ConversationModel.create({
            userId: newUser._id,
        });
        return res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
/** LOGIN */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await (0, hash_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, jwt_1.generateAccessToken)({ id: user._id, role: user.role });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
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
    }
    catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
/** REFRESH TOKEN */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }
        const user = await user_model_1.UserModel.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, () => { });
        const newAccessToken = (0, jwt_1.generateAccessToken)({ id: user._id });
        return res.status(200).json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        return res.status(403).json({ message: "Token refresh failed" });
    }
};
exports.refreshToken = refreshToken;
/** LOGOUT */
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }
        await user_model_1.UserModel.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
        return res.status(200).json({
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Logout failed" });
    }
};
exports.logout = logout;
/** FORGOT PASSWORD */
const forgotPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.info("case is", email);
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await user_model_1.UserModel.findOne({ email });
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
        await (0, mail_1.sendMail)({
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
    }
    catch (error) {
        console.error("❌ OTP ERROR:", error);
        return res.status(500).json({ message: "OTP sending failed" });
    }
};
exports.forgotPasswordOTP = forgotPasswordOTP;
/** Verify Otp */
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }
        const user = await user_model_1.UserModel.findOne({
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
    }
    catch (error) {
        return res.status(500).json({ message: "OTP verification failed" });
    }
};
exports.verifyOtp = verifyOtp;
/** Reset Password */
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and new password required",
            });
        }
        const user = await user_model_1.UserModel.findOne({
            email: email.trim().toLowerCase(),
            otpVerified: true,
        });
        if (!user) {
            return res.status(400).json({
                message: "OTP not verified or session expired",
            });
        }
        user.password = await (0, hash_1.hashPassword)(password);
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpVerified = false;
        user.refreshToken = undefined;
        await user.save();
        return res.status(200).json({
            message: "Password reset successful",
        });
    }
    catch (error) {
        console.error("❌ RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            message: "Reset password failed",
        });
    }
};
exports.resetPassword = resetPassword;
//Profile Api
const showProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        //Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token required" });
        }
        const token = authHeader.split(" ")[1];
        //Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.info("decoded is", decoded);
        //Find user(excluding all of the fields which i have shown)
        const user = await user_model_1.UserModel.findById(decoded.id).select("-password -refreshToken -otp -otpExpiry");
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
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.showProfile = showProfile;
//# sourceMappingURL=auth.controller.js.map