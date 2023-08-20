<?php
require_once 'conn.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $email = $_POST["email"]; // Add this line to capture email

    // Perform validation checks here, e.g., check if the username is available
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        
        $response['success'] = false;
        $response['message'] = "Username is not available. Please choose a different username.";
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Perform database insertion here
        $insertQuery = "INSERT INTO users (username, password, email) VALUES ('$username', '$hashedPassword', '$email')";
        if ($conn->query($insertQuery) === TRUE) {
           
            header("Location: ../greetings.html");
            exit();
        } else {
            // Registration failed
            $response['success'] = false;
            $response['message'] = "Registration failed. Please try again.";
        }
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>