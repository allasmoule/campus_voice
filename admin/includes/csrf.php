<?php
if (!defined('ADMIN_BOOTSTRAPPED')) {
    http_response_code(403);
    exit('Forbidden');
}

function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): void {
    echo '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

function verify_csrf(): void {
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    $token = $_POST['csrf_token'] ?? '';
    // A missing session token must never pass — otherwise hash_equals('', '')
    // is vacuously true and the check is bypassed on a token-less session.
    if ($sessionToken === '' || !is_string($token) || !hash_equals($sessionToken, $token)) {
        http_response_code(403);
        exit('Invalid or expired form submission. Please go back and try again.');
    }
}
