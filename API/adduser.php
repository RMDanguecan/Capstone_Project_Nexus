<?php
require_once 'conn.php'; // Include your database connection file

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["add"])) {
    $username = $_POST["userName"];
    $email = $_POST["email"];
    $password = $_POST["newPassword"];
    $confirmPassword = $_POST["confirmPassword"];

    // Perform validation checks here, e.g., check if username and email are not empty
    if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
        $response['success'] = false;
        $response['message'] = "Please fill out all fields.";
    } elseif ($password !== $confirmPassword) {
        $response['success'] = false;
        $response['message'] = "Passwords do not match. Please make sure to enter the same password in both fields.";
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Perform database insertion here
        $insertQuery = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";
        if ($conn->query($insertQuery) === TRUE) {
            // User added successfully
            $response['success'] = true;
            $response['message'] = "User added successfully!";
        } else {
            // Error adding user
            $response['success'] = false;
            $response['message'] = "Error adding user. Please try again.";
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