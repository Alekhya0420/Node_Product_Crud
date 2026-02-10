"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockInventory = exports.deleteInventory = exports.updateInventory = exports.getInventoryById = exports.getInventories = exports.createInventory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inventory_model_1 = require("../models/inventory.model");
const product_model_1 = require("../models/product.model");
// Create Inventory
const createInventory = async (req, res) => {
    try {
        const { productId, quantity, minThreshold } = req.body;
        if (!productId || quantity === undefined) {
            return res.status(400).json({
                message: "productId and quantity are required",
            });
        }
        if (!mongoose_1.default.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }
        if (quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative",
            });
        }
        const productExists = await product_model_1.ProductModel.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }
        const inventoryExists = await inventory_model_1.InventoryModel.findOne({ productId });
        if (inventoryExists) {
            return res.status(409).json({
                message: "Inventory already exists for this product",
            });
        }
        const inventory = await inventory_model_1.InventoryModel.create({
            productId,
            quantity,
            minThreshold,
        });
        res.status(201).json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create inventory" });
    }
};
exports.createInventory = createInventory;
// Get All Inventory
const getInventories = async (req, res) => {
    try {
        const inventories = await inventory_model_1.InventoryModel.find()
            .populate("productId", "name price status")
            .sort({ createdAt: -1 });
        res.status(200).json(inventories);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch inventories" });
    }
};
exports.getInventories = getInventories;
// Get Inventory By Id
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid inventory id" });
        }
        const inventory = await inventory_model_1.InventoryModel.findById(id).populate("productId", "name price status");
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch inventory" });
    }
};
exports.getInventoryById = getInventoryById;
// Update Inventory
const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, minThreshold } = req.body;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid inventory id" });
        }
        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative",
            });
        }
        if (minThreshold !== undefined && minThreshold < 0) {
            return res.status(400).json({
                message: "minThreshold cannot be negative",
            });
        }
        const inventory = await inventory_model_1.InventoryModel.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        if (quantity !== undefined)
            inventory.quantity = quantity;
        if (minThreshold !== undefined)
            inventory.minThreshold = minThreshold;
        await inventory.save();
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update inventory" });
    }
};
exports.updateInventory = updateInventory;
// Delete Inventory
const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid inventory id" });
        }
        const inventory = await inventory_model_1.InventoryModel.findByIdAndDelete(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({
            message: "Inventory deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete inventory" });
    }
};
exports.deleteInventory = deleteInventory;
// Get Low Stock Inventory
const getLowStockInventory = async (req, res) => {
    try {
        const lowStock = await inventory_model_1.InventoryModel.find({
            $expr: { $lte: ["$quantity", "$minThreshold"] },
        }).populate("productId", "name price");
        res.status(200).json(lowStock);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch low stock inventory",
        });
    }
};
exports.getLowStockInventory = getLowStockInventory;
//# sourceMappingURL=inventory.controller.js.map