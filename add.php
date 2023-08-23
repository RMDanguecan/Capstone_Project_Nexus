<?php

require "./API/conn.php";

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
 
    $productId = isset($_POST["id"]) ? $_POST["id"] : null;
    $productName = $_POST["productName"];
    $category = $_POST["category"];
    $description = $_POST["description"]; // New field
    $price = $_POST["price"];
    $quantity = $_POST["quantity"]; // New field
    $author = $_POST["author"];

  
    if (isset($_FILES["productImage"]) && $_FILES["productImage"]["error"] === UPLOAD_ERR_OK) {
     
        $tempFile = $_FILES["productImage"]["tmp_name"];

       
        $targetDirectory = "uploads/";

       
        $targetFile = $targetDirectory . uniqid() . "_" . $_FILES["productImage"]["name"];

      
        if (move_uploaded_file($tempFile, $targetFile)) {
           
            $productImage = $targetFile;
        } else {
           
            $response['success'] = false;
            $response['message'] = "Image upload failed. Please try again.";
           
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        }
    } else {
       
        $productImage = null;
    }

    if ($productId !== null) {
       
        $updateQuery = "UPDATE products SET productName = ?, category = ?, description = ?, price = ?, stock_quantity = ?, author = ?";
        $params = array($productName, $category, $description, $price, $quantity, $author);
    
       
        if ($productImage !== null) {
            $updateQuery .= ", productImage = ?";
            $params[] = $productImage;
        }   
    
      
        $updateQuery .= " WHERE id = ?";
        $params[] = $productId;
    
       
        $stmt = $conn->prepare($updateQuery);
        if ($stmt->execute($params)) {
           
            $response['success'] = true;
            $response['message'] = "Product updated successfully!";
        } else {
           
            $response['success'] = false;
            $response['message'] = "Product update failed. Please try again.";
        }
    } else {
       
        $insertQuery = "INSERT INTO products (productName, category, description, price, stock_quantity, author, productImage) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssssiss", $productName, $category, $description, $price, $quantity, $author, $productImage);
    
        if ($stmt->execute()) {
           
            $response['success'] = true;
            $response['message'] = "Product inserted successfully!";
        } else {
         
            $response['success'] = false;
            $response['message'] = "Product insertion failed. Please try again.";
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>