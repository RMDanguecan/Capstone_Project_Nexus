<?php

require "conn.php";


if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $productId = $_GET['id'];

   
    $query = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();

 
    if ($result->num_rows > 0) {
      
        $productData = $result->fetch_assoc();

     
        $response['success'] = true;
        $response['data'] = $productData;
    } else {
       
        $response['success'] = false;
        $response['message'] = "Product not found or invalid product ID.";
    }

  
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>