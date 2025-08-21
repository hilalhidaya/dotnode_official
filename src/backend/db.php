<?php
$host = 'localhost'; // o el host que te indique Hostinger
$db   = 'u863904283_dotnode_blog';     // el nombre completo que te dio Hostinger
$user = 'u863904283_dothidaya';   // el usuario
$pass = 'Dotnode.0911';            // la contraseña que creaste
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
  http_response_code(500);
  echo "Error de conexión: " . $e->getMessage();
  exit;
}
