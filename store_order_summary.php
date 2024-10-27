<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: text/plain');

// Database connection details
$servername = "localhost";
$username = "paper_palette";
$password = "";
$dbname = "paper_palette";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo "error:Connection failed: " . $conn->connect_error;
    exit;
}

// Check if the request is to store the order summary
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action']) && $data['action'] === 'store_order_summary') {
        $totalItems = $conn->real_escape_string($data['totalItems']);
        $totalPrice = $conn->real_escape_string($data['totalPrice']);
        
        // Store the order summary
        $sql = "INSERT INTO order_summary (total_items, total_price) VALUES ('$totalItems', '$totalPrice')";
        
        if ($conn->query($sql) === TRUE) {
            echo "success:Order summary stored successfully";
        } else {
            echo "error:Error storing order summary: " . $conn->error;
        }
    } else {
        echo "error:Invalid action";
    }
} else {
    echo "error:Invalid request method";
}

$conn->close();
?>
