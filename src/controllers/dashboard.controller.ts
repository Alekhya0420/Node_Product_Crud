import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";
import { SupplierModel } from "../models/supplier.model";
import { InventoryModel } from "../models/inventory.model";
import { Request, Response } from "express";


export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const totalProducts = await ProductModel.countDocuments();
    const totalCategories = await CategoryModel.countDocuments();
    const totalSuppliers = await SupplierModel.countDocuments();

    const lowStockProducts = await InventoryModel.countDocuments({
      quantity: { $lt: 10 },
    });

    const inactiveCategories = await CategoryModel.countDocuments({
      status: "inactive",
    });

    return res.status(200).json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockProducts,
      inactiveCategories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch dashboard summary",
    });
  }
};
