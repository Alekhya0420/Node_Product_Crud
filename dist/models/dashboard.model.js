"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModel = void 0;
const mongoose_1 = require("mongoose");
const dashboardSchema = new mongoose_1.Schema({
    totalProducts: {
        type: Number,
        required: true,
        min: 0,
    },
    totalCategories: {
        type: Number,
        required: true,
        min: 0,
    },
    totalSuppliers: {
        type: Number,
        required: true,
        min: 0,
    },
    totalInventoryItems: {
        type: Number,
        required: true,
        min: 0,
    },
    lowStockCount: {
        type: Number,
        required: true,
        min: 0,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.DashboardModel = (0, mongoose_1.model)("Dashboard", dashboardSchema);
//# sourceMappingURL=dashboard.model.js.map