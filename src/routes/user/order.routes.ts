import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middlewares";
import {
  placeOrder,
  getMyOrders,
} from "../../controllers/user/order.controller";

const router = Router();

router.post("/", authMiddleware, authorize("user"), placeOrder);
router.get("/", authMiddleware, authorize("user"), getMyOrders);

export default router;
