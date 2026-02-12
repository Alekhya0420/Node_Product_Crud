// import { Router } from "express";

// import {
//   createInventory,
//   getInventories,
//   getInventoryById,
//   updateInventory,
//   deleteInventory,
//   getLowStockInventory,
// } from "../controllers/inventory.controller";
// import { authMiddleware } from "../middlewares/auth.middleware";

// const router = Router();

// router.use(authMiddleware);

// router.get("/getAllInventories", getInventories);
// router.get("/low-stock", getLowStockInventory);
// router.get("/:id", getInventoryById);
// router.post("/create-inventory", createInventory);
// router.put("/:id", updateInventory);
// router.delete("/:id", deleteInventory);

// export default router;

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
import { authorize } from "../middlewares/role.middlewares";

const router = Router();

/* VIEW INVENTORY (Admin + User) */
router.get(
  "/getAllInventories",
  authMiddleware,
  authorize("admin", "user"),
  getInventories,
);

router.get(
  "/low-stock",
  authMiddleware,
  authorize("admin", "user"),
  getLowStockInventory,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "user"),
  getInventoryById,
);

/* MANAGE INVENTORY (Admin Only) */
router.post(
  "/create-inventory",
  authMiddleware,
  authorize("admin"),
  createInventory,
);

router.patch("/:id", authMiddleware, authorize("admin"), updateInventory);

router.delete("/:id", authMiddleware, authorize("admin"), deleteInventory);

export default router;
