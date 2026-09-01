<?php
define('ADMIN_BOOTSTRAPPED', true);

require_once __DIR__ . '/../../backend/helpers.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => defined('SITE_IS_HTTPS') && SITE_IS_HTTPS,
        'path' => '/',
    ]);
    session_start();
}

function is_logged_in(): bool {
    return isset($_SESSION['admin_id']);
}

function require_login(): void {
    if (!is_logged_in()) {
        header('Location: 1100.php');
        exit;
    }
}

function current_admin_username(): string {
    return $_SESSION['admin_username'] ?? '';
}

function e(?string $value): string {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
