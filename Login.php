<?php

require "conn.php";


$username = $_POST['username'];
$password = $_POST['password'];




$query = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
 
    $row = mysqli_fetch_assoc($result);
    if (password_verify($password, $row['password'])) {
  
        session_start();
        $_SESSION["login"] = true;
        $_SESSION["id"] = $row["id"];   
        $_SESSION["username"] = $row["username"];

       
        $response = ['success' => true];
        echo json_encode($response);    
    } else {
      
     
        $response = ['Invalid Password' => false];
        echo json_encode($response);
    }
} else {
   
  
    $response = ['User Not Found' => false];
    header('Content-Type: application/json');
    echo json_encode($response);
}


mysqli_close($conn);
?>