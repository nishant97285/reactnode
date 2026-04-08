import { Router } from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  adminLogin,
  getAllUsers,
  getUserById,
  impersonateUser,
  getUserTeam,
  getWallet,
  updateWallet,
  getWithdrawals,
  updateWithdrawal,
  getActivations,
  updateActivation,
  getSupportTickets,
  updateSupportTicket,
  addIncome,
  changeAdminPassword,
} from "../controllers/adminController.js";

const router = Router();

// ── Public (no token needed) ──
router.post("/login", adminLogin);

// ── Users ──
router.get("/users",                    adminMiddleware, getAllUsers);
router.get("/users/:id",                adminMiddleware, getUserById);
router.post("/users/:id/impersonate",   adminMiddleware, impersonateUser);
router.get("/users/:id/team",           adminMiddleware, getUserTeam);
router.get("/users/:id/wallet",         adminMiddleware, getWallet);

// ── Wallet ──
router.post("/wallet/update",           adminMiddleware, updateWallet);

// ── Withdrawals ──
router.get("/withdrawals",              adminMiddleware, getWithdrawals);
router.put("/withdrawals/:id",          adminMiddleware, updateWithdrawal);

// ── Activations ──
router.get("/activations",              adminMiddleware, getActivations);
router.put("/activations/:id",          adminMiddleware, updateActivation);

// ── Support Tickets ──
router.get("/support",                  adminMiddleware, getSupportTickets);
router.put("/support/:id",              adminMiddleware, updateSupportTicket);

// ── Income ──
router.post("/income",                  adminMiddleware, addIncome);

// ── Settings ──
router.post("/settings/password",       adminMiddleware, changeAdminPassword);

export default router;