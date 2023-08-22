<?php
require_once 'conn.php';

$query = "
    SELECT users.id, users.username, users.email, users.role_id, users.created_at, users.updated_at, roles.role_name
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    UNION
    SELECT admin_users.id, admin_users.username, admin_users.email, admin_users.role_id, admin_users.created_at, admin_users.updated_at, roles.role_name
    FROM admin_users
    LEFT JOIN roles ON admin_users.role_id = roles.id
";

$result = $conn->query($query);

if ($result) {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode(array()); 
}
?>