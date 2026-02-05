import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPasswordOTP,
  resetPassword,
  verifyOtp,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordOTP);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
