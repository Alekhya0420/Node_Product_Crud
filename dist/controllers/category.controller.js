"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/category.model");
/**CREATE CATEGORY,One category can have many products,A product cannot belong to another category*/
const createCategory = async (req, res) => {
    try {
        const { name, products } = req.body;
        if (!name || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Name and products are required",
            });
        }
        const categoryPresent = await category_model_1.CategoryModel.findOne({ name });
        if (categoryPresent) {
            return res.status(409).json({
                message: "Category already exists, you can't create category with same name",
            });
        }
        //Check if any product already exists in another category
        const productConflict = await category_model_1.CategoryModel.findOne({
            products: { $in: products },
        });
        if (productConflict) {
            return res.status(409).json({
                message: "One or more products are already assigned to another category",
            });
        }
        //Create category
        const category = await category_model_1.CategoryModel.create({
            name,
            products,
        });
        return res.status(201).json({
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        console.error("Error is", error);
        return res.status(500).json({
            message: "Failed to create category",
        });
    }
};
exports.createCategory = createCategory;
/** GET ALL CATEGORIES (Admin View) */
const getCategories = async (req, res) => {
    try {
        // pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        // filters
        const search = req.query.search;
        const status = req.query.status;
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (status && ["active", "inactive"].includes(status)) {
            filter.status = status;
        }
        const categories = await category_model_1.CategoryModel.find(filter)
            .populate("products", "name price status")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await category_model_1.CategoryModel.countDocuments(filter);
        res.status(200).json({
            totalData: {
                totalDocs: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit,
            },
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
/** GET CATEGORY BY ID */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.CategoryModel.findById(id);
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch category" });
    }
};
exports.getCategoryById = getCategoryById;
/** UPDATE CATEGORY (Change products safely) */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const category = await category_model_1.CategoryModel.findByIdAndUpdate(id, { name, status }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update category" });
    }
};
exports.updateCategory = updateCategory;
/** DELETE CATEGORY Products remain untouched */
const deleteCategory = async (req, res) => {
    try {
        const category = await category_model_1.CategoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
/** UPDATE CATEGORY STATUS (Active / Inactive) */
const updateCategoryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Status must be active or inactive",
            });
        }
        const category = await category_model_1.CategoryModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category status updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update status" });
    }
};
exports.updateCategoryStatus = updateCategoryStatus;
//# sourceMappingURL=category.controller.js.map