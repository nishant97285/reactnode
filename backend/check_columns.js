import pool from './src/config/db.js';

async function check() {
  try {
    const [rows] = await pool.query("DESCRIBE users");
    console.log("Users Table Structure:");
    rows.forEach(r => console.log(`${r.Field}: ${r.Type}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
