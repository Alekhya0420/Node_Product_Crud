import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductModel } from "../models/product.model";
import { Product } from "../types/product.type";
import fs from "fs";
import path from "path";


export const getProducts = async (req: Request, res: Response) => {
  try {
    // pagination
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 10, 1),
      100
    );
    const skip = (page - 1) * limit;

    // filters
    const search = req.query.search as string;
    const status = req.query.status as string;
    const supplierId = req.query.supplierId as string;
    const categoryId = req.query.categoryId as string;

    const filter: any = {};

    // search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // filter by status
    if (status && ["active", "inactive"].includes(status)) {
      filter.status = status;
    }

    // filter by supplier
    if (supplierId && mongoose.isValidObjectId(supplierId)) {
      filter.supplierId = supplierId;
    }

    // filter by category
    if (categoryId && mongoose.isValidObjectId(categoryId)) {
      filter.categoryId = categoryId;
    }

    // query
    const products = await ProductModel.find(filter)
      .populate("supplierId", "name status")
      .populate("categoryId", "name status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filter);

    res.status(200).json({
      totalData: {
        totalDocs: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await ProductModel.findById(id)
      .populate("supplierId", "name status")
      .populate("categoryId", "name status");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, status, supplierId, categoryId } = req.body;

    if (!name || typeof name !== "string" || !name.trim() || price === undefined || !supplierId || !categoryId) {
      return res.status(400).json({
        message: "Name, price, supplierId and categoryId are required",
      });
    }
 
    const nameExisting = await ProductModel.findOne({name});
    if (nameExisting) {
      return res.status(409).json({
        message: "Product name is already present, please use another name",
      });
    }

    if (!mongoose.isValidObjectId(supplierId) || !mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({
        message: "Invalid supplierId or categoryId",
      });
    }

    const productData: Product = {
      name,
      price,
      status,
      supplierId,
      categoryId,
    };

    if (req.file) {
      productData.file = {
        url: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
    }

    const product = await ProductModel.create(productData);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Failed to create product" });
  }
};



export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Get existing product FIRST
    const existingProduct = await ProductModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData: any = { ...req.body };
    // If new image uploaded → delete old image
    if (req.file) {
      if (existingProduct.file?.url) {
        const oldImagePath = path.join(process.cwd(), existingProduct.file.url);

        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn("Old image delete failed:", err.message);
        });
      }

      updateData.file = {
        url: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
    }

    // 3️⃣ Update product
    const product = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("supplierId", "name status")
      .populate("categoryId", "name status");

    res.status(200).json(product);
  } catch {
    res.status(500).json({ message: "Failed to update product" });
  }
};



export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};


export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be active or inactive",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product status" });
  }
};
