import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSupplier } from "../controllers/supplier.controller";

const router = Router();
router.use(authMiddleware)

//api endpoints
router.post("/create-supplier",createSupplier);

export default router;