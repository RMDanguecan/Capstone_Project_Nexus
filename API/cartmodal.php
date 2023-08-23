<?php

require "conn.php";

$response = array();

if (isset($_GET['id'])) {
    $productId = $_GET['id'];
    
    $query = "SELECT * FROM products WHERE id = $productId";
    $result = $conn->query($query);
    
    if ($result && $result->num_rows > 0) {
        $product = $result->fetch_assoc();
        $response['success'] = true;
        $response['data'] = array($product);
    } else {
        $response['success'] = false;
        $response['message'] = "Product not found.";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Product ID not provided.";
}

header('Content-Type: application/json');
echo json_encode($response);

?>