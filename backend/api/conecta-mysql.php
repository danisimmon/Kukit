<?php 

$host = "kukit_mysql";
$username = "root";
$password = "root";

$conexion = mysqli_connect($host, $username, $password);
if(!$conexion){
    die("Error al conectar con la base de datos: " . mysqli_connect_error());
} 

date_default_timezone_set('Europe/Madrid');

$sql = "SHOW DATABASES LIKE 'kukit'";
$result = mysqli_query($conexion, $sql);
if(mysqli_fetch_array($result)<=0){
    $sql = "CREATE DATABASE kukit";
    $result = mysqli_query($conexion, $sql);

    mysqli_select_db($conexion, 'kukit');

    include_once 'tablas-mysql.php';
} else {
    mysqli_select_db($conexion, 'kukit');
}