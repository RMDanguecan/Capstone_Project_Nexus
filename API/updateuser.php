<?php
require_once 'conn.php'; 

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["update"])) {
    $username = $_POST["updateUserName"];
    $email = $_POST["updateEmail"];
    $password = $_POST["updatePassword"];
    $role_name = $_POST["updateRole"]; 
    $userId = $_POST["updateUserId"];

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $roleQuery = "SELECT id FROM roles WHERE role_name = ?";
    $stmt = $conn->prepare($roleQuery);
    $stmt->bind_param("s", $role_name);
    $stmt->execute();
    $stmt->bind_result($role_id);
    $stmt->fetch();
    $stmt->close();

    $updateQuery = "UPDATE admin_users SET username = ?, email = ?, password = ?, role_id = ? WHERE id = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("ssssi", $username, $email, $hashedPassword, $role_id, $userId);

    if ($stmt->execute()) {
      
        $insertUserQuery = "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertUserQuery);
        $stmt->bind_param("sssi", $username, $email, $hashedPassword, $role_id);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "User updated successfully and transferred to users table!";
        } else {
            $response['success'] = false;
            $response['message'] = "Error transferring user to users table. Please try again.";
            $response['error'] = $stmt->error; 
        }
        $stmt->close();
    } else {
        $response['success'] = false;
        $response['message'] = "Error updating user in admin_users table. Please try again.";
        $response['error'] = $stmt->error; 
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}

header('Content-Type: application/json');
echo json_encode($response);
?>