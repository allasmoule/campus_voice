<?php
require_once __DIR__ . '/helpers.php';

require_method('GET');

$slot = trim((string) ($_GET['slot'] ?? ''));
if ($slot === '') {
    json_error('Missing slot.', 400);
}

$pdo = get_db();
$stmt = $pdo->prepare(
    "SELECT * FROM ads WHERE placeholder = :slot AND is_active = 1 ORDER BY RAND() LIMIT 1"
);
$stmt->execute(['slot' => $slot]);
$ad = $stmt->fetch();

if (!$ad) {
    json_response(['ad' => null]);
}

$mediaUrl = null;
if (!empty($ad['media_path'])) {
    $mediaUrl = '/' . ltrim($ad['media_path'], '/');
} elseif (!empty($ad['media_url'])) {
    $mediaUrl = $ad['media_url'];
}

json_response(['ad' => [
    'id' => (int) $ad['id'],
    'adType' => $ad['ad_type'],
    'title' => $ad['title'],
    'description' => $ad['description'],
    'brandName' => $ad['brand_name'],
    'ctaText' => $ad['cta_text'],
    'ctaUrl' => $ad['cta_url'],
    'accentColor' => $ad['accent_color'],
    'mediaUrl' => $mediaUrl,
    'customCode' => $ad['ad_type'] === 'code' ? $ad['custom_code'] : null,
]]);
