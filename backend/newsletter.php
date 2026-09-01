<?php
require_once __DIR__ . '/helpers.php';

require_method('POST');

if (!check_rate_limit('newsletter', 10, 60)) {
    json_error('Too many attempts from this connection. Please try again later.', 429);
}

$body = get_json_body();
$email = trim((string) ($body['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('Please enter a valid email address.');
}

$pdo = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO newsletter_subscribers (email, status, subscribed_at)
     VALUES (:email, "subscribed", NOW())
     ON DUPLICATE KEY UPDATE status = "subscribed", subscribed_at = NOW(), unsubscribed_at = NULL'
);
$stmt->execute(['email' => $email]);

json_response(['message' => 'You\'re subscribed! Welcome to The Campus Voice.'], 201);
