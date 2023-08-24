<?php

require "conn.php";

require "session.php";



if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION["username"])) {
    
    $username = $_SESSION["username"];
    
  
    $full_name = isset($_POST["full_name"]) ? $_POST["full_name"] : '';
    $contact_number = isset($_POST["contact_number"]) ? $_POST["contact_number"] : '';
    $shipping_address = isset($_POST["shipping_address"]) ? $_POST["shipping_address"] : '';
    $total_items = isset($_POST["modalTotalItems"]) ? $_POST["modalTotalItems"] : '';
    $total_amount = isset($_POST["modalTotalAmount"]) ? $_POST["modalTotalAmount"] : '';

   
    $order_date = date("Y-m-d H:i:s");

   
    $user_id_query = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($user_id_query);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $user_id = $row["id"];
        
      
        $sql = "INSERT INTO orders (UserID, FullName, ContactNumber, ShippingAddress, TotalAmount, TotalItems, OrderDate) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssdds", $user_id, $full_name, $contact_number, $shipping_address, $total_amount, $total_items, $order_date);

        if ($stmt->execute()) {
            $response = ["success" => true, "message" => "Shipping information inserted successfully."];
        } else {
            $response = ["success" => false, "message" => "Error inserting shipping information."];
            if (strpos($stmt->error, 'TotalAmount') !== false) {
                $response["error_total_amount"] = true;
            }
            if (strpos($stmt->error, 'TotalItems') !== false) {
                $response["error_total_items"] = true;
            }
        }
        
        echo json_encode($response);
    }
}

$conn->close();
?>