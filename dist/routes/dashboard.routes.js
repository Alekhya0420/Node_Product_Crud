"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect all dashboard routes
router.use(auth_middleware_1.authMiddleware);
router.get("/summary", dashboard_controller_1.getDashboardSummary);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map