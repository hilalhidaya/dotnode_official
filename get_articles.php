<?php
require_once __DIR__ . '/src/backend/db.php';

// helper seguro
function param($key, $default = null) {
  return isset($_GET[$key]) ? trim($_GET[$key]) : $default;
}
function h($str) {
  return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

$limit    = intval(param('limit', 0));
$page     = max(1, intval(param('page', 1)));
$per      = max(1, min(50, intval(param('per', 10))));
$offset   = ($page - 1) * $per;

$cat      = param('cat');                   // clave técnica de categoría (web-dev, ux-ui, etc.)
$featured = intval(param('featured', 0));   // 1 = solo destacados
$lang     = param('language', 'en');        // idioma (por defecto en)
$format   = param('format', 'html');        // html o json

$where = ["status = 'published'"];
$args  = [];

if ($cat) {
  $where[] = "category = ?";
  $args[]  = $cat;
}

if ($lang) {
  $where[] = "language = ?";
  $args[]  = $lang;
}

if ($featured === 1) {
  $where[] = "featured = 1";
}

$whereSql = "WHERE " . implode(' AND ', $where);

// orden: destacados primero por featured_order, luego fecha
$orderSql = $featured === 1
  ? "ORDER BY (featured_order IS NULL), featured_order ASC, created_at DESC"
  : "ORDER BY created_at DESC";

// limit/offset
if ($limit > 0) {
  $limitSql = "LIMIT ?";
  $limitArgs = [$limit];
} else {
  $limitSql = "LIMIT ? OFFSET ?";
  $limitArgs = [$per, $offset];
}

// total para paginación si no hay limit fijo
$total = null;
if ($limit === 0) {
  $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM articles $whereSql");
  $stmtTotal->execute($args);
  $total = (int) $stmtTotal->fetchColumn();
}

$sql = "SELECT id, title, slug, summary, category, language, created_at
        FROM articles
        $whereSql
        $orderSql
        $limitSql";

$stmt = $pdo->prepare($sql);
$stmt->execute(array_merge($args, $limitArgs));
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($format === 'json') {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode([
    'data' => $rows,
    'pagination' => $limit === 0 ? [
      'page'  => $page,
      'per'   => $per,
      'total' => $total,
      'pages' => max(1, (int)ceil($total / $per))
    ] : null
  ]);
  exit;
}

// salida HTML simple (cards)
foreach ($rows as $a) {
  $url = "post.php?slug=" . urlencode($a['slug']) . "&language=" . urlencode($a['language']);
  echo "<article class='article-card'>";
  echo "  <h3><a href='" . h($url) . "'>" . h($a['title']) . "</a></h3>";
  echo "  <p class='meta'>" . h($a['category'] ?? '') . " · " . date('Y-m-d', strtotime($a['created_at'])) . "</p>";
  echo "  <p>" . h($a['summary'] ?? '') . "</p>";
  echo "  <a class='read_more' href='" . h($url) . "'>Leer más</a>";
  echo "</article>";
}

// paginación si aplica
if ($limit === 0 && $total !== null) {
  $pages = max(1, (int)ceil($total / $per));
  echo "<nav class='pagination'>";
  for ($i = 1; $i <= $pages; $i++) {
    $isActive = $i === $page ? " class='active'" : "";
    $qs = http_build_query(array_filter([
      'cat'      => $cat,
      'language' => $lang,
      'page'     => $i,
      'per'      => $per
    ]));
    // Importante: blog.html está en /pages/
    echo "<a{$isActive} href='/pages/blog.html?{$qs}'>{$i}</a>";
  }
  echo "</nav>";
}
