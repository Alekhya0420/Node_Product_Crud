import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSupplier,getAllSupplier,getSupplierUpdate } from "../controllers/supplier.controller";

const router = Router();
router.use(authMiddleware)

//api endpoints
router.post("/create-supplier",createSupplier);
router.get('/',getAllSupplier);
router.patch('/:id',getSupplierUpdate);

export default router;