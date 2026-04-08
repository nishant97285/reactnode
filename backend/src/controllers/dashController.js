import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// ── BALANCE ──────────────────────────────────────────────────────────────────

export const getBalance = async (req, res) => {
  try {
    const [userWallet] = await pool.query(
      `SELECT 
         COALESCE(topup_wallet, 0) AS topup_wallet,
         COALESCE(commission_wallet, 0) AS commission_wallet,
         COALESCE(growth_wallet, 0) AS growth_wallet
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (userWallet.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const { topup_wallet, commission_wallet, growth_wallet } = userWallet[0];
    const [withdrawnRows] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM max_withdraw_history 
       WHERE userid = (SELECT referral_code FROM users WHERE id = ?) AND (status = 'A' OR status = 'P')`,
      [req.user.id]
    );
    const withdrawn = withdrawnRows[0];

    res.json({
      wallet_balance: topup_wallet,
      commission_wallet,
      growth_wallet,
      total_withdrawn: withdrawn.total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── TEAM ─────────────────────────────────────────────────────────────────────

// Direct team — level 1 only (users who used my referral code)
export const getDirectTeam = async (req, res) => {
  try {
    // Get logged in user's referral code
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    const [members] = await pool.query(
      `SELECT id, name, email, referral_code, coins, created_at
       FROM users
       WHERE referred_by = ?
       ORDER BY created_at DESC`,
      [user.referral_code]
    );

    res.json({ total: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All team — multi-level recursive
export const getAllTeam = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    // Recursive fetch — level by level up to 10 levels
    const buildTeam = async (referralCode, level = 1, maxLevel = 10) => {
      if (level > maxLevel) return [];

      const [members] = await pool.query(
        "SELECT id, name, email, referral_code, coins, created_at FROM users WHERE referred_by = ?",
        [referralCode]
      );

      const membersWithTeam = await Promise.all(
        members.map(async (member) => ({
          ...member,
          level,
          sub_team: await buildTeam(member.referral_code, level + 1, maxLevel),
        }))
      );

      return membersWithTeam;
    };

    const team = await buildTeam(user.referral_code);

    // Flatten for table view
    const flatten = (arr) =>
      arr.reduce((acc, m) => {
        const { sub_team, ...rest } = m;
        return [...acc, rest, ...flatten(sub_team)];
      }, []);

    const flatTeam = flatten(team);

    res.json({ total: flatTeam.length, members: flatTeam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ACTIVATION ───────────────────────────────────────────────────────────────

export const activateId = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { member_id, amount } = req.body;

    if (!member_id || !amount)
      return res.status(400).json({ message: "All fields are required." });

    if (isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid amount." });

    // 1. Check if target member exists
    const [[targetUser]] = await connection.query(
      "SELECT id, name, referred_by, referral_code FROM users WHERE referral_code = ?",
      [member_id]
    );
    if (!targetUser)
      return res.status(404).json({ message: "Member ID not found." });

    // 2. Check if logged-in user has enough balance in topup_wallet
    const [[currentUser]] = await connection.query(
      "SELECT topup_wallet, referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!currentUser)
      return res.status(404).json({ message: "Current user not found." });

    if (currentUser.referral_code === member_id)
      return res.status(400).json({ message: "You cannot activate your own ID through this form." });

    if (currentUser.topup_wallet < amount)
      return res.status(400).json({ message: "Insufficient balance in topup_wallet." });

    await connection.beginTransaction();

    // 3. Deduct from topup_wallet of the logged-in user
    await connection.query(
      "UPDATE users SET topup_wallet = topup_wallet - ? WHERE id = ?",
      [amount, req.user.id]
    );

    // 4. Update target user status to Active (A)
    await connection.query(
      "UPDATE users SET status = 'A' WHERE id = ?",
      [targetUser.id]
    );

    // 5. Insert into activations history
    await connection.query(
      "INSERT INTO activations (user_id, package_name, amount, status) VALUES (?, ?, ?, ?)",
      [targetUser.id, 'Manual Topup', amount, "Active"]
    );

    // 6. Insert into max_stake_history
    await connection.query(
      "INSERT INTO max_stake_history (userid, toid, amount, status) VALUES (?, ?, ?, ?)",
      [currentUser.referral_code, targetUser.referral_code, amount, "I"]
    );

    // 7. Direct Income Logic (10% to sponsor if Active)
    if (targetUser.referred_by) {
      const [[sponsor]] = await connection.query(
        "SELECT id, referral_code, status FROM users WHERE referral_code = ?",
        [targetUser.referred_by]
      );

      if (sponsor && sponsor.status === 'A') {
        const bonusAmount = amount * 0.1;
        // Credit to commission_wallet
        await connection.query(
          "UPDATE users SET commission_wallet = commission_wallet + ? WHERE id = ?",
          [bonusAmount, sponsor.id]
        );

        // Log in income table
        await connection.query(
          "INSERT INTO income (user_id, type, from_user, amount, status) VALUES (?, ?, ?, ?, ?)",
          [sponsor.id, 'Direct Income', member_id, bonusAmount, 'Paid']
        );

        // Log in max_wallet_history
        await connection.query(
          "INSERT INTO max_wallet_history_pending (userid, toid, amount, type, status) VALUES (?, ?, ?, ?, ?)",
          [sponsor.referral_code, member_id, bonusAmount, 'Direct Income', 'A']
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: "ID activated successfully!" });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) connection.release();
  }
};

export const getActivationHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as member_name, u.referral_code
       FROM activations a
       JOIN users u ON a.user_id = u.id
       WHERE a.user_id IN (
         SELECT id FROM users WHERE referred_by = (
           SELECT referral_code FROM users WHERE id = ?
         )
       )
       OR a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id, req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStakeHistory = async (req, res) => {
  try {
    const [[currentUser]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const [rows] = await pool.query(
      `SELECT m.*, u.name as member_name, ab.name as activated_by_name
       FROM max_stake_history m
       LEFT JOIN users u ON m.toid = u.referral_code
       LEFT JOIN users ab ON m.userid = ab.referral_code
       WHERE m.userid = ? OR m.toid = ?
       ORDER BY m.created_at DESC`,
      [currentUser.referral_code, currentUser.referral_code]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWalletHistory = async (req, res) => {
  try {
    const [[currentUser]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const [rows] = await pool.query(
      `SELECT m.*, u.name as member_name, to_u.name as target_name
       FROM max_wallet_history m
       LEFT JOIN users u ON m.userid = u.referral_code
       LEFT JOIN users to_u ON m.toid = to_u.referral_code
       WHERE m.userid = ? OR m.toid = ?
       ORDER BY m.created_at DESC`,
      [currentUser.referral_code, currentUser.referral_code]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── INCOME ───────────────────────────────────────────────────────────────────

export const getAllIncome = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM income WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReferralIncome = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM income WHERE user_id = ? AND type = 'Referral Income' ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── WITHDRAWAL ───────────────────────────────────────────────────────────────

export const requestWithdrawal = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { amount } = req.body;
    const method = req.body.method || "Withdrawal";
    const details = req.body.details || "";

    if (!amount)
      return res.status(400).json({ message: "Amount is required." });

    if (amount < 500)
      return res.status(400).json({ message: "Minimum withdrawal amount is ₹500." });

    await connection.beginTransaction();

    // Check user balance and get referral code
    const [[user]] = await connection.query(
      "SELECT commission_wallet, referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found." });
    }

    const balance = parseFloat(user.commission_wallet || 0);
    if (balance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "insufficient balance in income wallet" });
    }

    // Deduct from commission_wallet
    await connection.query(
      "UPDATE users SET commission_wallet = commission_wallet - ? WHERE id = ?",
      [amount, req.user.id]
    );


    // Create withdrawal record in max_withdraw_history
    await connection.query(
      "INSERT INTO max_withdraw_history (userid, amount, method, details, status) VALUES (?, ?, ?, ?, ?)",
      [user.referral_code, amount, method, details, "P"]
    );

    await connection.commit();
    res.status(201).json({ message: "Withdrawal request submitted successfully!" });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) connection.release();
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    const [rows] = await pool.query(
      "SELECT * FROM max_withdraw_history WHERE userid = ? ORDER BY created_at DESC",
      [user.referral_code]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── SUPPORT ──────────────────────────────────────────────────────────────────

export const submitTicket = async (req, res) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !message)
      return res.status(400).json({ message: "Subject and message are required." });

    await pool.query(
      "INSERT INTO support_tickets (user_id, subject, category, message, status) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, subject, category || "Other", message, "Open"]
    );

    res.status(201).json({ message: "Support ticket submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CHANGE PASSWORD ──────────────────────────────────────────────────────────

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password)
      return res.status(400).json({ message: "Both fields are required." });

    if (new_password.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters." });

    // Get current password hash
    const [[user]] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect." });

    const hashedNew = await bcrypt.hash(new_password, 12);
    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedNew, req.user.id]
    );

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};