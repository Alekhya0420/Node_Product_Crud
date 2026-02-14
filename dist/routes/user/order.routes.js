"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middlewares_1 = require("../../middlewares/role.middlewares");
const order_controller_1 = require("../../controllers/user/order.controller");
const router = (0, express_1.Router)();
router.post("/place-order", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("user"), order_controller_1.placeOrder);
router.get("/get-my-order", auth_middleware_1.authMiddleware, (0, role_middlewares_1.authorize)("user"), order_controller_1.getMyOrders);
exports.default = router;
//# sourceMappingURL=order.routes.js.map