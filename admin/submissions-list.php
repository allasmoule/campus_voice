<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/../backend/helpers.php';
require_login();

$pdo = get_db();
$notice = '';
$error = '';

// Handle POST actions (Delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'delete') {
        $deleteId = (int) ($_POST['submission_id'] ?? 0);
        if ($deleteId > 0) {
            $stmt = $pdo->prepare('SELECT cover_image_path FROM submissions WHERE id = :id');
            $stmt->execute(['id' => $deleteId]);
            $sub = $stmt->fetch();

            if ($sub) {
                // Delete corresponding published_stories entry if present
                $delPub = $pdo->prepare('DELETE FROM published_stories WHERE submission_id = :id');
                $delPub->execute(['id' => $deleteId]);

                // Delete from submissions
                $delSub = $pdo->prepare('DELETE FROM submissions WHERE id = :id');
                $delSub->execute(['id' => $deleteId]);

                // Delete cover image file safely if present and matching upload format
                if (!empty($sub['cover_image_path']) && preg_match('#^uploads/submissions/[a-f0-9]{32}\.(jpg|jpeg|png|gif|webp)$#i', ltrim($sub['cover_image_path'], '/'))) {
                    $imgPath = __DIR__ . '/../' . ltrim($sub['cover_image_path'], '/');
                    if (file_exists($imgPath) && is_file($imgPath)) {
                        @unlink($imgPath);
                    }
                }

                $notice = 'Submission #' . $deleteId . ' was permanently deleted.';
            } else {
                $error = 'Submission not found.';
            }
        }
    }
}

// Filter query params
$validStatuses = ['all', 'pending', 'flagged', 'approved', 'rejected'];
$status = $_GET['status'] ?? 'all';
if (!in_array($status, $validStatuses, true)) {
    $status = 'all';
}

$category = trim((string) ($_GET['category'] ?? 'all'));
$year = trim((string) ($_GET['year'] ?? 'all'));
$search = trim((string) ($_GET['q'] ?? ''));

// Get distinct years dynamically
$yearStmt = $pdo->query("SELECT DISTINCT YEAR(created_at) AS yr FROM submissions ORDER BY yr DESC");
$availableYears = array_filter($yearStmt->fetchAll(PDO::FETCH_COLUMN));

// Build SQL filters
$whereClauses = [];
$params = [];

if ($status !== 'all') {
    $whereClauses[] = 'status = :status';
    $params['status'] = $status;
}

if ($category !== 'all' && in_array($category, ALLOWED_CATEGORIES, true)) {
    $whereClauses[] = 'category = :category';
    $params['category'] = $category;
}

if ($year !== 'all' && is_numeric($year)) {
    $whereClauses[] = 'YEAR(created_at) = :year';
    $params['year'] = (int) $year;
}

if ($search !== '') {
    $whereClauses[] = '(narrative_text LIKE :search OR role LIKE :search OR academic_area LIKE :search)';
    $params['search'] = '%' . $search . '%';
}

$whereSql = !empty($whereClauses) ? 'WHERE ' . implode(' AND ', $whereClauses) : '';

$stmt = $pdo->prepare(
    "SELECT id, category, role, institution_type, academic_area, LEFT(narrative_text, 140) AS preview, flags, status, created_at
     FROM submissions {$whereSql} ORDER BY created_at DESC LIMIT 250"
);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$pageTitle = 'Submissions List';
require __DIR__ . '/includes/header.php';
?>

<?php if ($notice): ?><div class="alert alert-success"><?= e($notice) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>

<!-- Multi-criteria Filter Bar -->
<form method="get" class="admin-card" style="padding:16px 20px; margin-bottom:20px;">
  <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
    
    <!-- Status Filter Tabs/Buttons -->
    <div class="filters" style="display:flex; gap:6px; align-items:center; margin-bottom:0;">
      <a href="?status=all&category=<?= e($category) ?>&year=<?= e($year) ?>&q=<?= e(urlencode($search)) ?>" class="<?= $status === 'all' ? 'active' : '' ?>">All Statuses</a>
      <a href="?status=pending&category=<?= e($category) ?>&year=<?= e($year) ?>&q=<?= e(urlencode($search)) ?>" class="<?= $status === 'pending' ? 'active' : '' ?>">Pending</a>
      <a href="?status=flagged&category=<?= e($category) ?>&year=<?= e($year) ?>&q=<?= e(urlencode($search)) ?>" class="<?= $status === 'flagged' ? 'active' : '' ?>">Flagged</a>
      <a href="?status=approved&category=<?= e($category) ?>&year=<?= e($year) ?>&q=<?= e(urlencode($search)) ?>" class="<?= $status === 'approved' ? 'active' : '' ?>">Approved</a>
      <a href="?status=rejected&category=<?= e($category) ?>&year=<?= e($year) ?>&q=<?= e(urlencode($search)) ?>" class="<?= $status === 'rejected' ? 'active' : '' ?>">Rejected</a>
    </div>

    <input type="hidden" name="status" value="<?= e($status) ?>">

    <!-- Category Dropdown -->
    <div style="min-width:160px;">
      <select name="category" onchange="this.form.submit()" style="padding:7px 12px; font-size:13px;">
        <option value="all" <?= $category === 'all' ? 'selected' : '' ?>>All Categories</option>
        <?php foreach (ALLOWED_CATEGORIES as $cat): ?>
          <option value="<?= e($cat) ?>" <?= $category === $cat ? 'selected' : '' ?>><?= e(ucwords(str_replace('-', ' ', $cat))) ?></option>
        <?php endforeach; ?>
      </select>
    </div>

    <!-- Year Dropdown -->
    <div style="min-width:120px;">
      <select name="year" onchange="this.form.submit()" style="padding:7px 12px; font-size:13px;">
        <option value="all" <?= $year === 'all' ? 'selected' : '' ?>>All Years</option>
        <?php foreach ($availableYears as $yr): ?>
          <option value="<?= (int) $yr ?>" <?= (string) $year === (string) $yr ? 'selected' : '' ?>><?= (int) $yr ?></option>
        <?php endforeach; ?>
      </select>
    </div>

    <!-- Search Input -->
    <div style="flex:1; min-width:180px;">
      <input
        type="text"
        name="q"
        placeholder="Search keywords..."
        value="<?= e($search) ?>"
        style="padding:7px 12px; font-size:13px;"
      />
    </div>

    <button type="submit" class="btn btn-outline btn-sm">Filter</button>

    <?php if ($category !== 'all' || $year !== 'all' || $status !== 'all' || $search !== ''): ?>
      <a href="submissions-list.php" class="btn btn-outline btn-sm" style="color:#DC2626; border-color:#FCA5A5;">Reset All</a>
    <?php endif; ?>

  </div>
</form>

<!-- Submissions Table -->
<div class="admin-card">
  <div style="display:flex; justify-between; align-items:center; margin-bottom:14px;">
    <span class="muted" style="font-weight:600;">Total Submissions Found: <?= count($rows) ?></span>
  </div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Role</th>
        <th>Preview</th>
        <th>Flags</th>
        <th>Status</th>
        <th>Submitted</th>
        <th style="text-align:right;">Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($rows as $row): $flags = $row['flags'] ? json_decode($row['flags'], true) : []; ?>
      <tr>
        <td>#<?= (int) $row['id'] ?></td>
        <td><span class="badge" style="background:#EFF4FF; color:#1D4ED8; font-weight:600;"><?= e($row['category']) ?></span></td>
        <td><?= e($row['role']) ?></td>
        <td style="max-width:280px"><?= e($row['preview']) ?>&hellip;</td>
        <td class="muted"><?= $flags ? e(implode('; ', $flags)) : '—' ?></td>
        <td><span class="badge badge-<?= e($row['status']) ?>"><?= e($row['status']) ?></span></td>
        <td style="white-space:nowrap;"><?= e(date('M j, Y', strtotime($row['created_at']))) ?></td>
        <td style="text-align:right; white-space:nowrap;">
          <a href="submission-view.php?id=<?= (int) $row['id'] ?>" class="btn btn-outline btn-sm" style="margin-right:4px;">Review</a>
          
          <form method="post" style="display:inline-block;" onsubmit="return confirm('Are you sure you want to permanently delete Submission #<?= (int) $row['id'] ?>? This action cannot be undone.');">
            <?php csrf_field(); ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="submission_id" value="<?= (int) $row['id'] ?>">
            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
          </form>
        </td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($rows)): ?>
      <tr><td colspan="8" class="muted" style="text-align:center; padding:32px 0;">No submissions found matching your selected filters.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
