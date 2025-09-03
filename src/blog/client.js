// /src/blog/client.js
import { withLangParams } from '/src/i18n/i18n.js';

const qs = (o={}) => new URLSearchParams(Object.entries(o).filter(([,v])=>v!==''&&v!=null)).toString();

export async function loadLatest({ limit=3 } = {}) {
  const mount = document.getElementById('latest_articles');
  if (!mount) return;
  const res = await fetch(`/get_articles.php?${qs(withLangParams({limit}))}`);
  mount.innerHTML = await res.text();
}

export async function loadFeatured({ limit=6 } = {}) {
  const mount = document.getElementById('featured_articles');
  if (!mount) return;
  const res = await fetch(`/get_articles.php?${qs(withLangParams({featured:1, limit}))}`);
  mount.innerHTML = await res.text();
}

export async function loadList() {
  const mount = document.getElementById('articles');
  if (!mount) return;
  const u = new URL(location.href);
  const params = withLangParams({
    cat: u.searchParams.get('cat') || '',
    q:   u.searchParams.get('q')   || '',
    page:u.searchParams.get('page')|| 1,
    per: u.searchParams.get('per') || 9
  });
  const res = await fetch(`/get_articles.php?${qs(params)}`);
  mount.innerHTML = await res.text();
}

export function initBlogClient() {
  loadLatest(); loadFeatured(); loadList();
  document.addEventListener('language-changed', () => { loadLatest(); loadFeatured(); loadList(); });
  window.addEventListener('popstate', loadList);
}
