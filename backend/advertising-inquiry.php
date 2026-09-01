<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/media.php';

require_method('POST');

if (!check_rate_limit('advertising_inquiry', 5, 60)) {
    json_error('Too many requests from this connection. Please try again later.', 429);
}

const ALLOWED_PAYMENT_METHODS = ['BTC', 'ETH', 'USDT', 'Other crypto'];

$name = clean_text($_POST['name'] ?? '', 150);
$email = trim((string) ($_POST['email'] ?? ''));
$paymentMethod = trim((string) ($_POST['paymentMethod'] ?? ''));
$durationDays = (int) ($_POST['durationDays'] ?? 0);
$message = clean_text($_POST['message'] ?? '', 2000);
$adType = trim((string) ($_POST['adType'] ?? ''));

if (mb_strlen($name) < 2) {
    json_error('Please enter your name.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('Please enter a valid email address.');
}
if (!in_array($paymentMethod, ALLOWED_PAYMENT_METHODS, true)) {
    json_error('Please choose a valid payment method.');
}
if ($durationDays < 1 || $durationDays > 3650) {
    json_error('Please enter a valid number of days.');
}
if ($adType !== '' && !in_array($adType, ['image', 'video', 'code'], true)) {
    json_error('Please choose a valid ad type.');
}

$mediaPath = null;
$mediaUrl = null;
$customCode = null;

if ($adType === 'image' || $adType === 'video') {
    $upload = handle_media_upload($adType === 'image' ? 'image_upload' : 'video_upload', $adType, 'inquiries');
    $urlInput = trim((string) ($_POST[$adType . '_url'] ?? ''));

    if (!empty($upload['error'])) {
        json_error($upload['error']);
    } elseif ($upload['ok']) {
        $mediaPath = $upload['path'];
    } elseif ($urlInput !== '' && filter_var($urlInput, FILTER_VALIDATE_URL)) {
        $mediaUrl = $urlInput;
    }
} elseif ($adType === 'code') {
    $customCode = mb_substr(trim((string) ($_POST['customCode'] ?? '')), 0, 5000);
    if ($customCode === '') {
        $adType = null; // nothing actually provided
    }
}

$pdo = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO advertising_inquiries (name, email, payment_method, duration_days, message, ad_type, media_path, media_url, custom_code)
     VALUES (:name, :email, :payment_method, :duration_days, :message, :ad_type, :media_path, :media_url, :custom_code)'
);
$stmt->execute([
    'name' => $name,
    'email' => $email,
    'payment_method' => $paymentMethod,
    'duration_days' => $durationDays,
    'message' => $message ?: null,
    'ad_type' => $adType ?: null,
    'media_path' => $mediaPath,
    'media_url' => $mediaUrl,
    'custom_code' => $customCode,
]);

json_response([
    'message' => 'Thanks — your advertising inquiry has been sent. We\'ll get back to you by email soon.',
], 201);
