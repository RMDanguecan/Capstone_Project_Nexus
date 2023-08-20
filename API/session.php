<?php
session_start();

$response = [];

if (isset($_SESSION["login"]) && $_SESSION["login"] === true) {
 
    $response['isLoggedIn'] = true;
    $response['username'] = $_SESSION['username'];

    if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
       
        session_unset();
        session_destroy();
        $response['loggedOut'] = true;
    }
} else {
    
    $response['isLoggedIn'] = false;
}

header('Content-Type: application/json');
echo json_encode($response);
?>