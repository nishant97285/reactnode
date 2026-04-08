import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const ensureUserWalletColumns = async () => {
  try {
    const ensureColumn = async (column, definition) => {
      const [rows] = await pool.query("SHOW COLUMNS FROM users LIKE ?", [column]);
      if (rows.length === 0) {
        await pool.query(`ALTER TABLE users ADD COLUMN ${definition}`);
      }
    };

    await ensureColumn("topup_wallet", "topup_wallet DECIMAL(10,2) DEFAULT 0.00");
    await ensureColumn("commission_wallet", "commission_wallet DECIMAL(10,2) DEFAULT 0.00");
    await ensureColumn("growth_wallet", "growth_wallet DECIMAL(10,2) DEFAULT 0.00");
    await ensureColumn("city", "city VARCHAR(100) DEFAULT NULL");
    await ensureColumn("state", "state VARCHAR(100) DEFAULT NULL");
    await ensureColumn("pincode", "pincode VARCHAR(10) DEFAULT NULL");
  } catch (err) {
    console.error("⚠️ Could not ensure user wallet columns:", err.message);
  }
};

ensureUserWalletColumns();

pool.getConnection()
  .then((conn) => {
    console.log("✅ MySQL Connected Successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err.message);
  });

export default pool;