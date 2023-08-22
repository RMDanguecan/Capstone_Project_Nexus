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

    
    if (isset($_POST["userType"])) {
        $userType = $_POST["userType"];

       
        $updateQuery = "UPDATE admin_users SET username = ?, email = ?, password = ?, role_id = ? WHERE id = ?";

        if (!empty($updateQuery)) {
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("sssii", $username, $email, $hashedPassword, $role_id, $userId);

            if ($stmt->execute()) {
                
                $insertUserQuery = "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($insertUserQuery);
                $stmt->bind_param("sssi", $username, $email, $hashedPassword, $role_id);
                $stmt->execute();
                $stmt->close();

                
                $deleteQuery = "DELETE FROM admin_users WHERE id = ?";
                $stmt = $conn->prepare($deleteQuery);
                $stmt->bind_param("i", $userId);
                $stmt->execute();
                $stmt->close();

               
                $response['success'] = true;
                $response['message'] = "User updated successfully!";
            } else {
               
                $response['success'] = false;
                $response['message'] = "Error updating user. Please try again.";
                $response['error'] = $stmt->error; 
            }
        } else {
            
            $response['success'] = false;
            $response['message'] = "Empty update query. Please check userType value.";
        }
    } else {
       
        $response['success'] = false;
        $response['message'] = "User type not specified.";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request!";
}


header('Content-Type: application/json');
echo json_encode($response);
?>