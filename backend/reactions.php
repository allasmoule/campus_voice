<?php
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = get_db();

if ($method === 'GET') {
    $slug = trim((string) ($_GET['slug'] ?? ''));
    if ($slug === '') {
        json_error('Slug parameter is required.', 400);
    }

    $stmt = $pdo->prepare('SELECT likes, dislikes FROM published_stories WHERE slug = :slug LIMIT 1');
    $stmt->execute(['slug' => $slug]);
    $story = $stmt->fetch();

    if (!$story) {
        json_response(['likes' => 0, 'dislikes' => 0]);
    }

    json_response([
        'likes' => (int) ($story['likes'] ?? 0),
        'dislikes' => (int) ($story['dislikes'] ?? 0),
    ]);
} elseif ($method === 'POST') {
    if (!check_rate_limit('story_reaction', 40, 60)) {
        json_error('Too many requests. Please slow down.', 429);
    }

    $body = get_json_body();
    $slug = trim((string) ($body['slug'] ?? ''));
    $type = trim((string) ($body['type'] ?? ''));
    $delta = isset($body['delta']) ? (int) $body['delta'] : 1;

    if ($slug === '' || !in_array($type, ['like', 'dislike'], true)) {
        json_error('Valid slug and type (like or dislike) are required.', 400);
    }

    if ($delta !== 1 && $delta !== -1) {
        $delta = 1;
    }

    $col = $type === 'like' ? 'likes' : 'dislikes';
    $stmt = $pdo->prepare("UPDATE published_stories SET {$col} = GREATEST(0, {$col} + :delta) WHERE slug = :slug");
    $stmt->execute(['delta' => $delta, 'slug' => $slug]);

    // Fetch updated totals
    $fetch = $pdo->prepare('SELECT likes, dislikes FROM published_stories WHERE slug = :slug LIMIT 1');
    $fetch->execute(['slug' => $slug]);
    $updated = $fetch->fetch();

    json_response([
        'success' => true,
        'likes' => (int) ($updated['likes'] ?? 0),
        'dislikes' => (int) ($updated['dislikes'] ?? 0),
    ]);
} else {
    json_error('Method not allowed.', 405);
}
