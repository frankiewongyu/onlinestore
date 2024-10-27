<?php
session_start();

header('Content-Type: text/plain');

if (isset($_POST['product_name'])) {
    $product_name = $_POST['product_name'];
    
    if (isset($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $key => $item) {
            if ($item['product_name'] === $product_name) {
                unset($_SESSION['cart'][$key]);
                break;
            }
        }
        // Re-index the array
        $_SESSION['cart'] = array_values($_SESSION['cart']);
    }
    
    echo "success";
} else {
    echo "error:Product name not provided";
}
?>
