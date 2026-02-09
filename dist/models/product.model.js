"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    price: {
        type: Number,
        required: true,
    },
    supplierId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    file: {
        url: String,
        originalName: String,
        mimeType: String,
    },
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
//# sourceMappingURL=product.model.js.map