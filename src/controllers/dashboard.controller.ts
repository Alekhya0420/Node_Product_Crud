import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";
import { SupplierModel } from "../models/supplier.model";
import { InventoryModel } from "../models/inventory.model";
import { Request, Response } from "express";


export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    // Products
    const totalProducts = await ProductModel.countDocuments();
    const activeProducts = await ProductModel.countDocuments({ status: "active" });
    const inactiveProducts = await ProductModel.countDocuments({ status: "inactive" });

    // Categories
    const totalCategories = await CategoryModel.countDocuments();
    const activeCategories = await CategoryModel.countDocuments({ status: "active" });
    const inactiveCategories = await CategoryModel.countDocuments({ status: "inactive" });

    // Suppliers
    const totalSuppliers = await SupplierModel.countDocuments();

    // Inventory
    const totalInventory = await InventoryModel.countDocuments();
    const lowStock = await InventoryModel.countDocuments({
      $expr: { $lte: ["$quantity", "$minThreshold"] },
    });
    const inStock = await InventoryModel.countDocuments({
      quantity: { $gt: 0 },
    });
    const outOfStock = await InventoryModel.countDocuments({
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

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch dashboard summary",
    });
  }
};
