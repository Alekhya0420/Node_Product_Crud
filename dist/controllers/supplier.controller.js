"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupplier = void 0;
const supplier_model_1 = require("../models/supplier.model");
//Creating supplier
const createSupplier = async (req, res) => {
    try {
        const { name, products } = req.body;
        if (!name || !Array.isArray(products) || products.length === 0) {
            return res
                .status(400)
                .json({ message: "name and product is requied here" });
        }
        const supplierPreset = await supplier_model_1.SupplierModel.findOne({ name });
        if (supplierPreset) {
            return res
                .status(409)
                .json({
                message: "Supplier is already present,you can't create supplier with same name",
            });
        }
        const productConflict = await supplier_model_1.SupplierModel.findOne({
            products: { $in: products },
        });
        if (productConflict) {
            return res
                .status(409)
                .json({
                message: "This product has already supplied by another supplier",
            });
        }
        const supplier = await supplier_model_1.SupplierModel.create({ name, products });
        return res
            .status(201)
            .json({ message: "supplier created successfully", data: supplier });
    }
    catch (error) {
        console.info("Error is", error);
        res.status(500).json({ message: "Failed to create supplier" });
    }
};
exports.createSupplier = createSupplier;
//# sourceMappingURL=supplier.controller.js.map