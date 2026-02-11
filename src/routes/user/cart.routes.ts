import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middlewares";
import { addToCart,getMyCart,removeFromCart } from "../../controllers/user/cart.controller";

const router = Router();

router.post("/", authMiddleware, authorize("user"), addToCart);
router.get("/", authMiddleware, authorize("user"), getMyCart);
router.delete("/", authMiddleware, authorize("user"), removeFromCart);

export default router;
