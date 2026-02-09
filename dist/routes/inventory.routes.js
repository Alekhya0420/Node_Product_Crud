"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// API endpoints
router.get("/getAllInventories", inventory_controller_1.getInventories);
router.get("/low-stock", inventory_controller_1.getLowStockInventory);
router.get("/:id", inventory_controller_1.getInventoryById);
router.post("/create-inventory", inventory_controller_1.createInventory);
router.put("/:id", inventory_controller_1.updateInventory);
router.delete("/:id", inventory_controller_1.deleteInventory);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map