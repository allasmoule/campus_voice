<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/sanitize.php';

require_method('POST');

if (!check_rate_limit('submission', 5, 60)) {
    json_error('Too many submissions from this connection. Please try again later.', 429);
}

$body = get_json_body();

$category = trim((string) ($body['category'] ?? ''));
$role = trim((string) ($body['role'] ?? ''));
$institutionType = trim((string) ($body['institutionType'] ?? ''));
$academicArea = trim((string) ($body['academicArea'] ?? ''));
$narrativeHtml = sanitize_rich_html((string) ($body['narrativeText'] ?? ''));
$plainText = trim(strip_tags($narrativeHtml));

$coverImagePath = null;
$coverImageInput = trim((string) ($body['coverImagePath'] ?? ''));
if ($coverImageInput !== '' && preg_match('#^/uploads/submissions/[a-f0-9]{32}\.(jpg|jpeg|png|gif|webp)$#i', $coverImageInput)) {
    $coverImagePath = ltrim($coverImageInput, '/');
}

if (!in_array($category, ALLOWED_CATEGORIES, true)) {
    json_error('Please choose a valid category.');
}
if (!in_array($role, ALLOWED_ROLES, true)) {
    json_error('Please choose a valid role.');
}
if (!in_array($institutionType, ALLOWED_INSTITUTION_TYPES, true)) {
    json_error('Please choose a valid institution type.');
}
if (!in_array($academicArea, ALLOWED_ACADEMIC_AREAS, true)) {
    json_error('Please choose a valid academic area.');
}
if (mb_strlen($plainText) < 20) {
    json_error('Please share at least 20 characters describing your experience.');
}
if (mb_strlen($narrativeHtml) > 20000) {
    json_error('Your story is too long. Please shorten it.');
}

$flags = detect_flags($plainText);
$status = empty($flags) ? 'pending' : 'flagged';

$pdo = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO submissions (category, role, institution_type, academic_area, narrative_text, cover_image_path, flags, status)
     VALUES (:category, :role, :institution_type, :academic_area, :narrative_text, :cover_image_path, :flags, :status)'
);
$stmt->execute([
    'category' => $category,
    'role' => $role,
    'institution_type' => $institutionType,
    'academic_area' => $academicArea,
    'narrative_text' => $narrativeHtml,
    'cover_image_path' => $coverImagePath,
    'flags' => empty($flags) ? null : json_encode($flags),
    'status' => $status,
]);

if (!empty($flags)) {
    json_response([
        'flags' => $flags,
        'suggestion' => 'Your submission was flagged for manual review because it may contain identifying details. A moderator will review it before it can be published — feel free to edit and resubmit if you\'d like to remove the flagged content.',
    ], 201);
}

json_response([
    'message' => 'Thank you — your story has been submitted anonymously and is pending moderator review before publication.',
], 201);
