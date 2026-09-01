<?php
/**
 * Media upload handling — used by the admin Ads page and by the public
 * submission form (cover images / in-article images).
 *
 * Security notes:
 *  - The stored filename is always machine-generated (random hex + a fixed
 *    extension we choose) — the visitor-supplied filename is never used for
 *    anything beyond deciding "does this look like an image or a video".
 *  - The extension is derived from the file's real MIME type (via finfo),
 *    not from the original filename, so a ".jpg" that's actually a PHP
 *    script cannot end up served with a misleading extension.
 *  - uploads/.htaccess additionally refuses to serve anything with an
 *    executable-looking extension, as defense in depth.
 */

define('UPLOADS_ROOT', __DIR__ . '/../uploads/');

const IMAGE_MIME_EXT = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
];

const VIDEO_MIME_EXT = [
    'video/mp4' => 'mp4',
    'video/webm' => 'webm',
    'video/ogg' => 'ogv',
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;  // 30 MB

const ALLOWED_UPLOAD_SUBDIRS = ['ads', 'submissions', 'inquiries'];

/**
 * @return array{ok:bool, path?:string, error?:string} 'path' is relative to the site root (e.g. "uploads/ads/abc123.jpg")
 */
function handle_media_upload(string $fieldName, string $kind, string $subdir = 'ads'): array {
    if (!in_array($subdir, ALLOWED_UPLOAD_SUBDIRS, true)) {
        $subdir = 'ads';
    }

    if (empty($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] === UPLOAD_ERR_NO_FILE) {
        return ['ok' => false, 'error' => null]; // no file provided — not necessarily an error
    }

    $file = $_FILES[$fieldName];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['ok' => false, 'error' => 'Upload failed (error code ' . $file['error'] . ').'];
    }

    $maxBytes = $kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if ($file['size'] > $maxBytes) {
        $mb = round($maxBytes / 1024 / 1024);
        return ['ok' => false, 'error' => "File is too large. Maximum size is {$mb}MB."];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $map = $kind === 'video' ? VIDEO_MIME_EXT : IMAGE_MIME_EXT;
    if (!isset($map[$mime])) {
        $allowed = implode(', ', array_keys($map));
        return ['ok' => false, 'error' => "Unsupported file type ({$mime}). Allowed: {$allowed}."];
    }

    $dir = UPLOADS_ROOT . $subdir . '/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $map[$mime];
    $destination = $dir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return ['ok' => false, 'error' => 'Could not save the uploaded file.'];
    }

    return ['ok' => true, 'path' => 'uploads/' . $subdir . '/' . $filename];
}

function delete_media_file(?string $relativePath): void {
    if (!$relativePath) return;
    $full = __DIR__ . '/../' . $relativePath;
    $real = realpath($full);
    $uploadsReal = realpath(UPLOADS_ROOT);
    if ($real && $uploadsReal && str_starts_with($real, $uploadsReal) && is_file($real)) {
        unlink($real);
    }
}
