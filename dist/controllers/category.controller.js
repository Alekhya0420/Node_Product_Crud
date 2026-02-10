"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/category.model");
/**CREATE CATEGORY,One category can have many products,A product cannot belong to another category*/
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Category name is  required",
            });
        }
        //if category name already exist,you can't again create the same category
        const cateGoryPresent = await category_model_1.CategoryModel.findOne({ name });
        if (cateGoryPresent) {
            return res.status(409).json({
                message: "Category already exist,You cant create category with same name",
            });
        }
        const category = await category_model_1.CategoryModel.create({
            name,
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
};
exports.createCategory = createCategory;
/** GET ALL CATEGORIES (Admin View) */
const getCategories = async (req, res) => {
    try {
        const categories = await category_model_1.CategoryModel.find()
            .populate("products", "name price status")
            .sort({ createdAt: -1 });
        res.status(200).json(categories);
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