<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';
require_login();

$pdo = get_db();
$notice = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? 'save_contact';

    if ($action === 'update_inquiry_status') {
        $id = (int) ($_POST['id'] ?? 0);
        $newStatus = $_POST['status'] ?? '';
        if (in_array($newStatus, ['new', 'contacted', 'closed'], true)) {
            $pdo->prepare('UPDATE advertising_inquiries SET status = :s WHERE id = :id')
                ->execute(['s' => $newStatus, 'id' => $id]);
            $notice = 'success:Inquiry updated.';
        }
    } else {
        $name = clean_text($_POST['name'] ?? '', 150);
        $email = trim((string) ($_POST['email'] ?? ''));
        $phone = clean_text($_POST['phone'] ?? '', 40);
        $message = clean_text($_POST['message'] ?? '', 400);

        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $notice = 'error:Please enter a valid email address.';
        } else {
            $values = [
                'ad_contact_name' => $name,
                'ad_contact_email' => $email,
                'ad_contact_phone' => $phone,
                'ad_contact_message' => $message,
            ];
            $stmt = $pdo->prepare(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (:k, :v)
                 ON DUPLICATE KEY UPDATE setting_value = :v2'
            );
            foreach ($values as $key => $value) {
                $stmt->execute(['k' => $key, 'v' => $value, 'v2' => $value]);
            }
            $notice = 'success:Saved. ' . ($email !== '' ? 'The footer link is now live.' : 'The footer link is hidden until an email is set.');
        }
    }
}

$rows = $pdo->query(
    "SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'ad_contact_%'"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$inquiries = $pdo->query('SELECT * FROM advertising_inquiries ORDER BY created_at DESC LIMIT 200')->fetchAll();

$pageTitle = 'Advertising Contact';
require __DIR__ . '/includes/header.php';
?>

<?php if ($notice): [$kind, $text] = explode(':', $notice, 2); ?>
  <div class="alert alert-<?= $kind === 'error' ? 'error' : 'success' ?>"><?= e($text) ?></div>
<?php endif; ?>

<div class="admin-card">
  <strong>Advertise-with-us contact</strong>
  <p class="muted" style="margin-top:6px;">
    Shown as a "Contact for Advertising" link in the site footer. The link only appears once an email is set here.
  </p>

  <form method="post" style="margin-top:16px;">
    <?php csrf_field(); ?>
    <div class="form-row">
      <div class="form-group">
        <label>Contact name</label>
        <input type="text" name="name" value="<?= e($rows['ad_contact_name'] ?? '') ?>" placeholder="e.g. Partnerships Team">
      </div>
      <div class="form-group">
        <label>Phone (optional)</label>
        <input type="text" name="phone" value="<?= e($rows['ad_contact_phone'] ?? '') ?>" placeholder="+1 555 123 4567">
      </div>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" name="email" value="<?= e($rows['ad_contact_email'] ?? '') ?>" placeholder="ads@thecampusvoice.com">
    </div>
    <div class="form-group">
      <label>Short message (optional, shown next to the link)</label>
      <input type="text" name="message" value="<?= e($rows['ad_contact_message'] ?? '') ?>" placeholder="Interested in reaching our readers?">
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
  </form>
</div>

<div class="admin-card">
  <strong>Advertising Inquiries</strong>
  <p class="muted" style="margin-top:6px;">Submitted through the "Contact for Advertising" form in the footer. Payment method is what the advertiser says they'd prefer — nothing is charged automatically; follow up by email to arrange it.</p>

  <table style="margin-top:16px;">
    <thead><tr><th>Name</th><th>Email</th><th>Payment</th><th>Days</th><th>Message</th><th>Ad</th><th>Status</th><th>Received</th></tr></thead>
    <tbody>
      <?php foreach ($inquiries as $inq): ?>
      <tr>
        <td><?= e($inq['name']) ?></td>
        <td><a href="mailto:<?= e($inq['email']) ?>"><?= e($inq['email']) ?></a></td>
        <td><?= e($inq['payment_method']) ?></td>
        <td><?= (int) $inq['duration_days'] ?></td>
        <td style="max-width:220px;"><?= e($inq['message'] ?: '—') ?></td>
        <td>
          <?php if ($inq['ad_type'] === 'image' && ($inq['media_path'] || $inq['media_url'])): ?>
            <img src="<?= e($inq['media_path'] ? '/' . ltrim($inq['media_path'], '/') : $inq['media_url']) ?>" style="height:36px;border-radius:4px;">
          <?php elseif ($inq['ad_type'] === 'video' && ($inq['media_path'] || $inq['media_url'])): ?>
            <a href="<?= e($inq['media_path'] ? '/' . ltrim($inq['media_path'], '/') : $inq['media_url']) ?>" target="_blank" class="muted">Video ↗</a>
          <?php elseif ($inq['ad_type'] === 'code' && $inq['custom_code']): ?>
            <details>
              <summary class="muted" style="cursor:pointer;">Code</summary>
              <pre style="max-width:280px;white-space:pre-wrap;font-size:11px;background:var(--gray-100);padding:8px;border-radius:6px;margin-top:6px;"><?= e($inq['custom_code']) ?></pre>
            </details>
          <?php else: ?>
            <span class="muted">—</span>
          <?php endif; ?>
        </td>
        <td>
          <form method="post" style="display:inline;">
            <?php csrf_field(); ?>
            <input type="hidden" name="action" value="update_inquiry_status">
            <input type="hidden" name="id" value="<?= (int) $inq['id'] ?>">
            <select name="status" onchange="this.form.submit()" class="badge badge-<?= $inq['status'] === 'new' ? 'flagged' : ($inq['status'] === 'contacted' ? 'pending' : 'approved') ?>" style="border:none;">
              <option value="new" <?= $inq['status'] === 'new' ? 'selected' : '' ?>>New</option>
              <option value="contacted" <?= $inq['status'] === 'contacted' ? 'selected' : '' ?>>Contacted</option>
              <option value="closed" <?= $inq['status'] === 'closed' ? 'selected' : '' ?>>Closed</option>
            </select>
          </form>
        </td>
        <td><?= e($inq['created_at']) ?></td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($inquiries)): ?>
      <tr><td colspan="8" class="muted">No inquiries yet.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
