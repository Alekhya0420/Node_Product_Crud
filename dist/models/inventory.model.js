"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModel = void 0;
const mongoose_1 = require("mongoose");
const inventorySchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    minThreshold: {
        type: Number,
        default: 5,
        min: 0,
    },
    status: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        default: "in_stock",
    },
}, { timestamps: true });
exports.InventoryModel = (0, mongoose_1.model)("Inventory", inventorySchema);
//# sourceMappingURL=inventory.model.js.map