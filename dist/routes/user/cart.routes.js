"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middlewares_1 = require("../../middlewares/role.middlewares");
const cart_controller_1 = require("../../controllers/user/cart.controller");
const router = (0, express_1.Router)();
router.post("/add-to-cart", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("user"), cart_controller_1.addToCart);
router.get("/get-cart", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("user"), cart_controller_1.getMyCart);
router.delete("/remove-cart", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("user"), cart_controller_1.removeFromCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map