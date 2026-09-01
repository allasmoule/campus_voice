<?php
require_once __DIR__ . '/helpers.php';

require_method('POST');

if (!check_rate_limit('survey', 5, 60)) {
    json_error('Too many survey submissions from this connection. Please try again later.', 429);
}

$body = get_json_body();

$institutionType = trim((string) ($body['institutionType'] ?? ''));
$role = trim((string) ($body['role'] ?? ''));
$academicArea = trim((string) ($body['academicArea'] ?? ''));

if (!in_array($institutionType, ALLOWED_INSTITUTION_TYPES, true)) {
    json_error('Please choose a valid institution type.');
}
if (!in_array($role, ALLOWED_ROLES, true)) {
    json_error('Please choose a valid role.');
}
if (!in_array($academicArea, ALLOWED_ACADEMIC_AREAS, true)) {
    json_error('Please choose a valid academic area.');
}

$responses = [];
foreach (LIKERT_FIELDS as $field) {
    if (isset($body[$field])) {
        $value = (int) $body[$field];
        if ($value >= 1 && $value <= 5) {
            $responses[$field] = $value;
        }
    }
}

if (count($responses) === 0) {
    json_error('Please answer at least one survey question.');
}

$pdo = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO survey_responses
        (institution_type, role, academic_area, responses, narrative_text, standout_moment, wish_different, improve_exp, institution_message)
     VALUES
        (:institution_type, :role, :academic_area, :responses, :narrative_text, :standout_moment, :wish_different, :improve_exp, :institution_message)'
);
$stmt->execute([
    'institution_type' => $institutionType,
    'role' => $role,
    'academic_area' => $academicArea,
    'responses' => json_encode($responses),
    'narrative_text' => clean_text($body['narrativeText'] ?? '', 3000) ?: null,
    'standout_moment' => clean_text($body['standoutMoment'] ?? '', 1000) ?: null,
    'wish_different' => clean_text($body['wishDifferent'] ?? '', 1000) ?: null,
    'improve_exp' => clean_text($body['improveExp'] ?? '', 1000) ?: null,
    'institution_message' => clean_text($body['institutionMessage'] ?? '', 1000) ?: null,
]);

json_response([
    'message' => 'Thank you — your responses have been recorded anonymously and will help drive institutional change.',
], 201);
