"use strict";
// import { Router } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middlewares_1 = require("../middlewares/role.middlewares");
const router = (0, express_1.Router)();
/* VIEW INVENTORY (Admin + User) */
router.get("/getAllInventories", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), inventory_controller_1.getInventories);
router.get("/low-stock", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), inventory_controller_1.getLowStockInventory);
router.get("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), inventory_controller_1.getInventoryById);
/* MANAGE INVENTORY (Admin Only) */
router.post("/create-inventory", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), inventory_controller_1.createInventory);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), inventory_controller_1.updateInventory);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), inventory_controller_1.deleteInventory);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map