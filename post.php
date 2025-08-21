<?php
require_once 'src/backend/db.php';

$id = $_GET['id'] ?? null;
if (!$id) {
  echo "Artículo no encontrado.";
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
$stmt->execute([$id]);
$article = $stmt->fetch();

if (!$article) {
  echo "Artículo no encontrado.";
  exit;
}

echo "<h1>" . htmlspecialchars($article['title']) . "</h1>";
echo "<div>" . nl2br($article['content']) . "</div>";
