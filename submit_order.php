<?php
// Database connection
$servername = "localhost";
$username = "paper_palette";
$password = "";
$dbname = "paper_palette";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Start transaction
    $conn->beginTransaction();
    
    // Insert into orders table
    $orderSql = "INSERT INTO orders (
        email, first_name, last_name, address1, address2, 
        region, area, district, contact, payment_method, 
        total_items, total_price, order_date
    ) VALUES (
        :email, :firstName, :lastName, :address1, :address2,
        :region, :area, :district, :contact, :paymentMethod,
        :totalItems, :totalPrice, NOW()
    )";
    
    $orderStmt = $conn->prepare($orderSql);
    $orderStmt->execute([
        ':email' => $data['email'],
        ':firstName' => $data['firstName'],
        ':lastName' => $data['lastName'],
        ':address1' => $data['address1'],
        ':address2' => $data['address2'],
        ':region' => $data['region'],
        ':area' => $data['area'],
        ':district' => $data['district'],
        ':contact' => $data['contact'],
        ':paymentMethod' => $data['paymentMethod'],
        ':totalItems' => $data['totalItems'],
        ':totalPrice' => $data['totalPrice']
    ]);
    
    $orderId = $conn->lastInsertId();
    
    // Insert order items
    $itemSql = "INSERT INTO order_items (
        order_id, product_name, quantity, price, image_url
    ) VALUES (
        :orderId, :productName, :quantity, :price, :imageUrl
    )";
    
    $itemStmt = $conn->prepare($itemSql);
    
    foreach ($data['items'] as $item) {
        $itemStmt->execute([
            ':orderId' => $orderId,
            ':productName' => $item['name'] ?? $item['product_name'],
            ':quantity' => $item['quantity'],
            ':price' => $item['price'],
            ':imageUrl' => $item['image'] ?? $item['image_url']
        ]);
    }
    
    // Commit transaction
    $conn->commit();
    
    echo "success: Order submitted successfully!";
} catch(PDOException $e) {
    // Rollback transaction on error
    if ($conn->inTransaction()) {
        $conn->rollback();
    }
    echo "Error: " . $e->getMessage();
}

$conn = null;
?>
