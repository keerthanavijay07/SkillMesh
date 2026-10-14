<?php
/**
 * SkillMesh – Database Connection
 * Subject: CS23531 Web Programming
 * Technology: PHP PDO MySQL Database Connectivity
 *
 * Configuration is loaded from php/config.php when the file exists.
 * If config.php is absent, standard XAMPP/WAMP defaults are used.
 * Copy php/config.example.php → php/config.php and edit to customise.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load config.php if the deployer has created it; otherwise fall back to XAMPP defaults.
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    $db_host = DB_HOST;
    $db_user = DB_USER;
    $db_pass = DB_PASS;
    $db_name = DB_NAME;
    $ports   = DB_PORTS;
} else {
    $db_host = '127.0.0.1';
    $db_user = 'root';
    $db_pass = '';              // XAMPP default – blank password
    $db_name = 'skillmesh_db';
    $ports   = [3307, 3306];  // Try XAMPP 3307 first, then standard 3306
}
$pdo = null;
$lastError = '';

foreach ($ports as $port) {
    try {
        $pdo = new PDO("mysql:host=$db_host;port=$port;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 2
        ]);
        break;
    } catch (PDOException $e) {
        $lastError = $e->getMessage();
    }
}

if (!$pdo) {
    // Return friendly error response
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $lastError
    ]);
    exit();
}

/**
 * Utility function to send formatted JSON responses
 */
function sendResponse($status, $data = [], $message = '') {
    echo json_encode([
        'status' => $status,
        'data' => $data,
        'message' => $message
    ]);
    exit();
}
?>
