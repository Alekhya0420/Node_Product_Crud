import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
} from '../controllers/product.controller';
import { upload } from '../middlewares/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

//api endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single("file"), createProduct);
router.put('/:id',upload.single("file"), updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id', updateProductStatus);


export default router;
