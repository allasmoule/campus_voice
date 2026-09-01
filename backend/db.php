<?php
require_once __DIR__ . '/config.php';

/**
 * Never let PHP's default error/exception output — which can include full
 * server file paths, stack traces, and (for DB errors) the database
 * username — reach a visitor. Real detail goes to the server's error log;
 * visitors get a generic message and the correct 500 status.
 */
ini_set('display_errors', '0');
error_reporting(E_ALL);
header_remove('X-Powered-By');

set_exception_handler(function (Throwable $e) {
    error_log('[Unhandled] ' . get_class($e) . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo 'Something went wrong. Please try again later.';
    exit;
});

set_error_handler(function (int $severity, string $message, string $file, int $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

function get_db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}
