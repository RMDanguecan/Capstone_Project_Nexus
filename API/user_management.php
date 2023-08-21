<?php
require_once 'conn.php';

$query = "SELECT id, username, email, created_at, updated_at FROM users";
$result = $conn->query($query);

$data = array(); // Initialize an array to store the fetched data

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row; // Add each row to the data array
    }
}

$conn->close();

// Return the data in JSON format
header('Content-Type: application/json');
echo json_encode($data);
?>