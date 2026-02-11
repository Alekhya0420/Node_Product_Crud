// import { Router } from "express";
// import {
//   createCategory,
//   getCategories,
//   getCategoryById,
//   updateCategory,
//   deleteCategory,
//   updateCategoryStatus,
// } from "../controllers/category.controller";
// import { authMiddleware } from "../middlewares/auth.middleware";

// const router = Router();
// router.use(authMiddleware);

// router.get("/getallCategories", getCategories);
// router.get("/:id", getCategoryById);
// router.post("/create-category", createCategory);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);
// router.patch("/:id", updateCategoryStatus);

// export default router;

import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "../controllers/category.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middlewares";

const router = Router();

/* PUBLIC / USER ACCESS*/

// Anyone logged-in can view categories
router.get("/getallCategories", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getCategoryById);

/* ADMIN ONLY ACCESS*/

router.post(
  "/create-category",
  authMiddleware,
  authorize("admin"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteCategory
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  updateCategoryStatus
);

export default router;
