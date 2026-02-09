"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const supplier_controller_1 = require("../controllers/supplier.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
//api endpoints
router.post("/create-supplier", supplier_controller_1.createSupplier);
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map