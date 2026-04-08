import pool from './src/config/db.js';

async function checkData() {
  try {
    const [rows] = await pool.query("SELECT * FROM max_withdraw_history");
    console.log("Withdrawal History Records:");
    console.table(rows);
    
    const [users] = await pool.query("SELECT id, referral_code FROM users");
    console.log("Current Users and Referral Codes:");
    console.table(users);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
