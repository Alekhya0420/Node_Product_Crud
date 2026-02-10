import { Router } from "express";

import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getLowStockInventory,
} from "../controllers/inventory.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

// API endpoints
router.get("/getAllInventories", getInventories);
router.get("/low-stock", getLowStockInventory);
router.get("/:id", getInventoryById);
router.post("/create-inventory", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
