<?php
// /admin/edit.php
session_start();

// TODO: ajusta tu protección real de sesión:
if (empty($_SESSION['user_id'])) {
  // Puedes redirigir a /admin/login.php si ya lo tienes
  // header('Location: /admin/login.php'); exit;
}

// DB
require_once __DIR__ . '/../src/backend/db.php';

// Utilidades
function h($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function param($key,$default=null){
  return isset($_POST[$key]) ? trim($_POST[$key]) : (isset($_GET[$key]) ? trim($_GET[$key]) : $default);
}

/** Claves de categorías (técnicas) → labels de referencia para el admin */
$CATEGORIES = [
  'web-dev'                  => 'Web Development & Technology',
  'ux-ui'                    => 'UX/UI & Digital Strategy',
  'business'                 => 'Online Business & Marketing',
  'ecommerce'                => 'Ecommerce',
  'digital-reputation'       => 'Digital Reputation & Strategies',
  'inspiration-tech-culture' => 'Inspiration & Tech Culture',
];

/** Idiomas soportados */
$LANGS = ['es' => 'Español', 'en' => 'English'];

/** Estados */
$STATUSES = ['draft' => 'Borrador', 'published' => 'Publicado'];

// Cargar artículo si viene id
$id = (int) ( $_GET['id'] ?? 0 );
$article = null;

if ($id) {
  $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
  $stmt->execute([$id]);
  $article = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$article) {
    http_response_code(404);
    echo "Artículo no encontrado";
    exit;
  }
}

// Guardar (crear/editar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  // CSRF mínimo opcional
  // if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { die('CSRF token incorrecto'); }

  $title   = param('title','');
  $slug    = param('slug','');
  $summary = param('summary','');
  $content = $_POST['content'] ?? ''; // permite HTML (sanear si usas editor WYSIWYG)
  $category= param('category','');
  $language= param('language','es');
  $status  = param('status','draft');
  $featured= isset($_POST['featured']) ? 1 : 0;
  $featured_order = strlen(param('featured_order','')) ? (int)param('featured_order',0) : null;
  $translation_group_id = strlen(param('translation_group_id','')) ? (int)param('translation_group_id',0) : null;

  // Validaciones básicas
  $errors = [];
  if ($title === '')    $errors[] = 'El título es obligatorio.';
  if ($language === '') $errors[] = 'El idioma es obligatorio.';
  if ($category === '') $errors[] = 'La categoría es obligatoria.';
  if (!isset($STATUSES[$status])) $errors[] = 'Estado inválido.';
  if (!isset($LANGS[$language]))  $errors[] = 'Idioma inválido.';
  if (!isset($CATEGORIES[$category])) $errors[] = 'Categoría inválida.';

  // Generar slug si no se envía
  if ($slug === '' && $title !== '') {
    $base = iconv('UTF-8','ASCII//TRANSLIT', $title);
    $base = strtolower(preg_replace('/[^a-z0-9]+/','-', $base));
    $base = trim($base, '-');
    $slug = $base ?: ('articulo-'.time());
  }

  // Comprobar unicidad slug+language
  $stmtChk = $pdo->prepare("SELECT id FROM articles WHERE slug = ? AND language = ? " . ($id ? "AND id <> ?" : "") . " LIMIT 1");
  $chkArgs = $id ? [$slug, $language, $id] : [$slug, $language];
  $stmtChk->execute($chkArgs);
  $exists = $stmtChk->fetch();

  if ($exists) $errors[] = 'Ya existe un artículo con ese slug en ese idioma.';

  if (empty($errors)) {
    if ($id) {
      // UPDATE
      $sql = "UPDATE articles
              SET title=?, slug=?, summary=?, content=?, category=?, language=?, status=?, featured=?, featured_order=?, translation_group_id=?, updated_at=NOW()
              WHERE id=?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        $title, $slug, $summary, $content, $category, $language, $status,
        $featured, $featured_order, $translation_group_id, $id
      ]);
      header('Location: /admin/edit.php?id='.$id.'&ok=1'); exit;
    } else {
      // INSERT
      $sql = "INSERT INTO articles (title, slug, summary, content, status, category, language, featured, featured_order, translation_group_id, created_at)
              VALUES (?,?,?,?,?,?,?,?,?,?, NOW())";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        $title, $slug, $summary, $content, $status, $category, $language,
        $featured, $featured_order, $translation_group_id
      ]);
      $newId = (int)$pdo->lastInsertId();

      // Si no asignaste translation_group_id y quieres agrupar automáticamente
      if (!$translation_group_id) {
        $tg = $newId; // agrupar por sí mismo; podrás usar este ID para su traducción hermana
        $pdo->prepare("UPDATE articles SET translation_group_id=? WHERE id=?")->execute([$tg, $newId]);
      }

      header('Location: /admin/edit.php?id='.$newId.'&ok=1'); exit;
    }
  }
}

// (Opcional) token CSRF simple
// $_SESSION['csrf'] = bin2hex(random_bytes(16));

$isEdit = (bool)$article;
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title><?= $isEdit ? 'Editar artículo' : 'Nuevo artículo' ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 1rem; color: #1a1a1a; }
    h1 { margin-bottom: 0.5rem; }
    .ok { background: #e6ffed; border: 1px solid #b7f5c8; padding: 0.6rem 0.8rem; margin: 1rem 0; }
    .errors { background: #ffecec; border: 1px solid #f5b7b7; padding: 0.6rem 0.8rem; margin: 1rem 0; }
    label { display:block; margin-top: 1rem; font-weight: 600; }
    input[type="text"], input[type="number"], textarea, select {
      width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 8px; font: inherit;
    }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .actions { margin-top: 1.25rem; display: flex; gap: 0.75rem; }
    .btn { background:#111; color:#fff; border: none; padding: 0.65rem 1rem; border-radius: 8px; cursor: pointer; }
    .btn.secondary { background:#e9e9e9; color:#111; }
    .help { color:#666; font-size:0.9rem; }
    .inline { display:flex; gap: 0.75rem; align-items:center; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <h1><?= $isEdit ? 'Editar artículo' : 'Nuevo artículo' ?></h1>

  <?php if (isset($_GET['ok'])): ?>
    <div class="ok">Guardado correctamente.</div>
  <?php endif; ?>

  <?php if (!empty($errors)): ?>
    <div class="errors">
      <strong>Revisa:</strong>
      <ul>
        <?php foreach ($errors as $err): ?>
          <li><?=h($err)?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>

  <form method="post">
    <!-- <input type="hidden" name="csrf" value="<?//=h($_SESSION['csrf'])?>"> -->

    <label for="title">Título</label>
    <input type="text" id="title" name="title" required
           value="<?=h($article['title'] ?? '')?>">

    <div class="row">
      <div>
        <label for="slug">Slug <span class="help">(si lo dejas vacío se genera automáticamente)</span></label>
        <input type="text" id="slug" name="slug" value="<?=h($article['slug'] ?? '')?>">
      </div>
      <div>
        <label for="language">Idioma</label>
        <select id="language" name="language" required>
          <?php
          $currLang = $article['language'] ?? 'es';
          foreach ($LANGS as $k=>$v):
          ?>
            <option value="<?=$k?>" <?=$currLang===$k?'selected':''?>><?=h($v)?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>

    <div class="row">
      <div>
        <label for="category">Categoría</label>
        <select id="category" name="category" required>
          <?php
          $currCat = $article['category'] ?? '';
          foreach ($CATEGORIES as $k=>$v):
          ?>
            <option value="<?=$k?>" <?=$currCat===$k?'selected':''?>><?=h($v)?> (<?=$k?>)</option>
          <?php endforeach; ?>
        </select>
        <div class="help">La clave técnica (entre paréntesis) se usa para filtrar: ?cat=clave</div>
      </div>
      <div>
        <label for="status">Estado</label>
        <select id="status" name="status">
          <?php
          $currSt = $article['status'] ?? 'draft';
          foreach ($STATUSES as $k=>$v):
          ?>
            <option value="<?=$k?>" <?=$currSt===$k?'selected':''?>><?=h($v)?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>

    <label for="summary">Resumen</label>
    <textarea id="summary" name="summary" rows="3"><?=h($article['summary'] ?? '')?></textarea>

    <label for="content">Contenido (HTML permitido)</label>
    <textarea id="content" name="content" rows="14"><?=h($article['content'] ?? '')?></textarea>

    <div class="row">
      <div>
        <label class="inline">
          <input type="checkbox" name="featured" <?=!empty($article['featured'])?'checked':''?>> Artículo destacado
        </label>
      </div>
      <div>
        <label for="featured_order">Orden destacado <span class="help">(número entero; menor = sale antes)</span></label>
        <input type="number" id="featured_order" name="featured_order"
               value="<?=h($article['featured_order'] ?? '')?>">
      </div>
    </div>

    <label for="translation_group_id">Grupo de traducción <span class="help">(mismo valor para versiones ES/EN del mismo artículo)</span></label>
    <input type="number" id="translation_group_id" name="translation_group_id"
           value="<?=h($article['translation_group_id'] ?? '')?>">

    <div class="actions">
      <button class="btn" type="submit">Guardar</button>
      <?php if ($isEdit): ?>
        <a class="btn secondary" href="/post.php?slug=<?=urlencode($article['slug'])?>&language=<?=urlencode($article['language'])?>" target="_blank" rel="noopener">Ver artículo</a>
      <?php endif; ?>
    </div>
  </form>
</body>
</html>
