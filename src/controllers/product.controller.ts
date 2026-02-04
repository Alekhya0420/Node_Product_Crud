import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { Product } from "../types/product.type";

//1)GET all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    // pagination
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    //filters
    const search = req.query.search as string;
    const status = req.query.status as string;

    const filter: any = {};

    //search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    //filter by status (exact match)
    if (status && ["active", "inactive"].includes(status)) {
      filter.status = status;
    }

    //query
    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 }) //This means newest items first
      .skip(skip)
      .limit(limit);

    //total count (same filter!)
    const total = await ProductModel.countDocuments(filter);

    //response
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

//2)GET product by ID
export const getProductById = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

//3)CREATE product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, status } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const productData: Product = {
      name,
      price,
      status,
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
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

//4)UPDATE product
export const updateProduct = async (req: Request, res: Response) => {
  const updateData: any = { ...req.body };

  if (req.file) {
    updateData.file = {
      url: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    };
  }

  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true },
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

//5)DELETE product
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ message: "Product deleted successfully" });
};

//6)STATUS CHANGE of a product
export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be active or inactive",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
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
