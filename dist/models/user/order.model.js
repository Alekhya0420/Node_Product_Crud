"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.model.js.map