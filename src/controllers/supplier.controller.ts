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
      return res
        .status(409)
        .json({
          message:
            "Supplier is already present,you can't create supplier with same name",
        });
    }
    const productConflict = await SupplierModel.findOne({
      products: { $in: products },
    });
    if (productConflict) {
      return res
        .status(409)
        .json({
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

