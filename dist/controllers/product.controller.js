"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStatus = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("../models/product.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getProducts = async (req, res) => {
    try {
        // pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;
        // filters
        const search = req.query.search;
        const status = req.query.status;
        const supplierId = req.query.supplierId;
        const categoryId = req.query.categoryId;
        const filter = {};
        // search by name
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        // filter by status
        if (status && ["active", "inactive"].includes(status)) {
            filter.status = status;
        }
        // filter by supplier
        if (supplierId && mongoose_1.default.isValidObjectId(supplierId)) {
            filter.supplierId = supplierId;
        }
        // filter by category
        if (categoryId && mongoose_1.default.isValidObjectId(categoryId)) {
            filter.categoryId = categoryId;
        }
        // query
        const products = await product_model_1.ProductModel.find(filter)
            .populate("supplierId", "name status")
            .populate("categoryId", "name status")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await product_model_1.ProductModel.countDocuments(filter);
        res.status(200).json({
            totalData: {
                totalDocs: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit,
            },
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const product = await product_model_1.ProductModel.findById(id)
            .populate("supplierId", "name status")
            .populate("categoryId", "name status");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, price, status, supplierId, categoryId } = req.body;
        if (!name || typeof name !== "string" || !name.trim() || price === undefined || !supplierId || !categoryId) {
            return res.status(400).json({
                message: "Name, price, supplierId and categoryId are required",
            });
        }
        const nameExisting = await product_model_1.ProductModel.findOne({ name });
        if (nameExisting) {
            return res.status(409).json({
                message: "Product name is already present, please use another name",
            });
        }
        if (!mongoose_1.default.isValidObjectId(supplierId) || !mongoose_1.default.isValidObjectId(categoryId)) {
            return res.status(400).json({
                message: "Invalid supplierId or categoryId",
            });
        }
        const productData = {
            name,
            price,
            status,
            supplierId,
            categoryId,
        };
        if (req.file) {
            productData.file = {
                url: req.file.location,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
            };
        }
        const product = await product_model_1.ProductModel.create(productData);
        res.status(201).json(product);
    }
    catch {
        res.status(500).json({ message: "Failed to create product" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        // Get existing product FIRST
        const existingProduct = await product_model_1.ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updateData = { ...req.body };
        // If new image uploaded → delete old image
        if (req.file) {
            if (existingProduct.file?.url) {
                const oldImagePath = path_1.default.join(process.cwd(), existingProduct.file.url);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err)
                        console.warn("Old image delete failed:", err.message);
                });
            }
            updateData.file = {
                url: req.file.location,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
            };
        }
        // 3️⃣ Update product
        const product = await product_model_1.ProductModel.findByIdAndUpdate(id, updateData, {
            new: true,
        })
            .populate("supplierId", "name status")
            .populate("categoryId", "name status");
        res.status(200).json(product);
    }
    catch {
        res.status(500).json({ message: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const product = await product_model_1.ProductModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Status must be active or inactive",
            });
        }
        const product = await product_model_1.ProductModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Status updated successfully",
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product status" });
    }
};
exports.updateProductStatus = updateProductStatus;
//# sourceMappingURL=product.controller.js.map