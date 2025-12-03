<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Simple stats storage
$statsFile = 'stats.txt';

// Initialize or load stats
if (!file_exists($statsFile)) {
    $stats = [
        'views' => 0,
        'likes' => 0,
        'liked_ips' => []
    ];
    file_put_contents($statsFile, json_encode($stats));
} else {
    $content = file_get_contents($statsFile);
    $stats = json_decode($content, true);
    
    // Fix if file is corrupted
    if (!$stats) {
        $stats = [
            'views' => 0,
            'likes' => 0,
            'liked_ips' => []
        ];
    }
}

// Get user IP (simplified)
$userIP = $_SERVER['REMOTE_ADDR'];

// Get action
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_stats':
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        echo json_encode([
            'success' => true,
            'views' => $stats['views'],
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ]);
        break;
        
    case 'add_view':
        $stats['views']++;
        file_put_contents($statsFile, json_encode($stats));
        echo json_encode(['success' => true, 'views' => $stats['views']]);
        break;
        
    case 'toggle_like':
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        
        if ($hasLiked) {
            // User already liked - remove like
            $key = array_search($userIP, $stats['liked_ips']);
            if ($key !== false) {
                unset($stats['liked_ips'][$key]);
                $stats['liked_ips'] = array_values($stats['liked_ips']); // Reindex
                $stats['likes']--;
                $hasLiked = false;
            }
        } else {
            // Add new like
            $stats['liked_ips'][] = $userIP;
            $stats['likes']++;
            $hasLiked = true;
        }
        
        // Save to file
        file_put_contents($statsFile, json_encode($stats));
        
        echo json_encode([
            'success' => true,
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ]);
        break;
        
    default:
        // Default: return current stats
        $hasLiked = in_array($userIP, $stats['liked_ips']);
        echo json_encode([
            'success' => true,
            'views' => $stats['views'],
            'likes' => $stats['likes'],
            'total_liked' => count($stats['liked_ips']),
            'has_liked' => $hasLiked
        ]);
}
?>