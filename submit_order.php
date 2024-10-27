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

// Check if the request is to store the order
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action']) && $data['action'] === 'submit_order') {
        // Order details
        $email = $conn->real_escape_string($data['email']);
        $first_name = $conn->real_escape_string($data['first_name']);
        $last_name = $conn->real_escape_string($data['last_name']);
        $address1 = $conn->real_escape_string($data['address1']);
        $address2 = $conn->real_escape_string($data['address2']);
        $region = $conn->real_escape_string($data['region']);
        $area = $conn->real_escape_string($data['area']);
        $district = $conn->real_escape_string($data['district']);
        $contact = $conn->real_escape_string($data['contact']);

        // Order summary
        $totalItems = $conn->real_escape_string($data['totalItems']);
        $totalPrice = $conn->real_escape_string($data['totalPrice']);
        
        // Start transaction
        $conn->begin_transaction();

        try {
            // Insert order details
            $sql1 = "INSERT INTO order_details (email, first_name, last_name, address1, address2, region, area, district, contact) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt1 = $conn->prepare($sql1);
            $stmt1->bind_param("sssssssss", $email, $first_name, $last_name, $address1, $address2, $region, $area, $district, $contact);
            $stmt1->execute();

            // Insert order summary
            $sql2 = "INSERT INTO order_summary (total_items, total_price) VALUES (?, ?)";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->bind_param("id", $totalItems, $totalPrice);
            $stmt2->execute();

            // Commit transaction
            $conn->commit();

            echo "success:Order submitted successfully";
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            echo "error:Error submitting order: " . $e->getMessage();
        }

        $stmt1->close();
        $stmt2->close();
    } else {
        echo "error:Invalid action";
    }
} else {
    echo "error:Invalid request method";
}

$conn->close();
?>
