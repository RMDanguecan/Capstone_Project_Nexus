<?php
// Database connection parameters
$host = "localhost";
$username = "root";
$password = "9280569";
$database = "project_nexus_db";


$conn = mysqli_connect($host, $username, $password, $database);


if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>