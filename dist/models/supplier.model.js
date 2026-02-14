"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierModel = void 0;
const mongoose_1 = require("mongoose");
const supplierSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        trim: true,
        default: "active"
    },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
}, {
    timestamps: true,
});
exports.SupplierModel = (0, mongoose_1.model)("Supplier", supplierSchema);
//# sourceMappingURL=supplier.model.js.map