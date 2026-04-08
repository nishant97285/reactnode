import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getOrders, placeOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/", authMiddleware, getOrders);
router.post("/", authMiddleware, placeOrder);

export default router;