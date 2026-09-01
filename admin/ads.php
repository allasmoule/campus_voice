<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/../backend/media.php';
require_once __DIR__ . '/../backend/placeholders.php';
require_login();

$pdo = get_db();
$notice = '';
$error = '';

function placeholder_option_label(string $key): string {
    $p = AD_PLACEHOLDERS[$key] ?? null;
    return $p ? $p['group'] . ' — ' . $p['label'] . ' (' . ucfirst($p['format']) . ')' : $key;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'delete') {
        $id = (int) ($_POST['id'] ?? 0);
        $stmt = $pdo->prepare('SELECT media_path FROM ads WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $existing = $stmt->fetch();
        if ($existing) {
            delete_media_file($existing['media_path']);
            $pdo->prepare('DELETE FROM ads WHERE id = :id')->execute(['id' => $id]);
            $notice = 'Ad deleted.';
        }
    } elseif ($action === 'toggle') {
        $id = (int) ($_POST['id'] ?? 0);
        $pdo->prepare('UPDATE ads SET is_active = 1 - is_active WHERE id = :id')->execute(['id' => $id]);
        $notice = 'Ad status updated.';
    } elseif ($action === 'create' || $action === 'update') {
        $id = (int) ($_POST['id'] ?? 0);
        $placeholder = $_POST['placeholder'] ?? '';
        $adType = $_POST['ad_type'] ?? '';
        $title = clean_text($_POST['title'] ?? '', 150);
        $description = clean_text($_POST['description'] ?? '', 300);
        $brandName = clean_text($_POST['brand_name'] ?? '', 100);
        $ctaText = clean_text($_POST['cta_text'] ?? '', 60);
        $ctaUrl = clean_text($_POST['cta_url'] ?? '', 500);
        $accentColor = preg_match('/^#[0-9a-fA-F]{6}$/', $_POST['accent_color'] ?? '') ? $_POST['accent_color'] : '#2563EB';

        $existing = ['media_path' => null, 'media_url' => null];
        if ($action === 'update' && $id) {
            $stmt = $pdo->prepare('SELECT * FROM ads WHERE id = :id');
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if ($row) $existing = $row;
        }

        $format = placeholder_format($placeholder);

        if (!$format) {
            $error = 'Please choose a valid placeholder.';
        } elseif (!in_array($adType, ['image', 'video', 'code'], true)) {
            $error = 'Please choose a valid ad type.';
        } else {
            $mediaPath = $existing['media_path'];
            $mediaUrl = $existing['media_url'];
            $customCode = $existing['custom_code'] ?? null;

            if ($adType === 'image' || $adType === 'video') {
                $customCode = null;
                $upload = handle_media_upload($adType === 'image' ? 'image_upload' : 'video_upload', $adType);
                $urlInput = clean_text($_POST[$adType . '_url'] ?? '', 500);

                if (!empty($upload['error'])) {
                    $error = $upload['error'];
                } elseif ($upload['ok']) {
                    delete_media_file($existing['media_path'] ?? null);
                    $mediaPath = $upload['path'];
                    $mediaUrl = null;
                } elseif ($urlInput !== '') {
                    delete_media_file($existing['media_path'] ?? null);
                    $mediaPath = null;
                    $mediaUrl = $urlInput;
                } elseif (!$mediaPath && !$mediaUrl) {
                    $error = 'Please upload a file or provide a URL for this ad.';
                }
            } else {
                $mediaPath = null;
                $mediaUrl = null;
                $customCode = (string) ($_POST['custom_code'] ?? '');
                if (trim($customCode) === '') {
                    $error = 'Please paste the ad code.';
                }
            }

            if (!$error) {
                if ($action === 'create') {
                    $stmt = $pdo->prepare(
                        'INSERT INTO ads (placeholder, format, ad_type, title, description, brand_name, cta_text, cta_url, accent_color, media_path, media_url, custom_code)
                         VALUES (:placeholder, :format, :ad_type, :title, :description, :brand_name, :cta_text, :cta_url, :accent_color, :media_path, :media_url, :custom_code)'
                    );
                    $stmt->execute([
                        'placeholder' => $placeholder, 'format' => $format, 'ad_type' => $adType, 'title' => $title ?: null,
                        'description' => $description ?: null, 'brand_name' => $brandName ?: null,
                        'cta_text' => $ctaText ?: null, 'cta_url' => $ctaUrl ?: null, 'accent_color' => $accentColor,
                        'media_path' => $mediaPath, 'media_url' => $mediaUrl, 'custom_code' => $customCode,
                    ]);
                    $notice = 'Ad created.';
                } else {
                    $stmt = $pdo->prepare(
                        'UPDATE ads SET placeholder=:placeholder, format=:format, ad_type=:ad_type, title=:title, description=:description,
                         brand_name=:brand_name, cta_text=:cta_text, cta_url=:cta_url, accent_color=:accent_color,
                         media_path=:media_path, media_url=:media_url, custom_code=:custom_code WHERE id=:id'
                    );
                    $stmt->execute([
                        'placeholder' => $placeholder, 'format' => $format, 'ad_type' => $adType, 'title' => $title ?: null,
                        'description' => $description ?: null, 'brand_name' => $brandName ?: null,
                        'cta_text' => $ctaText ?: null, 'cta_url' => $ctaUrl ?: null, 'accent_color' => $accentColor,
                        'media_path' => $mediaPath, 'media_url' => $mediaUrl, 'custom_code' => $customCode, 'id' => $id,
                    ]);
                    $notice = 'Ad updated.';
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Data for the view
// ---------------------------------------------------------------------------
$activeFilter = $_GET['placeholder'] ?? 'all';
if ($activeFilter !== 'all' && !isset(AD_PLACEHOLDERS[$activeFilter])) {
    $activeFilter = 'all';
}

$editAd = null;
if (!empty($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM ads WHERE id = :id');
    $stmt->execute(['id' => (int) $_GET['edit']]);
    $editAd = $stmt->fetch() ?: null;
}

if ($activeFilter === 'all') {
    $ads = $pdo->query('SELECT * FROM ads ORDER BY created_at DESC')->fetchAll();
} else {
    $stmt = $pdo->prepare('SELECT * FROM ads WHERE placeholder = :p ORDER BY created_at DESC');
    $stmt->execute(['p' => $activeFilter]);
    $ads = $stmt->fetchAll();
}

// Group placeholders by page for the <optgroup> dropdowns
$groups = [];
foreach (AD_PLACEHOLDERS as $key => $p) {
    $groups[$p['group']][$key] = $p;
}

$pageTitle = 'Ads';
require __DIR__ . '/includes/header.php';
?>

<?php if ($notice): ?><div class="alert alert-success"><?= e($notice) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>

<div class="admin-card">
  <div class="flex-between" style="margin-bottom:16px;">
    <strong><?= $editAd ? 'Edit Ad #' . (int) $editAd['id'] : 'Add New Ad' ?></strong>
    <?php if ($editAd): ?><a href="ads.php?placeholder=<?= e($activeFilter) ?>" class="btn btn-outline btn-sm">Cancel edit</a><?php endif; ?>
  </div>

  <form method="post" enctype="multipart/form-data" id="ad-form">
    <?php csrf_field(); ?>
    <input type="hidden" name="action" value="<?= $editAd ? 'update' : 'create' ?>">
    <?php if ($editAd): ?><input type="hidden" name="id" value="<?= (int) $editAd['id'] ?>"><?php endif; ?>

    <div class="form-row">
      <div class="form-group">
        <label>Placeholder — where on the site should this ad appear?</label>
        <select name="placeholder" required>
          <option value="">Choose a placeholder…</option>
          <?php foreach ($groups as $groupName => $items): ?>
            <optgroup label="<?= e($groupName) ?>">
              <?php foreach ($items as $key => $p): ?>
                <option value="<?= e($key) ?>" <?= ($editAd['placeholder'] ?? ($activeFilter !== 'all' ? $activeFilter : '')) === $key ? 'selected' : '' ?>>
                  <?= e($p['label']) ?> (<?= e(ucfirst($p['format'])) ?>)
                </option>
              <?php endforeach; ?>
            </optgroup>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="form-group">
        <label>Accent color</label>
        <input type="color" name="accent_color" value="<?= e($editAd['accent_color'] ?? '#2563EB') ?>" style="height:42px;padding:4px;">
      </div>
    </div>

    <div class="form-group">
      <label>Ad Type</label>
      <div class="type-tabs">
        <?php foreach (['image' => 'Image', 'video' => 'Video', 'code' => 'Custom Code'] as $val => $label): ?>
          <label class="type-tab">
            <input type="radio" name="ad_type" value="<?= $val ?>" <?= ($editAd['ad_type'] ?? 'image') === $val ? 'checked' : '' ?> onclick="showAdTypeFields('<?= $val ?>')">
            <span><?= $label ?></span>
          </label>
        <?php endforeach; ?>
      </div>
    </div>

    <div id="fields-image" class="ad-type-fields">
      <?php if (!empty($editAd['media_path']) && $editAd['ad_type'] === 'image'): ?>
        <p class="muted">Current image: <img src="/<?= e(ltrim($editAd['media_path'], '/')) ?>" style="height:60px;border-radius:6px;vertical-align:middle;margin-left:8px;"></p>
      <?php endif; ?>
      <div class="form-group"><label>Upload image (jpg/png/gif/webp, max 5MB)</label><input type="file" name="image_upload" accept="image/*"></div>
      <div class="form-group"><label>...or image URL</label><input type="text" name="image_url" placeholder="https://" value="<?= ($editAd['ad_type'] ?? '') === 'image' ? e($editAd['media_url'] ?? '') : '' ?>"></div>
    </div>

    <div id="fields-video" class="ad-type-fields">
      <?php if (!empty($editAd['media_path']) && $editAd['ad_type'] === 'video'): ?>
        <p class="muted">Current video is uploaded. Choose a new file below to replace it.</p>
      <?php endif; ?>
      <div class="form-group"><label>Upload video (mp4/webm/ogg, max 30MB)</label><input type="file" name="video_upload" accept="video/*"></div>
      <div class="form-group"><label>...or video URL</label><input type="text" name="video_url" placeholder="https://" value="<?= ($editAd['ad_type'] ?? '') === 'video' ? e($editAd['media_url'] ?? '') : '' ?>"></div>
    </div>

    <div id="fields-code" class="ad-type-fields">
      <div class="form-group">
        <label>Custom ad code (raw HTML/JS — e.g. an AdSense or ad-network embed snippet)</label>
        <textarea name="custom_code" rows="6" style="font-family:monospace;font-size:12px;"><?= ($editAd['ad_type'] ?? '') === 'code' ? e($editAd['custom_code'] ?? '') : '' ?></textarea>
        <p class="muted" style="margin-top:6px;">This runs on your live site for every visitor exactly as pasted — only use code from ad networks you trust.</p>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group"><label>Title</label><input type="text" name="title" value="<?= e($editAd['title'] ?? '') ?>"></div>
      <div class="form-group"><label>Brand name</label><input type="text" name="brand_name" value="<?= e($editAd['brand_name'] ?? '') ?>"></div>
    </div>
    <div class="form-group"><label>Description</label><input type="text" name="description" value="<?= e($editAd['description'] ?? '') ?>"></div>
    <div class="form-row">
      <div class="form-group"><label>CTA button text</label><input type="text" name="cta_text" value="<?= e($editAd['cta_text'] ?? 'Learn More →') ?>"></div>
      <div class="form-group"><label>CTA link (where clicking goes)</label><input type="text" name="cta_url" value="<?= e($editAd['cta_url'] ?? '') ?>" placeholder="https://"></div>
    </div>

    <button type="submit" class="btn btn-primary"><?= $editAd ? 'Save Changes' : 'Create Ad' ?></button>
  </form>
</div>

<div class="admin-card">
  <form method="get" class="form-group mb-0" style="max-width:360px;">
    <label>Filter by placeholder</label>
    <select name="placeholder" onchange="this.form.submit()">
      <option value="all" <?= $activeFilter === 'all' ? 'selected' : '' ?>>All Placeholders</option>
      <?php foreach ($groups as $groupName => $items): ?>
        <optgroup label="<?= e($groupName) ?>">
          <?php foreach ($items as $key => $p): ?>
            <option value="<?= e($key) ?>" <?= $activeFilter === $key ? 'selected' : '' ?>><?= e($p['label']) ?> (<?= e(ucfirst($p['format'])) ?>)</option>
          <?php endforeach; ?>
        </optgroup>
      <?php endforeach; ?>
    </select>
  </form>
</div>

<div class="admin-card">
  <table>
    <thead><tr><th>Preview</th><th>Placeholder</th><th>Type</th><th>Title</th><th>Status</th><th>Created</th><th></th></tr></thead>
    <tbody>
      <?php foreach ($ads as $ad): ?>
      <tr>
        <td>
          <?php if ($ad['ad_type'] === 'image' && ($ad['media_path'] || $ad['media_url'])): ?>
            <img src="<?= e($ad['media_path'] ? '/' . ltrim($ad['media_path'], '/') : $ad['media_url']) ?>" style="height:40px;border-radius:4px;">
          <?php elseif ($ad['ad_type'] === 'video'): ?>
            <span class="muted">Video</span>
          <?php else: ?>
            <span class="muted">Code</span>
          <?php endif; ?>
        </td>
        <td><?= e(placeholder_option_label($ad['placeholder'])) ?></td>
        <td><?= e($ad['ad_type']) ?></td>
        <td><?= e($ad['title'] ?: '—') ?></td>
        <td>
          <form method="post" style="display:inline;">
            <?php csrf_field(); ?>
            <input type="hidden" name="action" value="toggle">
            <input type="hidden" name="id" value="<?= (int) $ad['id'] ?>">
            <button type="submit" class="badge badge-<?= $ad['is_active'] ? 'approved' : 'rejected' ?>" style="border:none;cursor:pointer;">
              <?= $ad['is_active'] ? 'Active' : 'Paused' ?>
            </button>
          </form>
        </td>
        <td><?= e($ad['created_at']) ?></td>
        <td>
          <a href="?placeholder=<?= e($activeFilter) ?>&edit=<?= (int) $ad['id'] ?>" class="btn btn-outline btn-sm">Edit</a>
          <form method="post" style="display:inline;" onsubmit="return confirm('Delete this ad?');">
            <?php csrf_field(); ?>
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int) $ad['id'] ?>">
            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
          </form>
        </td>
      </tr>
      <?php endforeach; ?>
      <?php if (empty($ads)): ?>
      <tr><td colspan="7" class="muted">No ads yet.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<script>
function showAdTypeFields(type) {
  ['image', 'video', 'code'].forEach(function (t) {
    document.getElementById('fields-' + t).style.display = (t === type) ? 'block' : 'none';
  });
}
showAdTypeFields(document.querySelector('input[name="ad_type"]:checked').value);
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
