// import { Router } from 'express';
// import {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   updateProductStatus
// } from '../controllers/product.controller';
// import { upload } from '../middlewares/multer';
// import { authMiddleware } from '../middlewares/auth.middleware';

// const router = Router();
// router.use(authMiddleware);

// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.post('/', upload.single("file"), createProduct);
// router.patch('/:id',upload.single("file"), updateProduct);
// router.delete('/:id', deleteProduct);
// router.patch('/:id', updateProductStatus);


// export default router;

import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/product.controller";
import { upload } from "../middlewares/multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middlewares";

const router = Router();

router.get("/", authMiddleware, authorize("admin", "user"), getProducts);
router.get("/:id", authMiddleware, authorize("admin", "user"), getProductById);
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  upload.single("file"),
  createProduct
);
router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  upload.single("file"),
  updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteProduct
);
router.patch(
  "/status/:id",
  authMiddleware,
  authorize("admin"),
  updateProductStatus
);

export default router;
