import pool from './src/config/db.js';

async function debug() {
  try {
    const [history] = await pool.query("SELECT * FROM max_withdraw_history");
    console.log("HISTORY DATA:");
    history.forEach(h => console.log(`ID: ${h.id}, UserID: ${h.userid}, Amount: ${h.amount}, Status: ${h.status}`));
    
    const [users] = await pool.query("SELECT id, referral_code FROM users");
    console.log("\nUSER DATA:");
    users.forEach(u => console.log(`ID: ${u.id}, ReferralCode: ${u.referral_code}`));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
