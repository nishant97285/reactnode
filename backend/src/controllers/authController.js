import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Generate referral code: US + zero-padded ID (e.g. US00042)
const generateUserCode = (id) => `US${String(id).padStart(5, "0")}`;

// ── REGISTER ──
export const register = async (req, res) => {
  try {
    const { username, email, password, referral_code } = req.body;

    // Check email exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered." });

    // Validate referral code
    const [referrer] = await pool.query(
      "SELECT id FROM users WHERE referral_code = ?",
      [referral_code.trim()]
    );
    if (referrer.length === 0)
      return res.status(400).json({ message: "Invalid referral code." });

    const referredBy = referral_code.trim();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user first (without referral_code — we need ID first)
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, coins, referred_by) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, 0, referredBy]
    );

    // Now generate referral code using the new user's ID: US00042
    const newReferralCode = generateUserCode(result.insertId);

    // Update user with their referral code
    await pool.query(
      "UPDATE users SET referral_code = ? WHERE id = ?",
      [newReferralCode, result.insertId]
    );

    // Give referrer 50 coins bonus
    await pool.query("UPDATE users SET coins = coins + 50 WHERE referral_code = ?", [referredBy]);
    await pool.query(
      "INSERT INTO coin_transactions (user_id, label, coins, type) SELECT id, 'Referral Bonus', 50, 'earned' FROM users WHERE referral_code = ?",
      [referredBy]
    );

    // Give new user 20 welcome coins
    await pool.query("UPDATE users SET coins = coins + 20 WHERE id = ?", [result.insertId]);
    await pool.query(
      "INSERT INTO coin_transactions (user_id, label, coins, type) VALUES (?, ?, ?, ?)",
      [result.insertId, "Welcome Referral Bonus", 20, "earned"]
    );

    // Create wallet for new user
    await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [result.insertId]);

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      referral_code: newReferralCode,
      user: { id: result.insertId, name: username, email, coins: 20, referral_code: newReferralCode },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── LOGIN ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(401).json({ message: "Invalid email or password." });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, name: user.name, email: user.email, coins: user.coins, referral_code: user.referral_code },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};