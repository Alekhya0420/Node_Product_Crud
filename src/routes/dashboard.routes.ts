import { Router } from "express";
import {
  getDashboardSummary,
  getLowStockProducts,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protect all dashboard routes
router.use(authMiddleware);

// Dashboard APIs
router.get("/summary", getDashboardSummary);
router.get("/low-stock", getLowStockProducts);

export default router;
