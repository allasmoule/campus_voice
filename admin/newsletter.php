<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';
require_login();

$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $id = (int) ($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    if ($action === 'toggle') {
        $stmt = $pdo->prepare('SELECT status FROM newsletter_subscribers WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $current = $stmt->fetchColumn();
        if ($current === 'subscribed') {
            $upd = $pdo->prepare('UPDATE newsletter_subscribers SET status = "unsubscribed", unsubscribed_at = NOW() WHERE id = :id');
        } else {
            $upd = $pdo->prepare('UPDATE newsletter_subscribers SET status = "subscribed", unsubscribed_at = NULL WHERE id = :id');
        }
        $upd->execute(['id' => $id]);
    }
    header('Location: newsletter.php');
    exit;
}

if (($_GET['export'] ?? '') === 'csv') {
    $rows = $pdo->query('SELECT email, status, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC')->fetchAll();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="newsletter-subscribers.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['email', 'status', 'subscribed_at']);
    foreach ($rows as $row) fputcsv($out, $row);
    fclose($out);
    exit;
}

$total = (int) $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'subscribed'")->fetchColumn();
$rows = $pdo->query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 500')->fetchAll();

$pageTitle = 'Newsletter';
require __DIR__ . '/includes/header.php';
?>

<div class="stat-grid">
  <div class="stat-tile"><div class="num"><?= $total ?></div><div class="label">Active Subscribers</div></div>
</div>

<div class="admin-card">
  <div class="flex-between" style="margin-bottom:14px;">
    <strong>Subscribers</strong>
    <a href="?export=csv" class="btn btn-outline btn-sm">Export CSV →</a>
  </div>
  <table>
    <thead><tr><th>Email</th><th>Status</th><th>Subscribed</th><th></th></tr></thead>
    <tbody>
      <?php foreach ($rows as $row): ?>
      <tr>
        <td><?= e($row['email']) ?></td>
        <td><span class="badge badge-<?= e($row['status']) ?>"><?= e($row['status']) ?></span></td>
        <td><?= e($row['subscribed_at']) ?></td>
        <td>
          <form method="post" style="display:inline;">
            <?php csrf_field(); ?>
            <input type="hidden" name="id" value="<?= (int) $row['id'] ?>">
            <input type="hidden" name="action" value="toggle">
            <button type="submit" class="btn btn-outline btn-sm">
              <?= $row['status'] === 'subscribed' ? 'Unsubscribe' : 'Resubscribe' ?>
            </button>
          </form>
        </td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($rows)): ?>
      <tr><td colspan="4" class="muted">No subscribers yet.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
