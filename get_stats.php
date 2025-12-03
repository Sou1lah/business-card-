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
        'total_liked' => 0,
        'has_liked' => false
    ]);
    exit;
}

$stats = json_decode(file_get_contents($statsFile), true);
$userIP = $_SERVER['REMOTE_ADDR'];
$hasLiked = in_array($userIP, $stats['liked_ips']);

echo json_encode([
    'success' => true,
    'views' => $stats['views'],
    'likes' => $stats['likes'],
    'unique_visitors' => $stats['unique_visitors'],
    'total_liked' => count($stats['liked_ips']),
    'has_liked' => $hasLiked
]);
?>