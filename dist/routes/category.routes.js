"use strict";
// import { Router } from "express";
// import {
//   createCategory,
//   getCategories,
//   getCategoryById,
//   updateCategory,
//   deleteCategory,
//   updateCategoryStatus,
// } from "../controllers/category.controller";
// import { authMiddleware } from "../middlewares/auth.middleware";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authMiddleware);
// router.get("/getallCategories", getCategories);
// router.get("/:id", getCategoryById);
// router.post("/create-category", createCategory);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);
// router.patch("/:id", updateCategoryStatus);
// export default router;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middlewares_1 = require("../middlewares/role.middlewares");
const router = (0, express_1.Router)();
/* PUBLIC / USER ACCESS*/
// Anyone logged-in can view categories
router.get("/getallCategories", auth_middleware_1.authMiddleware, category_controller_1.getCategories);
router.get("/:id", auth_middleware_1.authMiddleware, category_controller_1.getCategoryById);
/* ADMIN ONLY ACCESS*/
router.post("/create-category", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), category_controller_1.createCategory);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), category_controller_1.updateCategory);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), category_controller_1.deleteCategory);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), category_controller_1.updateCategoryStatus);
exports.default = router;
//# sourceMappingURL=category.routes.js.map