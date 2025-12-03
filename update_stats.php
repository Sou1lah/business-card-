<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// DEBUG MODE - Uncomment to see errors
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

$statsFile = 'stats.txt';

// Create file if doesn't exist
if (!file_exists($statsFile)) {
    $stats = [
        'views' => 0,
        'likes' => 0,
        'liked_ips' => []
    ];
    file_put_contents($statsFile, json_encode($stats));
}

// Load stats
$content = file_get_contents($statsFile);
$stats = json_decode($content, true);

// Fix corrupted file
if (!$stats) {
    $stats = [
        'views' => 0,
        'likes' => 0,
        'liked_ips' => []
    ];
    file_put_contents($statsFile, json_encode($stats));
}

// Get user IP (better method)
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
$action = $_POST['action'] ?? $_GET['action'] ?? 'get_stats';

// Log for debugging
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - IP: $userIP - Action: $action\n", FILE_APPEND);

switch ($action) {
    case 'get_stats':
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        $response = [
            'success' => true,
            'views' => $stats['views'],
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ];
        break;
        
    case 'add_view':
        $stats['views']++;
        file_put_contents($statsFile, json_encode($stats));
        $response = ['success' => true, 'views' => $stats['views']];
        break;
        
    case 'toggle_like':
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        
        if ($hasLiked) {
            // Remove like
            $key = array_search($userIP, $stats['liked_ips']);
            if ($key !== false) {
                unset($stats['liked_ips'][$key]);
                $stats['liked_ips'] = array_values($stats['liked_ips']);
                $stats['likes'] = max(0, $stats['likes'] - 1);
                $hasLiked = false;
            }
        } else {
            // Add like
            $stats['liked_ips'][] = $userIP;
            $stats['likes']++;
            $hasLiked = true;
        }
        
        file_put_contents($statsFile, json_encode($stats));
        $response = [
            'success' => true,
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ];
        break;
        
    default:
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        $response = [
            'success' => true,
            'views' => $stats['views'],
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ];
}

echo json_encode($response);
?>