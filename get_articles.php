<?php
require_once 'src/backend/db.php';

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;
$language = $_GET['lang'] ?? 'en';

$sql = "SELECT id, title, summary FROM articles WHERE language = ? ORDER BY created_at DESC";
$params = [$language];

if ($limit > 0) {
  $sql .= " LIMIT ?";
  $params[] = $limit;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$articles = $stmt->fetchAll();

foreach ($articles as $a) {
  echo "<article class='article-card'>";
  echo "<h3><a href='post.php?id={$a['id']}'>" . htmlspecialchars($a['title']) . "</a></h3>";
  echo "<p>" . htmlspecialchars($a['summary']) . "</p>";
  echo "</article>";
}
