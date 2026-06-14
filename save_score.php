<?php
// Define custom execution runtime headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 

// Database configuration settings
$host = "localhost";
$dbname = "game_db";
$username = "root"; 
$password = "";     

// Create strict connection boundary inside persistent handling channel
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Intercept raw incoming request data stream
$inputData = json_decode(file_get_contents("php://input"), true);

$userGuessName = isset($inputData['username']) ? trim($inputData['username']) : '';
$userScore = isset($inputData['score']) ? intval($inputData['score']) : 0;

// Validate payload contents before running structural updates
if (empty($userGuessName) || $userScore <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid inputs received"]);
    exit();
}

// Bind payload variables inside an isolated prepared statement parameter map
try {
    $sql = "INSERT INTO leaderboards (username, score) VALUES (:username, :score)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':username' => $userGuessName,
        ':score' => $userScore
    ]);

    echo json_encode(["status" => "success", "message" => "Score saved successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database write error occurred"]);
}
?>