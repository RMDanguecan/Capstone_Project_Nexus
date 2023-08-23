<?

require "conn.php";

$category = $_GET['category']; // Get selected category from the AJAX request

// Modify the query to fetch products based on the selected category
if ($category === 'all') {
    $sql = "SELECT * FROM products";
} else {
    $sql = "SELECT * FROM products WHERE category = '$category'";
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $products = array();
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    $response = array(
        'success' => true,
        'data' => $products
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'No products found'
    );
}

$conn->close();

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);


?>