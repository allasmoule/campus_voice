-- TheCampusVoice — MySQL schema
-- Import via cPanel → phpMyAdmin (select your DB first, then Import this file).
-- Designed for MySQL 5.7+ / MariaDB 10.2+ (standard on Namecheap shared hosting).

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- Admin users (the people who can log into /admin)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  failed_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  last_login DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Story submissions ("Share Your Story" form) — anonymous, no submitter identity
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(32) NOT NULL,
  role VARCHAR(64) NOT NULL,
  institution_type VARCHAR(64) NOT NULL,
  academic_area VARCHAR(64) NOT NULL,
  narrative_text TEXT NOT NULL,     -- sanitized rich-text HTML (see backend/sanitize.php)
  cover_image_path VARCHAR(500) NULL,
  flags TEXT NULL,                 -- JSON array of flag strings, NULL if none
  status ENUM('pending','flagged','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Published stories — what the public site actually displays.
-- Populated only when an admin approves a submission.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS published_stories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id INT UNSIGNED NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  excerpt VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,            -- sanitized rich-text HTML
  cover_image_path VARCHAR(500) NULL,
  category VARCHAR(32) NOT NULL,
  category_color VARCHAR(16) NOT NULL,
  read_time TINYINT UNSIGNED NOT NULL DEFAULT 3,
  likes INT UNSIGNED NOT NULL DEFAULT 0,
  dislikes INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_published_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE SET NULL,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Campus climate survey responses — fully anonymous
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS survey_responses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  institution_type VARCHAR(64) NOT NULL,
  role VARCHAR(64) NOT NULL,
  academic_area VARCHAR(64) NOT NULL,
  responses JSON NOT NULL,          -- all Likert answers, keyed by question name
  narrative_text TEXT NULL,
  standout_moment TEXT NULL,
  wish_different TEXT NULL,
  improve_exp TEXT NULL,
  institution_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Newsletter subscribers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
  subscribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Rate-limit log — throttling only, never linked to submission/survey content.
-- Safe to truncate periodically (e.g. a cPanel cron running a cleanup query).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_hash CHAR(64) NOT NULL,
  action VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lookup (ip_hash, action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Ads — managed from admin/ads.php, served publicly from backend/ads.php.
-- Exactly one of media_path (an uploaded file) / media_url (external link) /
-- custom_code is populated, depending on ad_type.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  placeholder VARCHAR(64) NOT NULL, -- exact ad slot key, e.g. "submit-top" — see backend/placeholders.php
  format ENUM('banner','rectangle','leaderboard') NOT NULL, -- derived from placeholder, kept for AdSlot sizing
  ad_type ENUM('image','video','code') NOT NULL,
  title VARCHAR(150) NULL,
  description VARCHAR(300) NULL,
  brand_name VARCHAR(100) NULL,
  cta_text VARCHAR(60) NULL,
  cta_url VARCHAR(500) NULL,
  accent_color VARCHAR(16) NOT NULL DEFAULT '#2563EB',
  media_path VARCHAR(500) NULL,
  media_url VARCHAR(500) NULL,
  custom_code TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_placeholder_active (placeholder, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Site-wide settings — currently just the "advertise with us" contact details
-- shown in the footer and managed from admin/advertising.php.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(64) PRIMARY KEY,
  setting_value TEXT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Advertising inquiries — submitted via the "Contact for Advertising" popup
-- form in the footer. Informational only: payment_method just records what
-- the advertiser says they'd prefer to pay with; no payment is ever actually
-- processed here — an admin follows up manually after reviewing the inquiry.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS advertising_inquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  duration_days SMALLINT UNSIGNED NOT NULL,
  message TEXT NULL,
  ad_type ENUM('image','video','code') NULL,      -- the creative they attached, if any
  media_path VARCHAR(500) NULL,
  media_url VARCHAR(500) NULL,
  custom_code TEXT NULL,
  status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- No seed admin account is created here on purpose — this file is version
-- controlled, and a repo can go public (or already is) at any time. Create
-- your first admin account after importing this schema by visiting
-- admin/setup.php once, then deleting that file. See DEPLOY.md.
-- ---------------------------------------------------------------------------
