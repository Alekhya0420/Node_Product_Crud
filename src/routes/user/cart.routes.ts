import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middlewares";
import { addToCart,getMyCart,removeFromCart } from "../../controllers/user/cart.controller";

const router = Router();

router.post("/add-to-cart", authMiddleware, authorize("user"), addToCart);
router.get("/get-cart", authMiddleware, authorize("user"), getMyCart);
router.delete("/remove-cart", authMiddleware, authorize("user"), removeFromCart);

export default router;
