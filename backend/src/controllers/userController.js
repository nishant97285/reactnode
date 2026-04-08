import pool from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, dob, gender, coins, referral_code, topup_wallet, commission_wallet, city, state, pincode, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });

    const user = rows[0];

    // Get total withdrawn from max_withdraw_history
    const [withdrawnRows] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM max_withdraw_history 
       WHERE userid = ? AND (status = 'A' OR status = 'P')`,
      [user.referral_code]
    );
    user.total_withdrawn = withdrawnRows[0].total;

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ["name", "phone", "dob", "gender", "city", "state", "pincode"];
    const queryParts = [];
    const values = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        queryParts.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (queryParts.length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    values.push(req.user.id);
    const sql = `UPDATE users SET ${queryParts.join(", ")} WHERE id = ?`;

    await pool.query(sql, values);
    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getCoins = async (req, res) => {
  try {
    const [user] = await pool.query("SELECT coins FROM users WHERE id = ?", [req.user.id]);
    const [history] = await pool.query(
      "SELECT * FROM coin_transactions WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ coins: user[0].coins, history });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM addresses WHERE user_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { label, name, phone, line1, city, state, pincode } = req.body;
    await pool.query(
      "INSERT INTO addresses (user_id, label, name, phone, line1, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, label, name, phone, line1, city, state, pincode]
    );
    res.status(201).json({ message: "Address added successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await pool.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Address deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    await pool.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [req.user.id]);
    await pool.query("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Default address updated." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? ORDER BY added_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { product_name, price, original_price, discount, image_url, rating, reviews } = req.body;
    await pool.query(
      "INSERT INTO wishlist (user_id, product_name, price, original_price, discount, image_url, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, product_name, price, original_price, discount, image_url, rating, reviews]
    );
    res.status(201).json({ message: "Added to wishlist." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// GET USER WALLET — user apna balance dekhe
export const getMyWallet = async (req, res) => {
  try {
    const [userWallet] = await pool.query(
      `SELECT 
         COALESCE(topup_wallet, 0) AS topup_wallet,
         COALESCE(commission_wallet, 0) AS commission_wallet,
         COALESCE(growth_wallet, 0) AS growth_wallet
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (userWallet.length === 0) return res.status(404).json({ message: "User not found." });

    const { topup_wallet, commission_wallet, growth_wallet } = userWallet[0];
    const total_balance = parseFloat(topup_wallet) + parseFloat(commission_wallet) + parseFloat(growth_wallet);

    const [transactions] = await pool.query(
      `SELECT wt.*, a.name as admin_name 
       FROM wallet_transactions wt 
       LEFT JOIN admins a ON wt.admin_id = a.id 
       WHERE wt.user_id = ? 
       ORDER BY wt.created_at DESC`,
      [req.user.id]
    );

    res.json({
      balance: topup_wallet,
      topup_wallet,
      commission_wallet,
      growth_wallet,
      total_balance,
      transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await pool.query("DELETE FROM wishlist WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Removed from wishlist." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};