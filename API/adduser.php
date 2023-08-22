<?php
require_once 'conn.php'; 

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["add"])) {
    $username = $_POST["userName"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirmPassword"];
    $role = $_POST["role"]; 

   


  
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  
    $roleQuery = "SELECT id FROM roles WHERE role_name = '$role'";
    $roleResult = $conn->query($roleQuery);

    if ($roleResult && $roleResult->num_rows > 0) {
        $roleData = $roleResult->fetch_assoc();
        $role_id = $roleData['id']; 
    } else {
    
        $response['success'] = false;
        $response['message'] = "Invalid role selected.";
        echo json_encode($response);
        exit();
    }

    if ($role == "admin") {
     
        $insertQuery = "INSERT INTO admin_users (username, email, password, role_id) VALUES ('$username', '$email', '$hashedPassword', $role_id)";
    } elseif ($role == "user") {
      
        $insertQuery = "INSERT INTO users (username, email, password, role_id) VALUES ('$username', '$email', '$hashedPassword', $role_id)";
    } else {
   
        $response['success'] = false;
        $response['message'] = "Invalid role selected.";
        echo json_encode($response);
        exit();
    }

    if ($conn->query($insertQuery) === TRUE) {
    
        $response['success'] = true;
        $response['message'] = "User added successfully!";
    } else {
    
        $response['success'] = false;
        $response['message'] = "Error adding user. Please try again.";
        $response['error'] = $conn->error; 
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}


header('Content-Type: application/json');
echo json_encode($response);
?>