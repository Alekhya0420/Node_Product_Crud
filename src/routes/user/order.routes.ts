import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middlewares";
import {
  placeOrder,
  getMyOrders,
} from "../../controllers/user/order.controller";

const router = Router();

router.post("/place-order", authMiddleware, authorize("user"), placeOrder);
router.get("/get-my-order", authMiddleware, authorize("user"), getMyOrders);

export default router;
