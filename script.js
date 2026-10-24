/* =========================================================
   Delicacy / NatureShop – script.js (version finale)
   ========================================================= */

/* ===== Données ===== */
const categories = [
  { n: 'Fruits', c: 22, i: '🍇', bg: '#fff0ec' },
  { n: 'Légumes', c: 32, i: '🥬', bg: '#eaf6e1' },
  { n: 'Boissons', c: 12, i: '🧃', bg: '#fff3e0' },
  { n: 'Noix fraîches', c: 72, i: '🥜', bg: '#eef0fb' },
  { n: 'Épices', c: 25, i: '🌶️', bg: '#f7f4df' }
];

const products = [
    { n: 'Tomates bio de la ferme 250g', cat: 'Légumes', i: '🍅', img: 'fruits/tomate.png', p: '7,99',  off: 25, r: 4.8, k: 124 },
  { n: 'Viande bio de la ferme 1 kg',  cat: 'Viande',  i: '🥩', img: 'viandes/viande.png',  p: '11,00', off: 20, r: 4.6, k: 89 },
  { n: 'Miel pur de la ferme 500g',    cat: 'Boissons', i: '🍯', p: '11,00', off: 20, r: 4.9, k: 210 },
  { n: 'Oranges fraîches bio 500g',    cat: 'Boissons', i: '🍊', p: '11,00', off: 25, r: 4.7, k: 156 },
  { n: 'Carottes bio 500g',            cat: 'Légumes',  i: '🥕', p: '4,50',  off: 15, r: 4.5, k: 73 },
  { n: 'Fraises fraîches 500g',        cat: 'Légumes',img: 'fruits/fraise.png',  i: '🍓', p: '6,90',  off: 20, r: 4.8, k: 142 },
  { n: 'Pastèque bio 1 pièce',         cat: 'Légumes',  i: '🍉', p: '7,99',  off: 10, r: 4.4, k: 58 },
  { n: 'Thé vert bio',                 cat: 'Boissons', i: '🍵', p: '5,40',  off: 20, r: 4.6, k: 97 },
  { n: 'Mélange de noix',              cat: 'Légumes',  i: '🥜', p: '9,20',  off: 15, r: 4.7, k: 81 },
  { n: 'Salade fraîche',               cat: 'Légumes',  i: '🥗', p: '3,80',  off: 20, r: 4.5, k: 64 },
  { n: 'Côtelettes de porc 1 kg',      cat: 'Viande',   i: '🍖', p: '12,50', off: 10, r: 4.3, k: 52 },
  { n: 'Jus de fruits bio',            cat: 'Boissons', i: '🧃', p: '4,90',  off: 20, r: 4.6, k: 110 }
];

const $ = (s, el = document) => el.querySelector(s);

/* ===== Étoile SVG (définie une seule fois, réutilisable partout) ===== */
document.body.insertAdjacentHTML('afterbegin', `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="i-star" viewBox="0 0 24 24">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </symbol>
    <symbol id="i-heart" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </symbol>
  </svg>`);

const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-star"/></svg>';
const stars = r => Array.from({ length: 5 }, (_, i) => {
  const f = Math.max(0, Math.min(1, r - i));            // part remplie de cette étoile
  return `<span class="st">${star}<span style="width:${f * 100}%">${star}</span></span>`;
}).join('');

let cart = 0;

/* ===== Catégories ===== */
$('#cats').innerHTML = categories.map(c =>
  `<div class="cat" style="background:${c.bg}"><div class="ic">${c.i}</div><b>${c.n}</b><small>${c.c} articles</small></div>`
).join('');

/* ===== Carte produit ===== */
const card = p => `
  <article class="card">
    <span class="off">-${p.off}%</span>
    <button type="button" class="fav" aria-label="Ajouter aux favoris" aria-pressed="false">
  <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-heart"/></svg>
</button>
    <div class="pic">${p.img
      ? `<img src="./images/${p.img}" alt="${p.n}" width="600" height="450" loading="lazy" data-emo="${p.i}">`
      : `<span class="emo" aria-hidden="true">${p.i}</span>`}</div>

    <small>${p.cat}</small>
    <h3>${p.n}</h3>

    <div class="rate" role="img" aria-label="Note ${p.r} sur 5, ${p.k} avis">
      <span class="stars" aria-hidden="true">${stars(p.r)}</span>
      <b>${p.r.toFixed(1).replace('.', ',')}</b>
      <span class="cnt">Stock disponible (${p.k})</span>
    </div>

    <div class="price">${p.p} £<small>/kg</small></div>

    <div class="buy">
      <div class="qty" role="group" aria-label="Quantité">
        <button type="button" class="minus" aria-label="Diminuer la quantité" disabled>−</button>
        <output class="q-val" aria-live="polite">1</output>
        <button type="button" class="plus" aria-label="Augmenter la quantité">+</button>
      </div>
      <button type="button" class="add" aria-label="Ajouter ${p.n} au panier">
        <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
        <i class="fa-solid fa-check" aria-hidden="true"></i>
        <span>Ajouter</span>
      </button>
    </div>
  </article>`;

/* ===== Meilleures ventes (carrousel) ===== */
let start = 0;
const renderBest = () => {
  const list = [...products.slice(start), ...products.slice(0, start)].slice(0, 4);
  $('#bestGrid').innerHTML = list.map(card).join('');
};
$('#nextB').onclick = () => { start = (start + 1) % products.length; renderBest(); };
$('#prevB').onclick = () => { start = (start - 1 + products.length) % products.length; renderBest(); };
renderBest();

/* ===== Produits populaires + filtres ===== */
/* ===== Produits populaires + filtres animés ===== */
const popGrid = $('#popGrid'), tabs = $('#tabs');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let popFilter = 'all', popToken = 0;

const renderPop = (f, animate = false) => {
  const list = products.filter(p => f === 'all' || p.cat === f).slice(0, 8);
  popGrid.innerHTML = list.map(card).join('');
  popGrid.querySelectorAll('.card').forEach((c, i) => {
    c.style.setProperty('--i', i);
    if (animate) c.classList.add('enter');
  });
};

/* Pastille qui glisse sous l'onglet actif */
const pill = document.createElement('i');
pill.className = 'tab-pill';
tabs.prepend(pill);
const movePill = (b, instant) => {
  if (instant) pill.style.transition = 'none';
  pill.style.width  = b.offsetWidth + 'px';
  pill.style.height = b.offsetHeight + 'px';
  pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
  if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
};
const activeTab = () => tabs.querySelector('button.active');
movePill(activeTab(), true);
addEventListener('resize', () => movePill(activeTab(), true));
addEventListener('load',   () => movePill(activeTab(), true));

/* Sortie des cartes, puis entrée des nouvelles en cascade */
const swapPop = f => {
  if (f === popFilter) return;
  popFilter = f;
  const t = ++popToken;

  if (reduceMotion) { renderPop(f); return; }

  popGrid.style.minHeight = popGrid.offsetHeight + 'px';   // évite le saut de page
  popGrid.classList.add('leaving');

  setTimeout(() => {
    if (t !== popToken) return;                            // un clic plus récent a pris le relais
    renderPop(f, true);
    popGrid.classList.remove('leaving');
    setTimeout(() => { if (t === popToken) popGrid.style.minHeight = ''; }, 900);
  }, 280);
};

tabs.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  tabs.querySelectorAll('button').forEach(x => {
    x.classList.toggle('active', x === b);
    x.setAttribute('aria-pressed', x === b);
  });
  movePill(b);
  swapPop(b.dataset.f);
});

renderPop('all');

/* ===== Animation : le produit vole vers le panier ===== */
const fly = (from, to, done) => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !from || !to) { done(); return; }

  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const size = 56;
  const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
  const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
  const lift = Math.min(160, Math.abs(dy) * .4 + 60);   // hauteur de l'arc

  const img = from.querySelector('img');
  const ghost = document.createElement('div');
  ghost.className = 'fly';
  ghost.innerHTML = img ? `<img src="${img.src}" alt="">` : from.textContent.trim();
  ghost.style.cssText =
    `left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px`;
  document.body.appendChild(ghost);

  const anim = ghost.animate([
    { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
    { transform: `translate(${dx * .5}px,${dy * .5 - lift}px) scale(.85) rotate(150deg)`, opacity: 1, offset: .5 },
    { transform: `translate(${dx}px,${dy}px) scale(.2) rotate(360deg)`, opacity: .7 }
  ], { duration: 800, easing: 'ease-in-out' });

  anim.onfinish = () => {
    ghost.remove();
    done();
    to.classList.remove('catch');
    void to.offsetWidth;                       // relance l'anneau
    to.classList.add('catch');
    setTimeout(() => to.classList.remove('catch'), 500);
  };
};

/* ===== Quantité, panier, favoris ===== */
const setQty = (c, n) => {
  n = Math.max(1, Math.min(99, n));
  $('.q-val', c).textContent = n;
  $('.minus', c).disabled = n <= 1;
  $('.plus', c).disabled = n >= 99;
};

document.addEventListener('click', e => {
  const c = e.target.closest('.card'); if (!c) return;
  const n = +$('.q-val', c).textContent;

  if (e.target.closest('.plus'))  setQty(c, n + 1);
  if (e.target.closest('.minus')) setQty(c, n - 1);

  const fav = e.target.closest('.fav');
  if (fav) {
    fav.classList.toggle('on');
    fav.setAttribute('aria-pressed', fav.classList.contains('on'));
  }

  const btn = e.target.closest('.add');
  if (btn) {
    setQty(c, 1);

    /* Le compteur monte quand le produit arrive dans le panier */
    fly($('.pic', c), $('.cart'), () => {
      cart += n;
      $('#cartCount').textContent = cart;
    });

    const label = $('span', btn);
    btn.classList.add('done');
    label.textContent = 'Ajouté';
    clearTimeout(btn.t);
    btn.t = setTimeout(() => {
      btn.classList.remove('done');
      label.textContent = 'Ajouter';
    }, 1400);
  }
});

/* Image introuvable : on remet l'emoji à la place */
document.addEventListener('error', e => {
  const im = e.target;
  if (im.tagName !== 'IMG' || !im.closest('.pic')) return;
  const emo = document.createElement('span');
  emo.className = 'emo';
  emo.setAttribute('aria-hidden', 'true');
  emo.textContent = im.dataset.emo || '🛒';
  im.replaceWith(emo);
}, true);


/* ===== Compteurs animés ===== */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  document.querySelectorAll('[data-n]').forEach(el => {
    const max = +el.dataset.n; let v = 0;
    const t = setInterval(() => {
      v = Math.min(max, v + Math.ceil(max / 50));
      el.textContent = v.toLocaleString('fr-FR');
      if (v >= max) clearInterval(t);
    }, 25);
  });
  io.disconnect();
}), { threshold: .4 });
io.observe($('.stats'));

/* ===== Avis clients : mur animé ===== */
const reviews = [
  { n: 'Michelle Smith', c: 'Cotonou',    s: 5, p: 'Tomates bio',   t: 'Des produits vraiment frais, livrés rapidement. Je recommande !' },
  { n: 'David Anderson', c: 'Calavi',     s: 5, p: 'Légumes verts', t: 'Le service client est réactif et les légumes sont excellents.' },
  { n: 'Aïcha Koffi',    c: 'Cotonou',    s: 5, p: 'Panier bio',    t: "J'ai enfin trouvé une boutique bio de confiance près de chez moi." },
  { n: 'Paul Martin',    c: 'Porto-Novo', s: 4, p: 'Miel de ferme', t: "Très bon rapport qualité-prix, et l'application est pratique." },
  { n: 'Sarah Lopez',    c: 'Cotonou',    s: 5, p: 'Fraises',       t: 'Les fruits sont délicieux, emballage soigné.' },
  { n: 'Jean Dupont',    c: 'Abomey-Calavi', s: 5, p: 'Légumes de saison', t: 'Livraison gratuite et produits de saison : parfait.' },
  { n: 'Fatou Diallo',   c: 'Cotonou',    s: 5, p: 'Épices',        t: 'Les épices sentent bon et le goût est incomparable.' },
  { n: 'Koffi Mensah',   c: 'Ouidah',     s: 4, p: 'Oranges',       t: 'Des oranges très juteuses. Livré à l’heure, rien à redire.' },
  { n: 'Inès Adjovi',    c: 'Cotonou',    s: 5, p: 'Salade',        t: 'Je commande chaque semaine, tout arrive toujours bien frais.' },
  { n: 'Marc Tossou',    c: 'Parakou',    s: 5, p: 'Noix fraîches', t: 'Qualité constante et prix honnêtes. Mes enfants adorent.' }
];

const rvSec = $('#avis');
if (rvSec) {
  const hues = ['#6cb33f', '#f47a20', '#2c3e50', '#8bc34a', '#e0620f', '#4f9a28'];
  const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const stars = s => '★'.repeat(s) + `<span class="off">${'★'.repeat(5 - s)}</span>`;

  const card = (r, i) => `
    <article class="rv-card">
      <div class="rv-top">
        <span class="rv-av" style="background:${hues[i % hues.length]}">${initials(r.n)}</span>
        <div><b>${r.n}</b><small>${r.c}</small></div>
        <i class="rv-q fa-solid fa-quote-right" aria-hidden="true"></i>
      </div>
      <div class="rv-st" role="img" aria-label="${r.s} sur 5">${stars(r.s)}</div>
      <p>${r.t}</p>
      <div class="rv-foot">
        <span><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Achat vérifié</span>
        <small>${r.p}</small>
      </div>
    </article>`;

  /* Chaque rangée : un groupe + son clone, pour une boucle sans saut */
  const fill = (el, list, offset) => {
    const one  = list.map((r, i) => card(r, i + offset)).join('');
    const reps = Math.max(1, Math.ceil(1800 / (list.length * 316)));
    const grp  = one.repeat(reps);
    el.innerHTML = `<div class="rv-track">
      <div class="rv-grp">${grp}</div>
      <div class="rv-grp rv-clone" aria-hidden="true">${grp}</div>
    </div>`;
  };
  fill($('#rvA'), reviews.filter((_, i) => i % 2 === 0), 0);
  fill($('#rvB'), reviews.filter((_, i) => i % 2 === 1), 3);

  /* Les barres de répartition se remplissent à l'apparition */
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { rvSec.classList.add('in'); obs.disconnect(); }
  }, { threshold: .3 }).observe(rvSec);
}

/* =========================================================
   HEADER
   ========================================================= */
const header = $('#header'), burger = $('#burger'), menu = $('#menu');
const accountBtn = $('#accountBtn'), dropdown = $('#dropdown');

/* Menu mobile */
const setMenu = open => {
  menu.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* Menu du compte */
const setAccount = open => {
  dropdown.hidden = !open;
  accountBtn.setAttribute('aria-expanded', open);
};
accountBtn.addEventListener('click', e => { e.stopPropagation(); setAccount(dropdown.hidden); });
document.addEventListener('click', e => { if (!e.target.closest('.account')) setAccount(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { setAccount(false); setMenu(false); accountBtn.focus(); }
});

/* Ombre au défilement + lien actif selon la section visible */
const links = [...menu.querySelectorAll('a')];
const home = links.find(a => !a.hash);
const spy = links.filter(a => a.hash)
  .map(a => ({ a, el: document.querySelector(a.hash) }))
  .filter(x => x.el);

const onScroll = () => {
  header.classList.toggle('scrolled', scrollY > 10);
  let cur = home, best = -Infinity;
  spy.forEach(({ a, el }) => {
    const top = el.getBoundingClientRect().top;
    if (top <= 140 && top > best) { best = top; cur = a; }
  });
  links.forEach(a => a.classList.toggle('active', a === cur));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Animation du badge panier + libellé accessible */
const cartCount = $('#cartCount');
new MutationObserver(() => {
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
  cartCount.parentElement.setAttribute('aria-label', `Panier, ${cartCount.textContent} article(s)`);
}).observe(cartCount, { childList: true, characterData: true, subtree: true });

(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  document.documentElement.classList.add('js');

  /* 1. Découpe le titre mot par mot pour l'effet de montée */
  const title = hero.querySelector('[data-split]');
  title.setAttribute('aria-label', title.textContent);
  title.innerHTML = title.textContent.trim().split(/\s+/)
    .map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`)
    .join(' ');

  /* 2. Lance la séquence d'entrée (au prochain affichage de la page) */
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('in')));

  /* 3. Compteurs de la preuve sociale, une fois le hero révélé */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  hero.querySelectorAll('[data-count]').forEach(el => {
    const max = +el.dataset.count;
    if (reduce) { el.textContent = max.toLocaleString('fr-FR'); return; }
    const t0 = performance.now() + 700, dur = 1400;
    const tick = now => {
      const k = Math.min(1, Math.max(0, (now - t0) / dur));
      el.textContent = Math.round(max * (1 - Math.pow(1 - k, 3))).toLocaleString('fr-FR');
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* 4. Parallaxe douce des fruits selon la souris (écrans avec pointeur précis) */
  const visual = hero.querySelector('.hx-visual');
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      visual.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5) * 2);
      visual.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5) * 2);
    });
    hero.addEventListener('mouseleave', () => {
      visual.style.setProperty('--mx', 0);
      visual.style.setProperty('--my', 0);
    });
  }
})();
/* ===== Newsletter ===== */
$('#news').onsubmit = e => {
  e.preventDefault();
  const msg = $('#newsMsg');
  msg.textContent = 'Merci ! Vous êtes inscrit(e).';
  $('#email').value = '';
  clearTimeout(msg.t);
  msg.t = setTimeout(() => msg.textContent = '', 5000);
};

/* ===== Actualités : magazine animé ===== */
const TOTAL_NEWS = 24;   // nombre réel d'articles sur la page blog

const news = [
  { t: "Ce qu'il faut savoir sur la détox",     img: 'detoxe.png', d: '2026-10-20', cat: 'Bien-être', min: 4, slug: 'detox',
    ex: "Jus, fibres, hydratation : on démêle le vrai du faux pour une détox simple et sans excès." },
  { t: 'Pizza au poulet, tomates et basilic',   img: 'pizza.png',  d: '2026-10-14', cat: 'Recette',   min: 6, slug: 'pizza-poulet',
    ex: "Une pâte fine, des tomates mûries au soleil et du basilic frais : prête en 30 minutes." },
  { t: '5 raisons de manger des légumes verts', img: 'legume.png', d: '2026-10-08', cat: 'Nutrition', min: 3, slug: 'legumes-verts',
    ex: "Fer, fibres, vitamines : pourquoi les légumes verts méritent une place à chaque repas." },
  { t: 'Conserver ses fruits plus longtemps',   img: 'detoxe.png', d: '2026-10-01', cat: 'Astuces',   min: 5, slug: 'conservation-fruits',
    ex: "Au frais, à l'air libre ou à l'abri de la lumière : les bons gestes selon chaque fruit." },
  { t: 'Les épices bio à avoir en cuisine',     img: 'pizza.png',  d: '2026-09-24', cat: 'Cuisine',   min: 4, slug: 'epices-bio',
    ex: "Curcuma, cumin, piment : notre sélection pour relever vos plats toute l'année." },
  { t: 'Bien choisir ses légumes de saison',    img: 'legume.png', d: '2026-09-17', cat: 'Saison',    min: 5, slug: 'legumes-saison',
    ex: "Moins chers, plus savoureux, plus locaux : le calendrier des légumes du moment." }
];

const nx = $('#nx'), stage = $('#nxStage'), list = $('#nxList');   // list = le <ul>
const pad = n => String(n).padStart(2, '0');
const fmt = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const cnt = $('#newsCount');
if (cnt) cnt.textContent = `${news.length} sur ${TOTAL_NEWS}`;

stage.innerHTML = news.map(n => `
  <article class="nx-slide">
    <img src="./images/${n.img}" alt="">
    <div class="nx-body">
      <span class="nx-cat">${n.cat}</span>
      <h3>${n.t}</h3>
      <p>${n.ex}</p>
      <a class="nx-link" href="blog.html#${n.slug}">Lire l'article <i aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg></i></a>
    </div>
  </article>`).join('') +
  `<div class="nx-num"><b id="nxCur">01</b>/${pad(news.length)} à la une</div>`;

list.innerHTML = news.map((n, i) => `
  <li><button class="nx-item" data-i="${i}">
    <img src="./images/${n.img}" alt="" loading="lazy">
    <span><b>${n.t}</b><small>${fmt(n.d)} · ${n.min} min</small></span>
    <i class="bar"></i>
  </button></li>`).join('');

const slides = [...stage.querySelectorAll('.nx-slide')];
const items  = [...list.querySelectorAll('.nx-item')];
let cur = 0;

const go = i => {
  cur = (i + news.length) % news.length;
  slides.forEach((s, k) => s.classList.toggle('on', k === cur));
  items.forEach((b, k) => {
    b.classList.toggle('on', k === cur);
    k === cur ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current');
  });
  $('#nxCur').textContent = pad(cur + 1);

  /* Fait défiler la liste (et seulement elle) jusqu'à l'article actif */
  const li = items[cur].parentElement;
  const b = list.getBoundingClientRect(), r = li.getBoundingClientRect();
  list.scrollTo({
    top:  list.scrollTop  + (r.top  - b.top)  - 6,
    left: list.scrollLeft + (r.left - b.left) - 6,
    behavior: 'smooth'
  });
};

/* Passe au suivant quand la barre de progression est terminée */
list.addEventListener('animationend', e => {
  if (e.target.classList.contains('bar')) go(cur + 1);
});
list.addEventListener('click', e => {
  const b = e.target.closest('.nx-item');
  if (b && +b.dataset.i !== cur) go(+b.dataset.i);
});

nx.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
});

/* Pause : souris dessus, focus clavier, ou hors de l'écran */
let hov = false, foc = false, vis = false;
const sync = () => nx.classList.toggle('paused', hov || foc || !vis);

nx.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hov = true; sync(); } });
nx.addEventListener('pointerleave', e => {
  if (e.pointerType !== 'mouse') return;
  hov = false; sync();
  stage.querySelectorAll('.nx-body').forEach(b => {
    b.style.setProperty('--px', 0);
    b.style.setProperty('--py', 0);
  });
});
nx.addEventListener('focusin',  e => { foc = e.target.matches(':focus-visible'); sync(); });
nx.addEventListener('focusout', () => { foc = false; sync(); });

new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }, { threshold: .35 }).observe(nx);

/* Léger effet de profondeur à la souris */
stage.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  const r = stage.getBoundingClientRect();
  stage.querySelectorAll('.nx-body').forEach(b => {
    b.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * 2);
    b.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * 2);
  });
});

go(0);

/* ===== Application mobile : entrée au défilement ===== */
const appSec = $('#app');
if (appSec) {
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { appSec.classList.add('in'); obs.disconnect(); }
  }, { threshold: .25 }).observe(appSec);
}