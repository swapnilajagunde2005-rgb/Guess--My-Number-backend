<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = "localhost";
$dbname = "game_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetches only the top 5 highest scores from the database
    $stmt = $pdo->query("SELECT username, score FROM leaderboards ORDER BY score DESC LIMIT 5");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $scores]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database read failure"]);
}
?>