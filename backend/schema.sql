CREATE DATABASE IF NOT EXISTS kapiva;
USE kapiva;
 
-- ── 1. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  phone           VARCHAR(15),
  dob             DATE,
  gender          ENUM('Male','Female','Other'),
  coins           INT           DEFAULT 0,
  topup_wallet    DECIMAL(10,2) DEFAULT 0.00,
  commission_wallet DECIMAL(10,2) DEFAULT 0.00,
  growth_wallet   DECIMAL(10,2) DEFAULT 0.00,
  referral_code   VARCHAR(20)   UNIQUE,
  referred_by     VARCHAR(20)   DEFAULT NULL,
  role            ENUM('user','admin') DEFAULT 'user',
  status          ENUM('A','P')        DEFAULT 'P',
  city            VARCHAR(100) DEFAULT NULL,
  state           VARCHAR(100) DEFAULT NULL,
  pincode         VARCHAR(10) DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
-- ── 2. ADMINS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
 
-- ── 3. ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  qty          INT          DEFAULT 1,
  status       ENUM('Pending','In Transit','Delivered','Cancelled') DEFAULT 'Pending',
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 4. ADDRESSES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  label      VARCHAR(50)  DEFAULT 'Home',
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(15),
  line1      VARCHAR(255) NOT NULL,
  city       VARCHAR(100) NOT NULL,
  state      VARCHAR(100),
  pincode    VARCHAR(10)  NOT NULL,
  is_default TINYINT(1)   DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 5. WISHLIST ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  product_name   VARCHAR(255)  NOT NULL,
  price          DECIMAL(10,2),
  original_price DECIMAL(10,2),
  discount       INT,
  image_url      VARCHAR(500),
  rating         DECIMAL(2,1),
  reviews        INT,
  added_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 6. COIN TRANSACTIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS coin_transactions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  label      VARCHAR(255),
  coins      INT          NOT NULL,
  type       ENUM('earned','used') NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 7. WALLET ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallet (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT            NOT NULL UNIQUE,
  balance DECIMAL(10,2)  DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 8. WALLET TRANSACTIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT           NOT NULL,
  admin_id   INT           NOT NULL,
  type       ENUM('credit','debit') NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  note       VARCHAR(255),
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 9. ACTIVATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activations (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  package_name   VARCHAR(100)  NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  transaction_id VARCHAR(100),
  status         ENUM('Pending','Active','Expired','Rejected') DEFAULT 'Pending',
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 10. INCOME ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS income (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT           NOT NULL,
  type       ENUM('Referral Income','Direct Income','Level Bonus') NOT NULL,
  from_user  VARCHAR(100),
  amount     DECIMAL(10,2) NOT NULL,
  status     ENUM('Paid','Processing','Pending') DEFAULT 'Paid',
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 11. WITHDRAWALS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawals (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  method         ENUM('Bank Transfer','UPI') NOT NULL,
  account_number VARCHAR(50),
  ifsc_code      VARCHAR(20),
  upi_id         VARCHAR(100),
  transaction_id VARCHAR(100),
  status         ENUM('Pending','Paid','Rejected','Processing') DEFAULT 'Pending',
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- ── 12. SUPPORT TICKETS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  category   VARCHAR(100),
  message    TEXT         NOT NULL,
  reply      TEXT         DEFAULT NULL,
  status     ENUM('Open','In Progress','Closed') DEFAULT 'Open',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 13. MAX STAKE HISTORY ────────────────────────────────────
CREATE TABLE IF NOT EXISTS max_stake_history (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  userid         VARCHAR(100), -- Person who activated (Login User)
  toid           VARCHAR(100), -- Person being activated (Target User)
  amount         DECIMAL(10,2) NOT NULL,
  status         VARCHAR(10)   DEFAULT 'I',
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ── 14. MAX WALLET HISTORY PENDING ──────────────────────────
CREATE TABLE IF NOT EXISTS max_wallet_history_pending (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  userid         VARCHAR(100), -- Person who got the bonus (Sponsor)
  toid           VARCHAR(100), -- Person who was topped up (Target User)
  amount         DECIMAL(10,2) NOT NULL,
  type           VARCHAR(50)   DEFAULT 'Direct Income',
  status         VARCHAR(10)   DEFAULT 'A',
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
-- ── 15. MAX WITHDRAW HISTORY ──────────────────────────────────
CREATE TABLE IF NOT EXISTS max_withdraw_history (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  userid         VARCHAR(100), -- User's referral code
  amount         DECIMAL(10,2) NOT NULL,
  method         VARCHAR(50),
  details        VARCHAR(255), -- Account/UPI details
  status         VARCHAR(10)   DEFAULT 'P', -- P: Pending, A: Approved, R: Rejected
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
-- ============================================================
--  SEED DATA — Admin user (referral chain start karne ke liye)
--  Password: 112233 (plain text — production mein bcrypt hash use karo)
-- ============================================================
 
INSERT INTO admins (name, email, password)
VALUES ('Admin', 'admin@gmail.com', '112233');

INSERT INTO users (name, email, password, coins, referral_code, referred_by, role)
VALUES ('Vivek', 'vivek@gmail.com', '112233', 0, 'KAPIVA2026', NULL, 'user');

USE kapiva;
SHOW TABLES;