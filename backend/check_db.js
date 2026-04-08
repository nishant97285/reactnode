import pool from "./src/config/db.js";

async function checkSchema() {
  try {
    const [rows] = await pool.query("DESCRIBE max_stake_history");
    console.log("max_stake_history schema:", rows);
    const [rows2] = await pool.query("DESCRIBE max_wallet_history_pending");
    console.log("max_wallet_history_pending schema:", rows2);
    process.exit(0);
  } catch (err) {
    console.error("Error checking schema:", err.message);
    process.exit(1);
  }
}

checkSchema();
