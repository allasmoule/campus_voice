<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_login();

$pdo = get_db();

$validStatuses = ['pending', 'flagged', 'approved', 'rejected', 'all'];
$status = $_GET['status'] ?? 'pending';
if (!in_array($status, $validStatuses, true)) {
    $status = 'pending';
}

if ($status === 'all') {
    $stmt = $pdo->query(
        "SELECT id, category, role, institution_type, academic_area, LEFT(narrative_text, 140) AS preview, flags, status, created_at
         FROM submissions ORDER BY created_at DESC LIMIT 200"
    );
} else {
    $stmt = $pdo->prepare(
        "SELECT id, category, role, institution_type, academic_area, LEFT(narrative_text, 140) AS preview, flags, status, created_at
         FROM submissions WHERE status = :status ORDER BY created_at DESC LIMIT 200"
    );
    $stmt->execute(['status' => $status]);
}
$rows = $stmt->fetchAll();

$pageTitle = 'Submissions Queue';
require __DIR__ . '/includes/header.php';
?>

<div class="filters">
  <a href="?status=pending" class="<?= $status === 'pending' ? 'active' : '' ?>">Pending</a>
  <a href="?status=flagged" class="<?= $status === 'flagged' ? 'active' : '' ?>">Flagged</a>
  <a href="?status=approved" class="<?= $status === 'approved' ? 'active' : '' ?>">Approved</a>
  <a href="?status=rejected" class="<?= $status === 'rejected' ? 'active' : '' ?>">Rejected</a>
  <a href="?status=all" class="<?= $status === 'all' ? 'active' : '' ?>">All</a>
</div>

<div class="admin-card">
  <table>
    <thead>
      <tr><th>ID</th><th>Category</th><th>Role</th><th>Preview</th><th>Flags</th><th>Status</th><th>Submitted</th><th></th></tr>
    </thead>
    <tbody>
      <?php foreach ($rows as $row): $flags = $row['flags'] ? json_decode($row['flags'], true) : []; ?>
      <tr>
        <td>#<?= (int) $row['id'] ?></td>
        <td><?= e($row['category']) ?></td>
        <td><?= e($row['role']) ?></td>
        <td style="max-width:280px"><?= e($row['preview']) ?>&hellip;</td>
        <td class="muted"><?= $flags ? e(implode('; ', $flags)) : '—' ?></td>
        <td><span class="badge badge-<?= e($row['status']) ?>"><?= e($row['status']) ?></span></td>
        <td><?= e($row['created_at']) ?></td>
        <td><a href="submission-view.php?id=<?= (int) $row['id'] ?>" class="btn btn-outline btn-sm">Review</a></td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($rows)): ?>
      <tr><td colspan="8" class="muted">Nothing here.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
