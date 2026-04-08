import pool from "../config/db.js";

export const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { product_name, price, qty } = req.body;

    const [result] = await pool.query(
      "INSERT INTO orders (user_id, product_name, price, qty, status) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, product_name, price, qty || 1, "Pending"]
    );

    const coinsEarned = Math.floor(price * 0.05);
    await pool.query("UPDATE users SET coins = coins + ? WHERE id = ?", [coinsEarned, req.user.id]);
    await pool.query(
      "INSERT INTO coin_transactions (user_id, label, coins, type) VALUES (?, ?, ?, ?)",
      [req.user.id, `Order #KAP${result.insertId}`, coinsEarned, "earned"]
    );

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: result.insertId,
      coinsEarned,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};