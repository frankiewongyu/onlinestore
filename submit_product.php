<?php
session_start();

header('Content-Type: text/plain');

// Collect form data
$product_name = $_POST['product_name'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];
$image_url = $_POST['image_url'];

// Initialize the cart if it doesn't exist
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Check if the product already exists in the cart
$product_exists = false;
foreach ($_SESSION['cart'] as &$item) {
    if ($item['product_name'] === $product_name) {
        $item['quantity'] += $quantity;
        $product_exists = true;
        break;
    }
}

// If the product doesn't exist, add it to the cart
if (!$product_exists) {
    $_SESSION['cart'][] = [
        'product_name' => $product_name,
        'price' => $price,
        'quantity' => $quantity,
        'image_url' => $image_url
    ];
}

echo "success:Product added successfully";
?>
