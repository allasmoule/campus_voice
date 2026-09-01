<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/../backend/sanitize.php';
require_login();

$pdo = get_db();
$id = (int) ($_GET['id'] ?? 0);

$stmt = $pdo->prepare('SELECT * FROM submissions WHERE id = :id');
$stmt->execute(['id' => $id]);
$submission = $stmt->fetch();

if (!$submission) {
    http_response_code(404);
    exit('Submission not found.');
}

$notice = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'reject') {
        $note = clean_text($_POST['admin_note'] ?? '', 500);
        $upd = $pdo->prepare('UPDATE submissions SET status = "rejected", admin_note = :note, reviewed_at = NOW() WHERE id = :id');
        $upd->execute(['note' => $note ?: null, 'id' => $id]);
        $notice = 'Submission rejected.';
        $submission['status'] = 'rejected';
    } elseif ($action === 'reset') {
        $upd = $pdo->prepare('UPDATE submissions SET status = "pending", admin_note = NULL, reviewed_at = NULL WHERE id = :id');
        $upd->execute(['id' => $id]);
        $notice = 'Submission returned to pending.';
        $submission['status'] = 'pending';
    } elseif ($action === 'approve') {
        $title = clean_text($_POST['title'] ?? '', 200);
        $excerpt = clean_text($_POST['excerpt'] ?? '', 300);
        $content = sanitize_rich_html((string) ($_POST['content'] ?? ''));
        $readTime = max(1, (int) ($_POST['read_time'] ?? 3));

        if (mb_strlen($title) < 5) {
            $error = 'Please enter a title of at least 5 characters before publishing.';
        } elseif (mb_strlen(trim(strip_tags($content))) < 20) {
            $error = 'Story content is too short to publish.';
        } else {
            $baseSlug = slugify($title);
            $slug = $baseSlug;
            $suffix = 2;
            $check = $pdo->prepare('SELECT COUNT(*) FROM published_stories WHERE slug = :slug');
            while (true) {
                $check->execute(['slug' => $slug]);
                if ((int) $check->fetchColumn() === 0) break;
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }

            $color = CATEGORY_COLORS[$submission['category']] ?? '#1D4ED8';
            $plainExcerptSource = trim(strip_tags($content));

            $ins = $pdo->prepare(
                'INSERT INTO published_stories (submission_id, slug, title, excerpt, content, cover_image_path, category, category_color, read_time)
                 VALUES (:submission_id, :slug, :title, :excerpt, :content, :cover_image_path, :category, :category_color, :read_time)'
            );
            $ins->execute([
                'submission_id' => $id,
                'slug' => $slug,
                'title' => $title,
                'excerpt' => $excerpt ?: mb_substr($plainExcerptSource, 0, 150),
                'content' => $content,
                'cover_image_path' => $submission['cover_image_path'],
                'category' => $submission['category'],
                'category_color' => $color,
                'read_time' => $readTime,
            ]);

            $upd = $pdo->prepare('UPDATE submissions SET status = "approved", reviewed_at = NOW() WHERE id = :id');
            $upd->execute(['id' => $id]);

            $notice = 'Published as "' . $title . '" (slug: ' . $slug . ').';
            $submission['status'] = 'approved';
        }
    }
}

$flags = $submission['flags'] ? json_decode($submission['flags'], true) : [];
$plainNarrative = trim(preg_replace('/\s+/', ' ', strip_tags($submission['narrative_text'])));
$suggestedTitle = mb_strimwidth($plainNarrative, 0, 60, '');

$pageTitle = 'Review Submission #' . $id;
require __DIR__ . '/includes/header.php';
?>

<a href="submissions.php" class="muted" style="text-decoration:none;">&larr; Back to submissions</a>

<?php if ($notice): ?><div class="alert alert-success" style="margin-top:16px;"><?= e($notice) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-error" style="margin-top:16px;"><?= e($error) ?></div><?php endif; ?>

<div class="admin-card" style="margin-top:16px;">
  <div class="flex-between">
    <div>
      <span class="badge badge-<?= e($submission['status']) ?>"><?= e($submission['status']) ?></span>
      <span class="muted"> · <?= e($submission['category']) ?> · <?= e($submission['role']) ?> · <?= e($submission['institution_type']) ?> · <?= e($submission['academic_area']) ?></span>
    </div>
    <span class="muted"><?= e($submission['created_at']) ?></span>
  </div>

  <?php if ($flags): ?>
    <div class="alert alert-warn" style="margin-top:14px;">
      <strong>Flagged for:</strong> <?= e(implode('; ', $flags)) ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($submission['cover_image_path'])): ?>
    <img src="/<?= e(ltrim($submission['cover_image_path'], '/')) ?>" style="max-width:100%;max-height:260px;border-radius:8px;margin-top:16px;" alt="Cover">
  <?php endif; ?>

  <div class="text-block rich-preview" style="margin-top:16px;"><?= $submission['narrative_text'] ?></div>
</div>

<?php if (in_array($submission['status'], ['pending', 'flagged'], true)): ?>
<div class="admin-card">
  <strong>Publish this story</strong>
  <form method="post" style="margin-top:12px;">
    <?php csrf_field(); ?>
    <input type="hidden" name="action" value="approve">
    <div class="form-group">
      <label>Title</label>
      <input type="text" name="title" required minlength="5" value="<?= e($suggestedTitle) ?>">
    </div>
    <div class="form-group">
      <label>Excerpt (shown on cards, optional — auto-filled from content if left blank)</label>
      <input type="text" name="excerpt">
    </div>
    <div class="form-group">
      <label>Content (edit to remove any identifying details before publishing)</label>
      <textarea name="content" rows="8" required><?= e($submission['narrative_text']) ?></textarea>
    </div>
    <div class="form-group" style="max-width:140px;">
      <label>Read time (min)</label>
      <input type="text" name="read_time" value="3">
    </div>
    <button type="submit" class="btn btn-primary">Approve &amp; Publish</button>
  </form>
</div>

<div class="admin-card">
  <strong>Reject this submission</strong>
  <form method="post" style="margin-top:12px;">
    <?php csrf_field(); ?>
    <input type="hidden" name="action" value="reject">
    <div class="form-group">
      <label>Internal note (optional, not shown publicly)</label>
      <textarea name="admin_note" rows="2"></textarea>
    </div>
    <button type="submit" class="btn btn-danger">Reject</button>
  </form>
</div>
<?php else: ?>
<div class="admin-card">
  <p class="muted mb-0">This submission has already been <?= e($submission['status']) ?><?= $submission['admin_note'] ? ' — ' . e($submission['admin_note']) : '' ?>.</p>
  <form method="post" style="margin-top:12px;">
    <?php csrf_field(); ?>
    <input type="hidden" name="action" value="reset">
    <button type="submit" class="btn btn-outline btn-sm">Return to pending</button>
  </form>
</div>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
