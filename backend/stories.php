<?php
require_once __DIR__ . '/helpers.php';

require_method('GET');

$pdo = get_db();
$category = trim((string) ($_GET['category'] ?? ''));
$slug = trim((string) ($_GET['slug'] ?? ''));

function format_story_row(array $row): array {
    return [
        'id' => (string) ($row['id'] ?? $row['slug']),
        'slug' => $row['slug'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'content' => $row['content'],
        'imageUrl' => $row['cover_image_path'] ? '/' . ltrim($row['cover_image_path'], '/') : null,
        'category' => $row['category'],
        'categoryColor' => $row['category_color'],
        'readTime' => (int) $row['read_time'],
        'likes' => (int) ($row['likes'] ?? 0),
        'dislikes' => (int) ($row['dislikes'] ?? 0),
        'createdAt' => $row['created_at'],
        'status' => 'PUBLISHED',
    ];
}

if ($slug !== '') {
    $stmt = $pdo->prepare(
        'SELECT id, slug, title, excerpt, content, cover_image_path, category, category_color, read_time, likes, dislikes, created_at
         FROM published_stories WHERE slug = :slug LIMIT 1'
    );
    $stmt->execute(['slug' => $slug]);
    $row = $stmt->fetch();
    if (!$row) {
        json_error('Story not found.', 404);
    }
    json_response(['story' => format_story_row($row)]);
}

if ($category !== '' && in_array($category, ALLOWED_CATEGORIES, true)) {
    $stmt = $pdo->prepare(
        'SELECT id, slug, title, excerpt, content, cover_image_path, category, category_color, read_time, likes, dislikes, created_at
         FROM published_stories WHERE category = :category ORDER BY created_at DESC LIMIT 100'
    );
    $stmt->execute(['category' => $category]);
} else {
    $stmt = $pdo->query(
        'SELECT id, slug, title, excerpt, content, cover_image_path, category, category_color, read_time, likes, dislikes, created_at
         FROM published_stories ORDER BY created_at DESC LIMIT 100'
    );
}

$rows = $stmt->fetchAll();
json_response(['stories' => array_map('format_story_row', $rows)]);
