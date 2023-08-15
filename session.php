<?php
session_start();


if (isset($_SESSION["login"]) && $_SESSION["login"] === true) {
    $response = ['isLoggedIn' => true, 'username' => $_SESSION['username']];
} else {
    $response = ['isLoggedIn' => false];
}


header('Content-Type: application/json');
echo json_encode($response);
?>  