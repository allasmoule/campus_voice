<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_login();

$pdo = get_db();

$counts = $pdo->query(
    "SELECT status, COUNT(*) c FROM submissions GROUP BY status"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$pending = (int) ($counts['pending'] ?? 0);
$flagged = (int) ($counts['flagged'] ?? 0);
$approved = (int) ($counts['approved'] ?? 0);
$rejected = (int) ($counts['rejected'] ?? 0);

$surveyCount = (int) $pdo->query('SELECT COUNT(*) FROM survey_responses')->fetchColumn();
$subscriberCount = (int) $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'subscribed'")->fetchColumn();
$publishedCount = (int) $pdo->query('SELECT COUNT(*) FROM published_stories')->fetchColumn();

$recent = $pdo->query(
    "SELECT id, category, role, LEFT(narrative_text, 120) AS preview, status, created_at
     FROM submissions ORDER BY created_at DESC LIMIT 8"
)->fetchAll();

$pageTitle = 'Dashboard';
require __DIR__ . '/includes/header.php';
?>

<div class="stat-grid">
  <div class="stat-tile"><div class="num"><?= $pending + $flagged ?></div><div class="label">Awaiting Review</div></div>
  <div class="stat-tile"><div class="num"><?= $publishedCount ?></div><div class="label">Published Stories</div></div>
  <div class="stat-tile"><div class="num"><?= $surveyCount ?></div><div class="label">Survey Responses</div></div>
  <div class="stat-tile"><div class="num"><?= $subscriberCount ?></div><div class="label">Newsletter Subscribers</div></div>
</div>

<div class="admin-card">
  <div class="flex-between" style="margin-bottom: 14px;">
    <strong>Recent Submissions</strong>
    <a href="submissions.php" class="btn btn-outline btn-sm">View all →</a>
  </div>
  <table>
    <thead>
      <tr><th>Category</th><th>Role</th><th>Preview</th><th>Status</th><th>Submitted</th><th></th></tr>
    </thead>
    <tbody>
      <?php foreach ($recent as $row): ?>
      <tr>
        <td><?= e($row['category']) ?></td>
        <td><?= e($row['role']) ?></td>
        <td><?= e($row['preview']) ?>&hellip;</td>
        <td><span class="badge badge-<?= e($row['status']) ?>"><?= e($row['status']) ?></span></td>
        <td><?= e($row['created_at']) ?></td>
        <td><a href="submission-view.php?id=<?= (int) $row['id'] ?>" class="btn btn-outline btn-sm">Review</a></td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($recent)): ?>
      <tr><td colspan="6" class="muted">No submissions yet.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
