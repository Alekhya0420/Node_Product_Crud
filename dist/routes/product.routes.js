"use strict";
// import { Router } from 'express';
// import {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   updateProductStatus
// } from '../controllers/product.controller';
// import { upload } from '../middlewares/multer';
// import { authMiddleware } from '../middlewares/auth.middleware';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authMiddleware);
// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.post('/', upload.single("file"), createProduct);
// router.patch('/:id',upload.single("file"), updateProduct);
// router.delete('/:id', deleteProduct);
// router.patch('/:id', updateProductStatus);
// export default router;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = require("../middlewares/multer");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middlewares_1 = require("../middlewares/role.middlewares");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), product_controller_1.getProducts);
router.get("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin", "user"), product_controller_1.getProductById);
router.post("/", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), multer_1.upload.single("file"), product_controller_1.createProduct);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), multer_1.upload.single("file"), product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), product_controller_1.deleteProduct);
router.patch("/status/:id", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("admin"), product_controller_1.updateProductStatus);
exports.default = router;
//# sourceMappingURL=product.routes.js.map