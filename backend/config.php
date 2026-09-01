<?php
// Local development override: if backend/config.local.php exists (gitignored,
// never deployed), use it instead — keeps these production placeholders untouched.
if (file_exists(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
    return;
}

/**
 * Fill these in with the values cPanel gives you after you:
 *  1) MySQL Databases → create a database + a user, add the user to the database (ALL PRIVILEGES).
 *  2) Note the DB name/user cPanel generates — they're usually prefixed, e.g. cpaneluser_campusvoice.
 *
 * Keep this file outside of any publicly-downloadable path other than being executed by PHP
 * (it already is safe: it only defines constants, it does not output anything).
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'thecampu_abcxyz_campusvoice');
define('DB_USER', 'thecampu_cvuser');
define('DB_PASS', 'Voice!@_Pass2620!#');

// Used only to one-way hash visitor IPs for rate-limiting. Change this to any random string
// before going live — it does not need to be memorized or shared.
define('IP_HASH_SALT', 'cpanel_campusvoice_live_salt_2026');

// Site origin, used for cookie settings in the admin panel.
define('SITE_IS_HTTPS', true);

/**
 * Admin login "gate" — a static access code required before the username/password
 * prompt even appears (see admin/1100.php). This is an obscurity layer on top of
 * real auth, not a replacement for it — its only real protection is the strict
 * rate-limiting in admin/1100.php, since a 4-digit code has just 10,000 possibilities.
 * Change this to your own value whenever you like; it does not need to be secret-grade.
 */
define('GATE_CODE', '1103');
