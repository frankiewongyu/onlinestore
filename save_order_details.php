<?php
// Database connection details
$servername = "localhost";
$username = "paper_palette";
$password = "";
$dbname = "paper_palette";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("error:Connection failed: " . $conn->connect_error);
}

// Collect and sanitize form data
$email = $conn->real_escape_string($_POST['email']);
$first_name = $conn->real_escape_string($_POST['first_name']);
$last_name = $conn->real_escape_string($_POST['last_name']);
$address1 = $conn->real_escape_string($_POST['address1']);
$address2 = $conn->real_escape_string($_POST['address2']);
$region = $conn->real_escape_string($_POST['region']);
$area = $conn->real_escape_string($_POST['area']);
$district = $conn->real_escape_string($_POST['district']);
$contact = $conn->real_escape_string($_POST['contact']);

// Prepare SQL statement
$sql = "INSERT INTO order_details (email, first_name, last_name, address1, address2, region, area, district, contact) 
        VALUES ('$email', '$first_name', '$last_name', '$address1', '$address2', '$region', '$area', '$district', '$contact')";

if ($conn->query($sql) === TRUE) {
    echo "success:Order details saved successfully";
} else {
    echo "error:Error saving order details: " . $conn->error;
}

$conn->close();
?>
