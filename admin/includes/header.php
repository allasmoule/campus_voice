<?php
if (!defined('ADMIN_BOOTSTRAPPED')) {
    http_response_code(403);
    exit('Forbidden');
}
$pageTitle = $pageTitle ?? 'Dashboard';
$currentScript = basename($_SERVER['SCRIPT_NAME']);

$navItems = [
    ['href' => 'index.php', 'label' => 'Dashboard', 'match' => ['index.php']],
    ['href' => 'submissions.php', 'label' => 'Submissions', 'match' => ['submissions.php', 'submission-view.php']],
    ['href' => 'submissions-list.php', 'label' => 'Submissions List', 'match' => ['submissions-list.php']],
    ['href' => 'survey-results.php', 'label' => 'Survey Results', 'match' => ['survey-results.php']],
    ['href' => 'newsletter.php', 'label' => 'Newsletter', 'match' => ['newsletter.php']],
    ['href' => 'ads.php', 'label' => 'Ads', 'match' => ['ads.php']],
    ['href' => 'advertising.php', 'label' => 'Advertising Contact', 'match' => ['advertising.php']],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($pageTitle) ?> · TheCampusVoice Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="admin-shell">
  <aside class="admin-sidebar">
    <div class="admin-sidebar-brand">
      <span class="brand-mark">CV</span>
      <span class="brand-text">TheCampusVoice</span>
    </div>
    <nav class="admin-sidebar-nav">
      <?php foreach ($navItems as $item): $isActive = in_array($currentScript, $item['match'], true); ?>
        <a href="<?= e($item['href']) ?>" class="<?= $isActive ? 'active' : '' ?>"><?= e($item['label']) ?></a>
      <?php endforeach; ?>
    </nav>
    <div class="admin-sidebar-footer">
      <div class="admin-user-chip">
        <span class="avatar"><?= e(strtoupper(substr(current_admin_username(), 0, 1))) ?></span>
        <span><?= e(current_admin_username()) ?></span>
      </div>
      <a href="logout.php" class="admin-logout-link">Log out</a>
    </div>
  </aside>
  <div class="admin-body">
    <main class="admin-main">
      <h1 class="admin-page-title"><?= e($pageTitle) ?></h1>
