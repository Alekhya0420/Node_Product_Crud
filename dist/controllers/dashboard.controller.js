"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const product_model_1 = require("../models/product.model");
const category_model_1 = require("../models/category.model");
const supplier_model_1 = require("../models/supplier.model");
const inventory_model_1 = require("../models/inventory.model");
const getDashboardSummary = async (req, res) => {
    try {
        // Products
        const totalProducts = await product_model_1.ProductModel.countDocuments();
        const activeProducts = await product_model_1.ProductModel.countDocuments({ status: "active" });
        const inactiveProducts = await product_model_1.ProductModel.countDocuments({ status: "inactive" });
        // Categories
        const totalCategories = await category_model_1.CategoryModel.countDocuments();
        const activeCategories = await category_model_1.CategoryModel.countDocuments({ status: "active" });
        const inactiveCategories = await category_model_1.CategoryModel.countDocuments({ status: "inactive" });
        // Suppliers
        const totalSuppliers = await supplier_model_1.SupplierModel.countDocuments();
        // Inventory
        const totalInventory = await inventory_model_1.InventoryModel.countDocuments();
        const lowStock = await inventory_model_1.InventoryModel.countDocuments({
            $expr: { $lte: ["$quantity", "$minThreshold"] },
        });
        const inStock = await inventory_model_1.InventoryModel.countDocuments({
            quantity: { $gt: 0 },
        });
        const outOfStock = await inventory_model_1.InventoryModel.countDocuments({
            quantity: 0,
        });
        return res.status(200).json({
            products: {
                total: totalProducts,
                active: activeProducts,
                inactive: inactiveProducts,
            },
            categories: {
                total: totalCategories,
                active: activeCategories,
                inactive: inactiveCategories,
            },
            suppliers: {
                total: totalSuppliers,
            },
            inventory: {
                total: totalInventory,
                inStock,
                outOfStock,
                lowStock,
                notLowStock: totalInventory - lowStock,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch dashboard summary",
        });
    }
};
exports.getDashboardSummary = getDashboardSummary;
//# sourceMappingURL=dashboard.controller.js.map