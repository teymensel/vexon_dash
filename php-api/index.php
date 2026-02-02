<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Config
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'vexon_db';

$discord_client_id = 'YOUR_CLIENT_ID';
$discord_client_secret = 'YOUR_CLIENT_SECRET';
$discord_redirect_uri = 'http://localhost:3000/callback';
$jwt_secret = 'YOUR_JWT_SECRET';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Connection failed: " . $e->getMessage()]));
}

// Simple Router
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Auth Helpers
function generateJWT($user_data, $secret)
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(array_merge($user_data, ['exp' => time() + (60 * 60 * 24 * 7)]));
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function getBearerToken()
{
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function verifyJWT($token, $secret)
{
    $parts = explode('.', $token);
    if (count($parts) != 3)
        return false;
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    if ($payload['exp'] < time())
        return false;
    return $payload;
}

// API Routes
if (strpos($path, '/auth/discord') !== false && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $code = $data['code'];

    // Exchange code
    $ch = curl_init('https://discord.com/api/oauth2/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'client_id' => $discord_client_id,
        'client_secret' => $discord_client_secret,
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $discord_redirect_uri
    ]));
    $res = json_decode(curl_exec($ch), true);

    if (isset($res['access_token'])) {
        $access_token = $res['access_token'];

        // Get User info
        $ch = curl_init('https://discord.com/api/users/@me');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
        $user = json_decode(curl_exec($ch), true);

        $token = generateJWT([
            'id' => $user['id'],
            'username' => $user['username'],
            'avatar' => $user['avatar'],
            'access_token' => $access_token
        ], $jwt_secret);

        echo json_encode(["token" => $token, "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Discord Auth Failed"]);
    }
} elseif (strpos($path, '/user/guilds') !== false && $method === 'GET') {
    $token = getBearerToken();
    $userData = verifyJWT($token, $jwt_secret);
    if (!$userData) {
        http_response_code(401);
        exit();
    }

    $ch = curl_init('https://discord.com/api/users/@me/guilds');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $userData['access_token']]);
    $guilds = json_decode(curl_exec($ch), true);

    $filtered = array_filter($guilds, function ($g) {
        return ($g['permissions'] & 0x8) === 0x8 || ($g['permissions'] & 0x20) === 0x20;
    });

    echo json_encode(array_values($filtered));
} elseif (preg_match('/\/guilds\/([0-9]+)\/settings/', $path, $matches) && $method === 'GET') {
    $guild_id = $matches[1];
    $stmt = $pdo->prepare("SELECT * FROM guild_settings WHERE guild_id = ?");
    $stmt->execute([$guild_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            "modules" => json_decode($row['modules']),
            "config" => json_decode($row['config'])
        ]);
    } else {
        echo json_encode(["modules" => (object) [], "config" => (object) []]);
    }
} elseif (preg_match('/\/guilds\/([0-9]+)\/settings/', $path, $matches) && $method === 'POST') {
    $guild_id = $matches[1];
    $data = json_decode(file_get_contents("php://input"), true);
    $modules = json_encode($data['modules']);
    $config = json_encode($data['config']);

    $stmt = $pdo->prepare("INSERT INTO guild_settings (guild_id, modules, config) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE modules = ?, config = ?");
    $stmt->execute([$guild_id, $modules, $config, $modules, $config]);

    echo json_encode(["success" => true]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);
}
