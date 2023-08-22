<?php
require_once 'conn.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $email = $_POST["email"]; 

   
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        $response['success'] = false;
        $response['message'] = "Username is not available. Please choose a different username.";
    } else {
       
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

       
        $defaultRoleId = 2; 
        
      
        $insertQuery = "INSERT INTO users (username, password, email, role_id) VALUES ('$username', '$hashedPassword', '$email', '$defaultRoleId')";
        if ($conn->query($insertQuery) === TRUE) {
            header("Location: ../greetings.html");
            exit();
        } else {
          
            $response['success'] = false;
            $response['message'] = "Registration failed. Please try again.";
        }
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}


header('Content-Type: application/json');
echo json_encode($response);
?>