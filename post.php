<?php
require_once __DIR__ . '/src/backend/db.php';

/* ===== Helpers ===== */
function h($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function param($k,$d=null){ return isset($_GET[$k]) ? trim($_GET[$k]) : $d; }

/* ===== Parámetros ===== */
$slug = param('slug');
$lang = param('language','es'); // idioma por defecto

if (!$slug) {
  http_response_code(404);
  echo "Artículo no encontrado.";
  exit;
}

/* ===== Cargar artículo principal ===== */
$stmt = $pdo->prepare("SELECT * FROM articles WHERE slug = ? AND language = ? AND status='published' LIMIT 1");
$stmt->execute([$slug, $lang]);
$article = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$article) {
  http_response_code(404);
  echo "Artículo no encontrado.";
  exit;
}

/* ===== Versiones alternas (para hreflang y switch de idioma) ===== */
$alternates = [];
if (!empty($article['translation_group_id'])) {
  $stmtAlt = $pdo->prepare("SELECT slug, language
                            FROM articles
                            WHERE translation_group_id = ?
                              AND status='published'
                              AND id <> ?");
  $stmtAlt->execute([$article['translation_group_id'], $article['id']]);
  $alternates = $stmtAlt->fetchAll(PDO::FETCH_ASSOC);
}

/* ===== Canonical / hreflang (detecta dominio y esquema) ===== */
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
$base   = $scheme . '://' . $host;

$currLang = $article['language'] ?: 'es';
$canonical = $base . "/post.php?slug=" . urlencode($article['slug']) . "&language=" . urlencode($currLang);

/* ===== Metadatos ===== */
$title = $article['title'] ?? '';
$desc  = $article['summary'] ?: mb_substr(trim(strip_tags($article['content'] ?? '')), 0, 160);

/* ===== Render del contenido (HTML o texto) ===== */
$contentRaw = $article['content'] ?? '';
$hasHtml = ($contentRaw !== strip_tags($contentRaw)); // si contiene etiquetas
$contentHtml = $hasHtml ? $contentRaw : nl2br(h($contentRaw));
?>
<!DOCTYPE html>
<html lang="<?=h($currLang)?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title><?=h($title)?></title>
  <meta name="description" content="<?=h($desc)?>">

  <!-- Canonical -->
  <link rel="canonical" href="<?=h($canonical)?>">

  <!-- hreflang alternates -->
  <?php foreach ($alternates as $alt): 
    $href = $base . "/post.php?slug=" . urlencode($alt['slug']) . "&language=" . urlencode($alt['language']); ?>
    <link rel="alternate" hreflang="<?=h($alt['language'])?>" href="<?=h($href)?>">
  <?php endforeach; ?>
  <link rel="alternate" hreflang="x-default" href="<?=h($canonical)?>">

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="<?=h($title)?>">
  <meta property="og:description" content="<?=h($desc)?>">
  <meta property="og:url" content="<?=h($canonical)?>">
  <?php /* Si tienes imagen de portada, añade:
  <meta property="og:image" content="<?=h($base)?>/public/portadas/<?=h($article['cover_image'])?>">
  <meta name="twitter:card" content="summary_large_image"> */ ?>

  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 820px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    h1 { margin: 0 0 .75rem 0; line-height: 1.25; }
    .meta { color: #666; margin-bottom: 1rem; font-size: .95rem; }
    .content :is(h2,h3,h4){ margin-top: 1.4rem; }
    .content img { max-width: 100%; height: auto; }
    .lang_switch { margin-top: 2rem; font-size: .95rem; }
    .lang_switch a { margin-left: .5rem; }
  </style>
</head>
<body>
  <article>
    <header>
      <h1><?=h($title)?></h1>
      <p class="meta">
        <?= $article['category'] ? 'Categoría: ' . h($article['category']) . ' · ' : '' ?>
        Publicado: <?= date('Y-m-d', strtotime($article['created_at'])) ?>
      </p>
    </header>

    <section class="content">
      <?= $contentHtml /* imprimimos HTML si lo guardaste en HTML, o texto escapado si no */ ?>
    </section>
  </article>

  <?php if (!empty($alternates)): ?>
    <nav class="lang_switch" aria-label="Cambiar idioma del artículo">
      <span>Disponible también en:</span>
      <?php foreach ($alternates as $alt):
        $href = "/post.php?slug=" . urlencode($alt['slug']) . "&language=" . urlencode($alt['language']); ?>
        <a href="<?=h($href)?>"><?=strtoupper(h($alt['language']))?></a>
      <?php endforeach; ?>
    </nav>
  <?php endif; ?>
</body>
</html>
