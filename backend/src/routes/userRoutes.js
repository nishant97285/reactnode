import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProfile, updateProfile,
  getCoins,
  getAddresses, addAddress, deleteAddress, setDefaultAddress,
  getWishlist, addToWishlist, getMyWallet, removeFromWishlist,
} from "../controllers/userController.js";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

router.get("/coins", authMiddleware, getCoins);

router.get("/addresses", authMiddleware, getAddresses);
router.post("/addresses", authMiddleware, addAddress);
router.delete("/addresses/:id", authMiddleware, deleteAddress);
router.put("/addresses/:id/default", authMiddleware, setDefaultAddress);

router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist", authMiddleware, addToWishlist);
router.delete("/wishlist/:id", authMiddleware, removeFromWishlist);

router.get("/wallet", authMiddleware, getMyWallet);

export default router;