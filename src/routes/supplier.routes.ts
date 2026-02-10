import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  getOneSupplier,
  getUpdateSupplier,bulkDeleteSupplier
} from "../controllers/supplier.controller";

const router = Router();
router.use(authMiddleware);

//api endpoints
router.post("/create-supplier", createSupplier);
router.get("/", getAllSupplier);
router.get("/:id", getOneSupplier);
router.patch("/:id",getUpdateSupplier);
router.delete("/bulk", bulkDeleteSupplier);
router.delete("/:id",deleteSupplier)


export default router;
