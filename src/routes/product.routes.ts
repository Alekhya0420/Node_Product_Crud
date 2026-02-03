import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('file'), createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
