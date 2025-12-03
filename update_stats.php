<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$statsFile = 'stats.txt';

// Create default stats if file doesn't exist
if (!file_exists($statsFile)) {
    $defaultStats = [
        'views' => 0,
        'likes' => 0,
        'unique_visitors' => 0,
        'liked_ips' => []
    ];
    file_put_contents($statsFile, json_encode($defaultStats));
}

// Load stats
$stats = json_decode(file_get_contents($statsFile), true);

// Get user IP
$userIP = $_SERVER['REMOTE_ADDR'];

$action = $_POST['action'] ?? $_GET['action'] ?? 'get_stats';

switch ($action) {
    case 'get_stats':
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        echo json_encode([
            'success' => true,
            'views' => $stats['views'],
            'likes' => $stats['likes'],
            'unique_visitors' => $stats['unique_visitors'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ]);
        break;
        
    case 'add_view':
        $stats['views']++;
        
        // Simple unique visitor tracking
        if (!in_array($userIP, $stats['liked_ips'])) {
            $stats['unique_visitors']++;
        }
        
        file_put_contents($statsFile, json_encode($stats));
        echo json_encode(['success' => true, 'views' => $stats['views']]);
        break;
        
    case 'toggle_like':
        if (in_array($userIP, $stats['liked_ips'])) {
            // Remove like
            $key = array_search($userIP, $stats['liked_ips']);
            unset($stats['liked_ips'][$key]);
            $stats['liked_ips'] = array_values($stats['liked_ips']);
            $stats['likes']--;
            $hasLiked = false;
        } else {
            // Add like
            $stats['liked_ips'][] = $userIP;
            $stats['likes']++;
            $hasLiked = true;
        }
        
        file_put_contents($statsFile, json_encode($stats));
        echo json_encode([
            'success' => true,
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>