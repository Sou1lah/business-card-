<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// CHANGE THIS PASSWORD!
$ADMIN_PASSWORD = 'your_secret_password_here';

$statsFile = 'stats.txt';

// Initialize default stats
$defaultStats = [
    'views' => 0,
    'likes' => 0,
    'unique_visitors' => 0,
    'liked_ips' => []
];

// Load stats from file
function loadStats() {
    global $statsFile, $defaultStats;
    
    if (!file_exists($statsFile)) {
        // Create file with default stats
        saveStats($defaultStats);
        return $defaultStats;
    }
    
    $content = file_get_contents($statsFile);
    $lines = explode("\n", trim($content));
    $stats = $defaultStats;
    
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
    
    return $stats;
}

// Save stats to file
function saveStats($stats) {
    global $statsFile;
    
    $content = "";
    foreach ($stats as $key => $value) {
        if ($key === 'liked_ips') {
            $content .= $key . ':' . json_encode($value) . "\n";
        } else {
            $content .= $key . ':' . $value . "\n";
        }
    }
    
    file_put_contents($statsFile, $content);
    return true;
}

// Get user IP
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// Check if admin
function isAdmin() {
    global $ADMIN_PASSWORD;
    return isset($_POST['admin_password']) && $_POST['admin_password'] === $ADMIN_PASSWORD;
}

// Main logic
$action = $_POST['action'] ?? $_GET['action'] ?? 'get_stats';
$stats = loadStats();
$userIP = getUserIP();
$response = ['success' => false];

try {
    switch ($action) {
        case 'get_stats':
            // Check if user has liked
            $hasLiked = in_array($userIP, $stats['liked_ips']);
            $response = [
                'success' => true,
                'views' => $stats['views'],
                'likes' => $stats['likes'],
                'unique_visitors' => $stats['unique_visitors'],
                'has_liked' => $hasLiked
            ];
            break;
            
        case 'add_view':
            $stats['views']++;
            
            // Track unique visitor (simplified - using IP)
            if (!in_array($userIP, $stats['liked_ips'])) {
                $stats['unique_visitors']++;
            }
            
            saveStats($stats);
            $response = ['success' => true, 'views' => $stats['views']];
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
            
            saveStats($stats);
            $response = [
                'success' => true,
                'likes' => $stats['likes'],
                'has_liked' => $hasLiked
            ];
            break;
            
        case 'get_detailed_stats':
            if (isAdmin()) {
                $response = [
                    'success' => true,
                    'views' => $stats['views'],
                    'likes' => $stats['likes'],
                    'unique_visitors' => $stats['unique_visitors'],
                    'total_liked_users' => count($stats['liked_ips']),
                    'is_admin' => true
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Admin access required'
                ];
            }
            break;
            
        case 'reset_stats':
            if (isAdmin()) {
                $stats = $defaultStats;
                saveStats($stats);
                $response = ['success' => true, 'message' => 'Stats reset successfully'];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Admin access required'
                ];
            }
            break;
            
        default:
            $response = ['success' => false, 'message' => 'Invalid action'];
    }
} catch (Exception $e) {
    $response = ['success' => false, 'message' => 'Server error: ' . $e->getMessage()];
}

echo json_encode($response);
?>