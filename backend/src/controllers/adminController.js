import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// ── ADMIN LOGIN ──────────────────────────────────────────────────────────────
// Admin apna email + password deta hai → JWT token milta hai with role: "admin"
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (admins.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });

    const admin = admins[0];


    const isMatch = password === admin.password ||
      await bcrypt.compare(password, admin.password).catch(() => false);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful!",
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET ALL USERS (search + pagination) ──────────────────────────────────────
// Users list with search by name/email/referral_code + pagination
export const getAllUsers = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const search = req.query.search          || "";
    const offset = (page - 1) * limit;
    const q      = `%${search}%`;

    const [users] = await pool.query(
      `SELECT id, name, email, phone, coins, topup_wallet, commission_wallet, growth_wallet, referral_code, referred_by, role, created_at
       FROM users
       WHERE name LIKE ? OR email LIKE ? OR referral_code LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [q, q, q, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ? OR referral_code LIKE ?",
      [q, q, q]
    );

    res.json({ users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET SINGLE USER ───────────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, coins, topup_wallet, commission_wallet, growth_wallet, referral_code, referred_by, role, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── IMPERSONATE USER ──────────────────────────────────────────────────────────
// Admin kisi bhi user ke account mein login kar sakta hai
// Frontend mein user ka token save hota hai, admin token backup mein
export const impersonateUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });

    const user  = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, impersonated: true, adminId: req.admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: `Logged in as ${user.name}`,
      token,
      user: { id: user.id, name: user.name, email: user.email, coins: user.coins, referral_code: user.referral_code },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET USER TEAM (multi-level recursive) ────────────────────────────────────
// Ek user ki puri team tree — level 1, 2, 3... tak recursively fetch
export const getUserTeam = async (req, res) => {
  try {
    const [[user]] = await pool.query("SELECT referral_code FROM users WHERE id = ?", [req.params.id]);
    if (!user) return res.status(404).json({ message: "User not found." });

    const buildTeam = async (referralCode, level = 1, maxLevel = 10) => {
      if (level > maxLevel) return [];
      const [members] = await pool.query(
        "SELECT id, name, email, referral_code, coins, created_at FROM users WHERE referred_by = ?",
        [referralCode]
      );
      return Promise.all(members.map(async (m) => ({
        ...m, level,
        team: await buildTeam(m.referral_code, level + 1, maxLevel),
      })));
    };

    const team = await buildTeam(user.referral_code);
    const countMembers = (arr) => arr.reduce((acc, m) => acc + 1 + countMembers(m.team), 0);

    res.json({ total_members: countMembers(team), team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET USER WALLET ───────────────────────────────────────────────────────────
// Kisi bhi user ka wallet balance + paginated transaction history
export const getWallet = async (req, res) => {
  try {
    const userId = req.params.id;
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [userId]);
    if (wallet.length === 0) {
      await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [userId]);
      [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [userId]);
    }

    const [transactions] = await pool.query(
      `SELECT wt.*, a.name as admin_name
       FROM wallet_transactions wt
       LEFT JOIN admins a ON wt.admin_id = a.id
       WHERE wt.user_id = ?
       ORDER BY wt.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = ?", [userId]
    );

    res.json({
      balance: wallet[0].balance,
      transactions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE WALLET (credit / debit) ───────────────────────────────────────────
// Admin kisi bhi user ka wallet credit ya debit kar sakta hai
export const updateWallet = async (req, res) => {
  try {
    const { user_id, type, amount, note } = req.body;

    if (!user_id || !type || !amount)
      return res.status(400).json({ message: "user_id, type and amount required." });
    if (!["credit", "debit"].includes(type))
      return res.status(400).json({ message: "Type must be credit or debit." });
    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0." });

    let [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [user_id]);
    if (wallet.length === 0) {
      await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [user_id]);
      [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [user_id]);
    }

    const current    = parseFloat(wallet[0].balance);
    if (type === "debit" && current < amount)
      return res.status(400).json({ message: "Insufficient wallet balance." });

    const newBalance = type === "credit" ? current + parseFloat(amount) : current - parseFloat(amount);

    await pool.query("UPDATE wallet SET balance = ? WHERE user_id = ?", [newBalance, user_id]);
    await pool.query(
      "INSERT INTO wallet_transactions (user_id, admin_id, type, amount, note) VALUES (?, ?, ?, ?, ?)",
      [user_id, req.admin.id, type, amount, note || null]
    );

    res.json({ message: `Wallet ${type}ed successfully!`, new_balance: newBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET WITHDRAWALS ───────────────────────────────────────────────────────────
// Saare users ke withdrawal requests — status filter ke saath
export const getWithdrawals = async (req, res) => {
  try {
    const status = req.query.status || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = status ? "WHERE w.status = ?" : "";
    const params      = status ? [status, limit, offset] : [limit, offset];

    const [withdrawals] = await pool.query(
      `SELECT w.*, u.name as user_name, u.referral_code
       FROM withdrawals w
       JOIN users u ON w.user_id = u.id
       ${whereClause}
       ORDER BY w.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = status ? [status] : [];
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM withdrawals ${status ? "WHERE status = ?" : ""}`,
      countParams
    );

    res.json({ withdrawals, total, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE WITHDRAWAL STATUS ──────────────────────────────────────────────────
// Admin withdrawal approve (Paid) ya reject (Rejected) karta hai
// Reject hone pe wallet mein amount wapas credit ho jaata hai
export const updateWithdrawal = async (req, res) => {
  try {
    const { status } = req.body;
    const { id }     = req.params;

    if (!["Paid", "Rejected"].includes(status))
      return res.status(400).json({ message: "Status must be Paid or Rejected." });

    const [[withdrawal]] = await pool.query("SELECT * FROM withdrawals WHERE id = ?", [id]);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found." });
    if (withdrawal.status !== "Pending")
      return res.status(400).json({ message: "Only pending withdrawals can be updated." });

    await pool.query("UPDATE withdrawals SET status = ? WHERE id = ?", [status, id]);

    // Refund wallet if rejected
    if (status === "Rejected") {
      await pool.query("UPDATE wallet SET balance = balance + ? WHERE user_id = ?",
        [withdrawal.amount, withdrawal.user_id]);
      await pool.query(
        "INSERT INTO wallet_transactions (user_id, admin_id, type, amount, note) VALUES (?, ?, ?, ?, ?)",
        [withdrawal.user_id, req.admin.id, "credit", withdrawal.amount, "Withdrawal rejected — refund"]
      );
    }

    res.json({ message: `Withdrawal ${status.toLowerCase()} successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET ACTIVATIONS ───────────────────────────────────────────────────────────
// Saare activation requests — status filter ke saath
export const getActivations = async (req, res) => {
  try {
    const status = req.query.status || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = status ? "WHERE a.status = ?" : "";
    const params      = status ? [status, limit, offset] : [limit, offset];

    const [activations] = await pool.query(
      `SELECT a.*, u.name as member_name, u.referral_code
       FROM activations a
       JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = status ? [status] : [];
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM activations ${status ? "WHERE status = ?" : ""}`,
      countParams
    );

    res.json({ activations, total, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE ACTIVATION STATUS ──────────────────────────────────────────────────
// Admin activation approve (Active) ya reject (Rejected) karta hai
export const updateActivation = async (req, res) => {
  try {
    const { status } = req.body;
    const { id }     = req.params;

    if (!["Active", "Rejected"].includes(status))
      return res.status(400).json({ message: "Status must be Active or Rejected." });

    const [[activation]] = await pool.query("SELECT * FROM activations WHERE id = ?", [id]);
    if (!activation) return res.status(404).json({ message: "Activation not found." });

    await pool.query("UPDATE activations SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: `Activation ${status.toLowerCase()} successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET SUPPORT TICKETS ───────────────────────────────────────────────────────
// Saare support tickets — status filter ke saath
export const getSupportTickets = async (req, res) => {
  try {
    const status = req.query.status || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = status ? "WHERE st.status = ?" : "";
    const params      = status ? [status, limit, offset] : [limit, offset];

    const [tickets] = await pool.query(
      `SELECT st.*, u.name as user_name, u.email as user_email
       FROM support_tickets st
       JOIN users u ON st.user_id = u.id
       ${whereClause}
       ORDER BY st.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const countParams = status ? [status] : [];
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM support_tickets ${status ? "WHERE status = ?" : ""}`,
      countParams
    );

    res.json({ tickets, total, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE SUPPORT TICKET ─────────────────────────────────────────────────────
// Admin ticket close karta hai + optional reply
// support_tickets table mein reply column add karna hoga
export const updateSupportTicket = async (req, res) => {
  try {
    const { status, reply } = req.body;
    const { id }            = req.params;

    if (!["In Progress", "Closed"].includes(status))
      return res.status(400).json({ message: "Status must be In Progress or Closed." });

    await pool.query(
      "UPDATE support_tickets SET status = ?, reply = ? WHERE id = ?",
      [status, reply || null, id]
    );

    res.json({ message: "Ticket updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADD INCOME TO USER ────────────────────────────────────────────────────────
// Admin manually kisi user ko income credit kar sakta hai
export const addIncome = async (req, res) => {
  try {
    const { user_id, type, from_user, amount, status } = req.body;

    if (!user_id || !type || !amount)
      return res.status(400).json({ message: "user_id, type and amount required." });

    const [user] = await pool.query("SELECT id FROM users WHERE id = ?", [user_id]);
    if (user.length === 0) return res.status(404).json({ message: "User not found." });

    await pool.query(
      "INSERT INTO income (user_id, type, from_user, amount, status) VALUES (?, ?, ?, ?, ?)",
      [user_id, type, from_user || "Admin", amount, status || "Paid"]
    );

    res.status(201).json({ message: "Income added successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN CHANGE PASSWORD ─────────────────────────────────────────────────────
// Admin apna password change karta hai
export const changeAdminPassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password)
      return res.status(400).json({ message: "Both fields are required." });
    if (new_password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    const [[admin]] = await pool.query("SELECT password FROM admins WHERE id = ?", [req.admin.id]);

    // Support both plain text and hashed passwords
    const isMatch = current_password === admin.password ||
      await bcrypt.compare(current_password, admin.password).catch(() => false);

    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect." });

    const hashed = await bcrypt.hash(new_password, 12);
    await pool.query("UPDATE admins SET password = ? WHERE id = ?", [hashed, req.admin.id]);

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};