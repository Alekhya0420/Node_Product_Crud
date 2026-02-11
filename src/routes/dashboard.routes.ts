import { Router } from "express";
import {
  getDashboardSummary,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protect all dashboard routes
router.use(authMiddleware);
router.get("/summary", getDashboardSummary);

export default router;
