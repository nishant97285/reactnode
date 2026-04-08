import pool from './src/config/db.js';

async function finalCheck() {
  try {
    const [h1] = await pool.query("SELECT * FROM max_withdraw_history LIMIT 10");
    console.log("MAX_WITHDRAW_HISTORY (new):", h1.length, "rows found");
    if (h1.length > 0) console.table(h1);

    const [h2] = await pool.query("SELECT * FROM withdrawals LIMIT 10");
    console.log("WITHDRAWALS (old):", h2.length, "rows found");
    if (h2.length > 0) console.table(h2);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

finalCheck();
