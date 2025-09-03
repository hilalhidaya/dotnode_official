<?php
declare(strict_types=1);

/**
 * Conexión PDO estable (Hostinger).
 * Si quieres mover estos valores fuera del repo, hazlo con un archivo no versionado.
 */
$host    = 'localhost'; // En Hostinger suele ser localhost
$db      = 'u863904283_dotnode_blog';
$user    = 'u863904283_dothidaya';
$pass    = 'Dotnode.0911';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
  PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci",
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  // En producción, muestra genérico. Con ?debug=1, muestra el detalle.
  $generic = 'Error de conexión a la base de datos.';
  $detail  = $generic . ' ' . $e->getMessage();
  echo isset($_GET['debug']) ? $detail : $generic;
  error_log('[DB] ' . $e->getMessage());
  exit;
}
