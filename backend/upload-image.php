<?php
/**
 * Public image upload for the submit form — used for both the cover image
 * and images inserted into the rich-text body. Anonymous by design (same as
 * the rest of the submission flow), so it's rate-limited and tightly
 * validated in handle_media_upload() rather than gated behind a login.
 */
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/media.php';

require_method('POST');

if (!check_rate_limit('image_upload', 20, 60)) {
    json_error('Too many uploads from this connection. Please try again later.', 429);
}

$upload = handle_media_upload('image', 'image', 'submissions');

if (!empty($upload['error'])) {
    json_error($upload['error']);
}
if (empty($upload['ok'])) {
    json_error('Please choose an image to upload.');
}

json_response(['url' => '/' . $upload['path']], 201);
