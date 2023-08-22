<?php
require_once 'conn.php'; 

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["userId"])) {
    $userId = $_GET["userId"];

   
    $userQuery = "SELECT id, username, email, role_id FROM users WHERE id = $userId";
    $userResult = $conn->query($userQuery);

    
    $adminUserQuery = "SELECT id, username, email, role_id FROM admin_users WHERE id = $userId";
    $adminUserResult = $conn->query($adminUserQuery);

    if ($userResult && $userResult->num_rows > 0) {
        $userData = $userResult->fetch_assoc();
        $response['userData'] = $userData;
        $response['userType'] = 'user';
        $response['success'] = true;
    } elseif ($adminUserResult && $adminUserResult->num_rows > 0) {
        $adminUserData = $adminUserResult->fetch_assoc();
        $response['userData'] = $adminUserData;
        $response['userType'] = 'admin';
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['message'] = "User not found.";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}


header('Content-Type: application/json');
echo json_encode($response);
?>