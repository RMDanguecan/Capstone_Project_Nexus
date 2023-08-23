<?php

require "conn.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productId = isset($_POST["id"]) ? $_POST["id"] : null;
    $productName = $_POST["productName"];
    $category = $_POST["category"];
    $price = $_POST["price"];
    $author = $_POST["author"];
    $stockQuantity = isset($_POST["stock_quantity"]) ? $_POST["stock_quantity"] : 0; // Default to 0 if not provided
    $description = isset($_POST["description"]) ? $_POST["description"] : '';

    $productImage = null;
    if (isset($_FILES["productImage"]) && $_FILES["productImage"]["error"] === UPLOAD_ERR_OK) {
        $uploadsDirectory = 'uploads/';
        if (!file_exists($uploadsDirectory)) {
            mkdir($uploadsDirectory, 0777, true);
        }

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
    }

    if ($productId !== null) {
        if ($productImage !== null) {
            $updateQuery = "UPDATE products SET productName = ?, category = ?, price = ?, author = ?, stock_quantity = ?, description = ?, productImage = ? WHERE id = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("ssdsissi", $productName, $category, $price, $author, $stockQuantity, $description, $productImage, $productId);
        } else {
            $updateQuery = "UPDATE products SET productName = ?, category = ?, price = ?, author = ?, stock_quantity = ?, description = ? WHERE id = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("ssdsisi", $productName, $category, $price, $author, $stockQuantity, $description, $productId);
        }
    } else {
        $insertQuery = "INSERT INTO products (productName, category, price, author, stock_quantity, description, productImage) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssdssiss", $productName, $category, $price, $author, $stockQuantity, $description, $productImage);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = $productId !== null ? "Product updated successfully!" : "Product inserted successfully!";
    } else {
        $response['success'] = false;
        $response['message'] = $productId !== null ? "Product update failed. Please try again." : "Product insertion failed. Please try again.";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}

header('Content-Type: application/json');
echo json_encode($response);
?>