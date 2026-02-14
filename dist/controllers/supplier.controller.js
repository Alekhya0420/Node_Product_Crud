"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteSupplier = exports.deleteSupplier = exports.getUpdateSupplier = exports.getOneSupplier = exports.getAllSupplier = exports.createSupplier = void 0;
const supplier_model_1 = require("../models/supplier.model");
const mongoose_1 = __importDefault(require("mongoose"));
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
            return res.status(409).json({
                message: "Supplier is already present,you can't create supplier with same name",
            });
        }
        const productConflict = await supplier_model_1.SupplierModel.findOne({
            products: { $in: products },
        });
        if (productConflict) {
            return res.status(409).json({
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
// GET all suppliers
const getAllSupplier = async (req, res) => {
    try {
        const suppliers = await supplier_model_1.SupplierModel.find().populate("products"); // populate product details
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found" });
        }
        return res.status(200).json({
            message: "Suppliers fetched successfully",
            data: suppliers,
        });
    }
    catch (error) {
        console.error("Error is", error);
        return res.status(500).json({ message: "Failed to fetch suppliers" });
    }
};
exports.getAllSupplier = getAllSupplier;
//Get information per supplier
const getOneSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const SupplierInfo = await supplier_model_1.SupplierModel.findById(id).populate("products", "name price file");
        if (!SupplierInfo) {
            return res.status(404).json({ message: "Supplier is not present" });
        }
        res.status(200).json({
            message: "Supplier information get successfully",
            data: SupplierInfo,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Supplier information has not found" });
    }
};
exports.getOneSupplier = getOneSupplier;
//update information per supplier
const getUpdateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, products } = req.body;
        if (!Array.isArray(products) || products.length == 0) {
            return res.status(400).json({ message: "Products can't be empty" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Supplier id is invalid" });
        }
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name can't be blank" });
        }
        const updatedSupplier = await supplier_model_1.SupplierModel.findByIdAndUpdate(id, {
            name,
            products,
        }, {
            new: true,
        });
        if (!updatedSupplier) {
            return res.status(404).json({ message: "supplier not found" });
        }
        res.status(200).json({
            message: "Supplier updated successfully",
            data: updatedSupplier,
        });
    }
    catch (error) {
        console.error("Error is", error);
        return res.status(500).json({
            message: "Failed to update supplier",
        });
    }
};
exports.getUpdateSupplier = getUpdateSupplier;
//delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Supplier id is invalid" });
        }
        const deletedSupplier = await supplier_model_1.SupplierModel.findByIdAndDelete(id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json({
            message: "Supplier has deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Supplier can't be deleted" });
    }
};
exports.deleteSupplier = deleteSupplier;
//bulk delete supplier
const bulkDeleteSupplier = async (req, res) => {
    try {
        const { ids } = req.body;
        // validate ids array
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Ids must be a non-empty array",
            });
        }
        // validate each id
        for (const id of ids) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: `Invalid supplier id: ${id}`,
                });
            }
        }
        const result = await supplier_model_1.SupplierModel.deleteMany({
            _id: { $in: ids },
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "No suppliers found to delete",
            });
        }
        console.info("supplier ids are", result);
        return res.status(200).json({
            message: "Suppliers deleted successfully",
            deletedCount: result.deletedCount,
        });
    }
    catch (error) {
        console.error("Error is", error);
        return res.status(500).json({
            message: "Suppliers can't be deleted",
        });
    }
};
exports.bulkDeleteSupplier = bulkDeleteSupplier;
//# sourceMappingURL=supplier.controller.js.map