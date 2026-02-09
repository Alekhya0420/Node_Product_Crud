"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = require("../middlewares/multer");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
//api endpoints
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProductById);
router.post('/', multer_1.upload.single("file"), product_controller_1.createProduct);
router.put('/:id', multer_1.upload.single("file"), product_controller_1.updateProduct);
router.delete('/:id', product_controller_1.deleteProduct);
router.patch('/:id', product_controller_1.updateProductStatus);
exports.default = router;
//# sourceMappingURL=product.routes.js.map