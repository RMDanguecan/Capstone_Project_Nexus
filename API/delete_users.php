<?php
require_once 'conn.php'; 
$response = array();

if ($_SERVER["REQUEST_METHOD"] == "DELETE" && isset($_GET["userId"])) {
    $userId = $_GET["userId"];


    $deleteUserQuery = "DELETE FROM users WHERE id = ?";
    $stmt = $conn->prepare($deleteUserQuery);
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
       
        $deleteAdminUserQuery = "DELETE FROM admin_users WHERE id = ?";
        $stmtAdmin = $conn->prepare($deleteAdminUserQuery);
        $stmtAdmin->bind_param("i", $userId);

        if ($stmtAdmin->execute()) {
            $response['success'] = true;
            $response['message'] = "User deleted successfully!";
        } else {
            $response['success'] = false;
            $response['message'] = "Failed to delete user from admin_users table. Please try again.";
            $response['error'] = $stmtAdmin->error;
        }

        $stmtAdmin->close();
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to delete user from users table. Please try again.";
        $response['error'] = $stmt->error;
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}


header('Content-Type: application/json');
echo json_encode($response);
?>