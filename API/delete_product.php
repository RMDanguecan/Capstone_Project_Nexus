<?php


require_once 'conn.php';


if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
  http_response_code(405); 
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
  exit;
}


if (!isset($_GET['id'])) {
  http_response_code(400); 
  echo json_encode(['success' => false, 'message' => 'Product ID not provided']);
  exit;
}

$productId = $_GET['id'];


try {
  
  
  if ($conn->connect_error) {
    http_response_code(500); 
    echo json_encode(['success' => false, 'message' => 'Failed to connect to the database']);
    exit;
  }

  $stmt = $conn->prepare('DELETE FROM products WHERE id = ?');
  $stmt->bind_param('i', $productId);
  $stmt->execute();

  
  $rowCount = $stmt->affected_rows;
  if ($rowCount > 0) {
    
    echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    exit;
  } else {
    // wag naman :(
    http_response_code(404);  
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
  }
} catch (Exception $e) {
  
  http_response_code(500); 
  echo json_encode(['success' => false, 'message' => 'Failed to delete product: ' . $e->getMessage()]);
  exit;
}