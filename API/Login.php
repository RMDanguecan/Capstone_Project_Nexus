<?php

require "conn.php";

$username = $_POST['username'];
$password = $_POST['password'];

// Query admin_users table
$queryAdmin = "SELECT * FROM admin_users WHERE username = '$username'";
$resultAdmin = mysqli_query($conn, $queryAdmin);

// Query users table
$queryUser = "SELECT * FROM users WHERE username = '$username'";
$resultUser = mysqli_query($conn, $queryUser);

if (mysqli_num_rows($resultAdmin) > 0) {
    $rowAdmin = mysqli_fetch_assoc($resultAdmin);

    if (password_verify($password, $rowAdmin['password'])) {
        session_start();
        $_SESSION["login"] = true;
        $_SESSION["id"] = $rowAdmin["id"];
        $_SESSION["username"] = $rowAdmin["username"];
        $_SESSION["role"] = "admin"; // Admin role

        $response = ['success' => true, 'role' => 'admin'];
    } else {
        $response = ['Invalid Password' => false];
    }
} elseif (mysqli_num_rows($resultUser) > 0) {
    $rowUser = mysqli_fetch_assoc($resultUser);

    if (password_verify($password, $rowUser['password'])) {
        session_start();
        $_SESSION["login"] = true;
        $_SESSION["id"] = $rowUser["id"];
        $_SESSION["username"] = $rowUser["username"];
        $_SESSION["role"] = "user"; // User role

        $response = ['success' => true, 'role' => 'user'];
    } else {
        $response = ['Invalid Password' => false];
    }
} else {
    $response = ['User Not Found' => false];
}

mysqli_close($conn);

header('Content-Type: application/json');
echo json_encode($response);
?>