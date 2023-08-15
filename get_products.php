<?php

require "conn.php";


$response = array();


$query = "SELECT * FROM products";
$result = $conn->query($query);


if ($result) {
   
    $products = array();
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

   
    $response['success'] = true;
    $response['data'] = $products;
} else {
    
    $response['success'] = false;
    $response['message'] = "Failed to fetch products from the database.";
}


header('Content-Type: application/json');
echo json_encode($response);
?>