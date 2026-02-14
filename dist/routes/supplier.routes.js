"use strict";
// import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.middleware";
// import {
//   createSupplier,
//   deleteSupplier,
//   getAllSupplier,
//   getOneSupplier,
//   getUpdateSupplier,bulkDeleteSupplier
// } from "../controllers/supplier.controller";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authMiddleware);
// router.post("/create-supplier", createSupplier);
// router.get("/", getAllSupplier);
// router.get("/:id", getOneSupplier);
// router.patch("/:id",getUpdateSupplier);
// router.delete("/bulk", bulkDeleteSupplier);
// router.delete("/:id",deleteSupplier)
// export default router;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middlewares_1 = require("../middlewares/role.middlewares");
const supplier_controller_1 = require("../controllers/supplier.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), supplier_controller_1.getAllSupplier);
router.get("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), supplier_controller_1.getOneSupplier);
router.post("/create-supplier", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), supplier_controller_1.createSupplier);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), supplier_controller_1.getUpdateSupplier);
router.delete("/bulk", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), supplier_controller_1.bulkDeleteSupplier);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), supplier_controller_1.deleteSupplier);
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map