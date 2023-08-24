<?php
require_once 'conn.php'; 

$query = "SELECT * FROM orders"; 
$result = $conn->query($query);

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}


$conn->close();


header('Content-Type: application/json');
echo json_encode($data);
?>