import { Request, Response } from "express";
import { CategoryModel } from "../models/category.model";

/**CREATE CATEGORY,One category can have many products,A product cannot belong to another category*/
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, products } = req.body;

    if (!name || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Name and products are required",
      });
    }

    const categoryPresent = await CategoryModel.findOne({ name });

    if (categoryPresent) {
      return res.status(409).json({
        message:
          "Category already exists, you can't create category with same name",
      });
    }
   //Check if any product already exists in another category
    const productConflict = await CategoryModel.findOne({
      products: { $in: products },
    });

    if (productConflict) {
      return res.status(409).json({
        message:
          "One or more products are already assigned to another category",
      });
    }
    //Create category
    const category = await CategoryModel.create({
      name,
      products,
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {
    console.error("Error is", error);
    return res.status(500).json({
      message: "Failed to create category",
    });
  }
};


/** GET ALL CATEGORIES (Admin View) */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find()
      .populate("products", "name price status")
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
    console.info('categories are',categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/** GET CATEGORY BY ID */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

/** UPDATE CATEGORY (Change products safely) */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, status },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
};

/** DELETE CATEGORY Products remain untouched */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/** UPDATE CATEGORY STATUS (Active / Inactive) */
export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be active or inactive",
      });
    }

    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category status updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
