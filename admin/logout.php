<?php
require_once __DIR__ . '/includes/bootstrap.php';

$_SESSION = [];
session_destroy();

header('Location: 1100.php');
exit;
