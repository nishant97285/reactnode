import pool from "./src/config/db.js";

async function migrate() {
  try {
    console.log("🚀 Starting Database Migration...");

    // 1. Drop and Recreate max_stake_history
    console.log("⏳ Recreating max_stake_history...");
    await pool.query("DROP TABLE IF EXISTS max_stake_history");
    await pool.query(`
      CREATE TABLE max_stake_history (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        userid         VARCHAR(100),
        toid           VARCHAR(100),
        amount         DECIMAL(10,2) NOT NULL,
        status         VARCHAR(10)   DEFAULT 'I',
        created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Drop and Recreate max_wallet_history_pending
    console.log("⏳ Recreating max_wallet_history_pending...");
    await pool.query("DROP TABLE IF EXISTS max_wallet_history_pending");
    await pool.query(`
      CREATE TABLE max_wallet_history_pending (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        userid         VARCHAR(100),
        toid           VARCHAR(100),
        amount         DECIMAL(10,2) NOT NULL,
        type           VARCHAR(50)   DEFAULT 'Direct Income',
        status         VARCHAR(10)   DEFAULT 'A',
        created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Drop and Recreate max_withdraw_history
    console.log("⏳ Recreating max_withdraw_history...");
    await pool.query("DROP TABLE IF EXISTS max_withdraw_history");
    await pool.query(`
      CREATE TABLE max_withdraw_history (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        userid         VARCHAR(100),
        amount         DECIMAL(10,2) NOT NULL,
        method         VARCHAR(50),
        details        VARCHAR(255),
        status         VARCHAR(10)   DEFAULT 'P',
        created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Update users table with missing fields
    console.log("⏳ Updating users table schema...");
    try {
      await pool.query("ALTER TABLE users ADD COLUMN city VARCHAR(100) DEFAULT NULL");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN state VARCHAR(100) DEFAULT NULL");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN pincode VARCHAR(10) DEFAULT NULL");
    } catch (e) {}

    console.log("✅ Migration Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration Failed:", err.message);
    process.exit(1);
  }
}

migrate();
