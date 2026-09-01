<?php
require_once __DIR__ . '/db.php';

function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data);
    exit;
}

function json_error(string $message, int $status = 400): void {
    json_response(['error' => $message], $status);
}

function require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_error('Method not allowed.', 405);
    }
}

function get_json_body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Invalid request body.', 400);
    }
    return $data;
}

function clean_text(?string $value, int $maxLength = 5000): string {
    $value = trim((string) $value);
    $value = strip_tags($value);
    if (function_exists('mb_substr')) {
        $value = mb_substr($value, 0, $maxLength);
    } else {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function hash_ip(string $ip): string {
    return hash('sha256', $ip . IP_HASH_SALT);
}

/**
 * Simple sliding-window rate limit backed by rate_limit_log.
 * Returns true (and logs the attempt) if the caller is within the limit.
 */
function check_rate_limit(string $action, int $maxAttempts, int $windowMinutes): bool {
    $pdo = get_db();
    $ipHash = hash_ip(client_ip());

    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM rate_limit_log
         WHERE ip_hash = :ip_hash AND action = :action
           AND created_at >= (NOW() - INTERVAL :minutes MINUTE)'
    );
    $stmt->execute(['ip_hash' => $ipHash, 'action' => $action, 'minutes' => $windowMinutes]);
    $count = (int) $stmt->fetchColumn();

    if ($count >= $maxAttempts) {
        return false;
    }

    $insert = $pdo->prepare('INSERT INTO rate_limit_log (ip_hash, action) VALUES (:ip_hash, :action)');
    $insert->execute(['ip_hash' => $ipHash, 'action' => $action]);

    // No cron/queue system exists in this app to prune old rows, so do it
    // opportunistically here instead of letting the table grow forever —
    // cheap enough at low odds that it doesn't add meaningful load per request.
    if (random_int(1, 200) === 1) {
        $pdo->exec('DELETE FROM rate_limit_log WHERE created_at < (NOW() - INTERVAL 7 DAY)');
    }

    return true;
}

const ALLOWED_CATEGORIES = ['news', 'opinion', 'campus-life', 'careers', 'wellness', 'voices'];

const CATEGORY_COLORS = [
    'news' => '#DC2626',
    'opinion' => '#7C3AED',
    'campus-life' => '#2563EB',
    'careers' => '#D97706',
    'wellness' => '#059669',
    'voices' => '#6366F1',
];

// Mirrors the LikertScale field names used across every step of src/app/survey/page.tsx
const LIKERT_FIELDS = [
    'feltRespected', 'presenceLegitimate', 'contributionsTaken', 'safeDisagreement', 'comfortableHelp', 'beMyself',
    'fairEvaluation', 'clearExpectations', 'assessedOnWork', 'overlyScrutinized', 'proveMyself', 'excessiveMonitoring',
    'belonging', 'representation', 'diversePerspectives',
    'pressureComfort', 'boundariesRespected', 'dismissiveResponse', 'emotionallyDrained',
    'confidenceImpact', 'careerInfluence', 'wouldRecommend',
];

const ALLOWED_ROLES = ['Undergraduate student', 'Graduate student', 'Staff', 'Faculty', 'Other'];
const ALLOWED_INSTITUTION_TYPES = ['Public university', 'Private university', 'Community college', 'Other'];
const ALLOWED_ACADEMIC_AREAS = ['STEM', 'Social Sciences', 'Humanities', 'Professional Programs', 'Other'];

/**
 * Lightweight heuristic checks — mirrors what the submit form's UI already expects
 * (an array of human-readable flag strings). Not a moderation replacement, just a
 * first pass so obviously-identifying or spammy text gets queued for manual review.
 */
function detect_flags(string $text): array {
    $flags = [];

    if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text)) {
        $flags[] = 'Possible email address detected';
    }
    if (preg_match('/\b(\+?\d[\d\-\s().]{7,}\d)\b/', $text)) {
        $flags[] = 'Possible phone number detected';
    }
    if (preg_match('/\b(Dr|Mr|Mrs|Ms|Prof|Professor)\.?\s+[A-Z][a-z]+/', $text)) {
        $flags[] = 'Possible named individual detected';
    }

    return $flags;
}

function slugify(string $text): string {
    $slug = strtolower(trim($text));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug !== '' ? $slug : 'story';
}
