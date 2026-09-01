<?php
require_once __DIR__ . '/helpers.php';

require_method('GET');

$pdo = get_db();
$rows = $pdo->query(
    "SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'ad_contact_%'"
)->fetchAll(PDO::FETCH_KEY_PAIR);

$email = trim((string) ($rows['ad_contact_email'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['advertising' => null]);
}

json_response(['advertising' => [
    'name' => $rows['ad_contact_name'] ?? null,
    'email' => $email,
    'phone' => $rows['ad_contact_phone'] ?? null,
    'message' => $rows['ad_contact_message'] ?? null,
]]);
