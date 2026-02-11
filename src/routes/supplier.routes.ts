// import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.middleware";
// import {
//   createSupplier,
//   deleteSupplier,
//   getAllSupplier,
//   getOneSupplier,
//   getUpdateSupplier,bulkDeleteSupplier
// } from "../controllers/supplier.controller";

// const router = Router();
// router.use(authMiddleware);

// router.post("/create-supplier", createSupplier);
// router.get("/", getAllSupplier);
// router.get("/:id", getOneSupplier);
// router.patch("/:id",getUpdateSupplier);
// router.delete("/bulk", bulkDeleteSupplier);
// router.delete("/:id",deleteSupplier)


// export default router;

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middlewares";
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  getOneSupplier,
  getUpdateSupplier,
  bulkDeleteSupplier,
} from "../controllers/supplier.controller";

const router = Router();

router.get("/", authMiddleware, authorize("admin", "user"), getAllSupplier);

router.get("/:id", authMiddleware, authorize("admin", "user"), getOneSupplier);

router.post(
  "/create-supplier",
  authMiddleware,
  authorize("admin"),
  createSupplier
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin"),
  getUpdateSupplier
);

router.delete(
  "/bulk",
  authMiddleware,
  authorize("admin"),
  bulkDeleteSupplier
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteSupplier
);

export default router;
