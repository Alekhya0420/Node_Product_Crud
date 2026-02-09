import { Request, Response } from "express";
import { SupplierModel } from "../models/supplier.model";
import { ProductModel } from "../models/product.model";
import mongoose from "mongoose";

//Creating supplier
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, products } = req.body;
    if (!name || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "name and product is requied here" });
    }
    const supplierPreset = await SupplierModel.findOne({ name });
    if (supplierPreset) {
      return res.status(409).json({
        message:
          "Supplier is already present,you can't create supplier with same name",
      });
    }
    const productConflict = await SupplierModel.findOne({
      products: { $in: products },
    });
    if (productConflict) {
      return res.status(409).json({
        message: "This product has already supplied by another supplier",
      });
    }
    const supplier = await SupplierModel.create({ name, products });
    return res
      .status(201)
      .json({ message: "supplier created successfully", data: supplier });
  } catch (error) {
    console.info("Error is", error);
    res.status(500).json({ message: "Failed to create supplier" });
  }
};

// Get all supplier
export const getAllSupplier = async (req: Request, res: Response) => {
  try {
    const allSupplier = await SupplierModel.find().populate(
      "products",
      "name price",
    );
    console.info("total suppliers are", allSupplier);
    res.status(200).json(allSupplier);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching suppliers" });
  }
};
//get one supplier

export const getSupplierUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products cannot be empty",
      });
    }

    if (!products.every((p: string) => mongoose.isValidObjectId(p))) {
      return res.status(400).json({
        message: "Invalid product id(s)",
      });
    }

    const supplier = await SupplierModel.findByIdAndUpdate(
      id,
      {
        name,
        products,
      },
      { new: true }
    ).populate("products", "name price");

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating supplier",
    });
  }
};
