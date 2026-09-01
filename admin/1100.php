<?php
/**
 * Admin login — a 3-step gate (access code → name → password) reached only via
 * this obscure path (no "login"/"admin-login" URL exists anywhere in this app).
 *
 * Each step is rate-limited independently and the whole flow expires after
 * GATE_TIMEOUT_SECONDS if not completed, forcing a restart from step 1.
 * Nothing sensitive is ever echoed back into a form's value="" attribute, and
 * every form disables autocomplete — see the note in DEPLOY.md about the
 * limits of what HTML alone can do to stop a browser's own save-password UI.
 */
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';

if (is_logged_in()) {
    header('Location: index.php');
    exit;
}

const GATE_TIMEOUT_SECONDS = 600; // 10 minutes to complete all 3 steps

if (empty($_SESSION['gate_stage'])) {
    $_SESSION['gate_stage'] = 'code';
    $_SESSION['gate_started_at'] = time();
}

if (time() - ($_SESSION['gate_started_at'] ?? 0) > GATE_TIMEOUT_SECONDS) {
    $_SESSION['gate_stage'] = 'code';
    $_SESSION['gate_started_at'] = time();
    unset($_SESSION['gate_admin_id']);
}

$error = '';
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $submittedStage = $_POST['stage'] ?? '';

    if ($submittedStage !== $_SESSION['gate_stage']) {
        $_SESSION['gate_stage'] = 'code';
        $_SESSION['gate_started_at'] = time();
        unset($_SESSION['gate_admin_id']);
        $error = 'That took too long — please start again.';
    } elseif ($_SESSION['gate_stage'] === 'code') {
        if (!check_rate_limit('admin_gate_code', 8, 30)) {
            $error = 'Too many attempts from this connection. Please try again later.';
        } else {
            $code = trim((string) ($_POST['code'] ?? ''));
            if ($code !== '' && hash_equals(GATE_CODE, $code)) {
                $_SESSION['gate_stage'] = 'name';
                session_regenerate_id(true);
            } else {
                $error = 'Incorrect code.';
            }
        }
    } elseif ($_SESSION['gate_stage'] === 'name') {
        if (!check_rate_limit('admin_gate_name', 8, 30)) {
            $error = 'Too many attempts from this connection. Please try again later.';
        } else {
            $username = trim((string) ($_POST['name'] ?? ''));
            $stmt = $pdo->prepare('SELECT id FROM admin_users WHERE username = :username LIMIT 1');
            $stmt->execute(['username' => $username]);
            $admin = $stmt->fetch();
            if ($admin) {
                $_SESSION['gate_admin_id'] = $admin['id'];
                $_SESSION['gate_stage'] = 'password';
                session_regenerate_id(true);
            } else {
                $error = 'Not recognized.';
            }
        }
    } elseif ($_SESSION['gate_stage'] === 'password') {
        if (!check_rate_limit('admin_gate_password', 8, 30)) {
            $error = 'Too many attempts from this connection. Please try again later.';
        } else {
            $password = (string) ($_POST['password'] ?? '');
            $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $_SESSION['gate_admin_id'] ?? 0]);
            $admin = $stmt->fetch();

            if (!$admin) {
                $_SESSION['gate_stage'] = 'code';
                $error = 'Session error — please start again.';
            } elseif ($admin['locked_until'] && strtotime($admin['locked_until']) > time()) {
                $error = 'Account temporarily locked due to repeated failed attempts. Try again later.';
            } elseif (!password_verify($password, $admin['password_hash'])) {
                $attempts = (int) $admin['failed_attempts'] + 1;
                $lockedUntil = null;
                if ($attempts >= 5) {
                    $lockedUntil = date('Y-m-d H:i:s', time() + 15 * 60);
                    $attempts = 0;
                }
                $upd = $pdo->prepare('UPDATE admin_users SET failed_attempts = :a, locked_until = :l WHERE id = :id');
                $upd->execute(['a' => $attempts, 'l' => $lockedUntil, 'id' => $admin['id']]);
                $error = $lockedUntil ? 'Too many failed attempts. Account locked for 15 minutes.' : 'Incorrect password.';
                $_SESSION['gate_stage'] = 'code';
            } else {
                session_regenerate_id(true);
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_username'] = $admin['username'];
                $upd = $pdo->prepare('UPDATE admin_users SET failed_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = :id');
                $upd->execute(['id' => $admin['id']]);

                unset($_SESSION['gate_stage'], $_SESSION['gate_started_at'], $_SESSION['gate_admin_id']);
                header('Location: index.php');
                exit;
            }
        }
    }
}

$stage = $_SESSION['gate_stage'];

$labels = [
    'code' => ['title' => 'Access Code', 'hint' => 'Step 1 of 3'],
    'name' => ['title' => 'Verify Your Name', 'hint' => 'Step 2 of 3'],
    'password' => ['title' => 'Password', 'hint' => 'Step 3 of 3'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Access · TheCampusVoice</title>
<link rel="stylesheet" href="assets/admin.css">
<meta name="robots" content="noindex, nofollow">
</head>
<body>
<div class="login-wrap">
  <div class="login-box">
    <h1>TheCampusVoice</h1>
    <p><?= e($labels[$stage]['hint']) ?> — <?= e($labels[$stage]['title']) ?></p>

    <?php if ($error): ?>
      <div class="alert alert-error"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="post" autocomplete="off">
      <?php csrf_field(); ?>
      <input type="hidden" name="stage" value="<?= e($stage) ?>">

      <?php if ($stage === 'code'): ?>
        <div class="form-group">
          <label>Access Code</label>
          <input type="text" inputmode="numeric" name="code" autocomplete="off" autofocus required>
        </div>
      <?php elseif ($stage === 'name'): ?>
        <div class="form-group">
          <label>Verify Your Name</label>
          <input type="text" name="name" autocomplete="off" autofocus required>
        </div>
      <?php else: ?>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" autocomplete="off" autofocus required>
        </div>
      <?php endif; ?>

      <button type="submit" class="btn btn-primary" style="width:100%">Continue</button>
    </form>
  </div>
</div>
</body>
</html>
