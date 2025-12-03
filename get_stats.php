<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$statsFile = 'stats.txt';

if (!file_exists($statsFile)) {
    echo json_encode([
        'success' => true,
        'views' => 0,
        'likes' => 0,
        'unique_visitors' => 0,
        'has_liked' => false
    ]);
    exit;
}

$content = file_get_contents($statsFile);
$lines = explode("\n", trim($content));

$stats = [
    'views' => 0,
    'likes' => 0,
    'unique_visitors' => 0,
    'liked_ips' => []
];

foreach ($lines as $line) {
    if (strpos($line, ':') !== false) {
        list($key, $value) = explode(':', $line, 2);
        if ($key === 'liked_ips') {
            $stats[$key] = json_decode($value, true) ?: [];
        } else {
            $stats[$key] = intval($value);
        }
    }
}

// Get user IP for checking if they liked
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

$userIP = getUserIP();
$hasLiked = in_array($userIP, $stats['liked_ips']);

echo json_encode([
    'success' => true,
    'views' => $stats['views'],
    'likes' => $stats['likes'],
    'unique_visitors' => $stats['unique_visitors'],
    'has_liked' => $hasLiked
]);
?>