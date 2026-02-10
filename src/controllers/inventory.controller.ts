import { Request, Response } from "express";
import mongoose from "mongoose";
import { InventoryModel } from "../models/inventory.model";
import { ProductModel } from "../models/product.model";

// Create Inventory
export const createInventory = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, minThreshold } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "productId and quantity are required",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const inventoryExists = await InventoryModel.findOne({ productId });
    if (inventoryExists) {
      return res.status(409).json({
        message: "Inventory already exists for this product",
      });
    }

    const inventory = await InventoryModel.create({
      productId,
      quantity,
      minThreshold,
    });

    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to create inventory" });
  }
};

// Get All Inventory
export const getInventories = async (req: Request, res: Response) => {
  try {
    const inventories = await InventoryModel.find()
      .populate("productId", "name price status")
      .sort({ createdAt: -1 });

    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventories" });
  }
};

// Get Inventory By Id
export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid inventory id" });
    }

    const inventory = await InventoryModel.findById(id).populate(
      "productId",
      "name price status"
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

// Update Inventory
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, minThreshold } = req.body;

    if (!mongoose.isValidObjectId(id)) {
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

    const inventory = await InventoryModel.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (quantity !== undefined) inventory.quantity = quantity;
    if (minThreshold !== undefined) inventory.minThreshold = minThreshold;

    await inventory.save();

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update inventory" });
  }
};

// Delete Inventory
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid inventory id" });
    }

    const inventory = await InventoryModel.findByIdAndDelete(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.status(200).json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory" });
  }
};

// Get Low Stock Inventory
export const getLowStockInventory = async (req: Request, res: Response) => {
  try {
    const lowStock = await InventoryModel.find({
      $expr: { $lte: ["$quantity", "$minThreshold"] },
    }).populate("productId", "name price");

    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch low stock inventory",
    });
  }
};
