<?php
/**
 * One-time first-admin-account creator.
 * DELETE THIS FILE from the server immediately after you've created your account —
 * it refuses to run again once an admin_users row exists, but there's no reason to leave it up.
 */
require_once __DIR__ . '/includes/bootstrap.php';

$pdo = get_db();
$existing = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();

$error = '';
$done = false;

if ($existing > 0) {
    $error = 'Setup has already been completed — an admin account already exists (the seed account from schema.sql, or one created earlier). Delete this file (admin/setup.php) now. Log in at admin/1100.php.';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    $confirm = (string) ($_POST['confirm'] ?? '');

    if (strlen($username) < 3) {
        $error = 'Username must be at least 3 characters.';
    } elseif (strlen($password) < 10) {
        $error = 'Password must be at least 10 characters.';
    } elseif ($password !== $confirm) {
        $error = 'Passwords do not match.';
    } else {
        $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (:username, :hash)');
        $stmt->execute(['username' => $username, 'hash' => password_hash($password, PASSWORD_DEFAULT)]);
        $done = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Setup · TheCampusVoice</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="login-wrap">
  <div class="login-box">
    <h1>Create Admin Account</h1>
    <p>One-time setup. This page disables itself afterward — delete it from the server once done.</p>

    <?php if ($error): ?>
      <div class="alert alert-error"><?= e($error) ?></div>
    <?php endif; ?>

    <?php if ($done): ?>
      <div class="alert alert-success">Account created. <a href="1100.php">Go to login →</a></div>
      <p class="muted">Now delete <code>admin/setup.php</code> from your server (via cPanel File Manager or FTP).</p>
    <?php elseif ($existing === 0): ?>
      <form method="post">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" required minlength="3">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required minlength="10">
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirm" required minlength="10">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">Create Account</button>
      </form>
    <?php endif; ?>
  </div>
</div>
</body>
</html>
