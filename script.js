/* =========================================================
   Delicacy / NatureShop – script.js
   Sommaire : 1 Utilitaires · 2 Données · 3 Rayons · 4 Produits
              5 Panier & favoris · 6 Avis · 7 Header · 8 Hero
              9 Newsletter · 10 Actualités · 11 Sections animées
   ========================================================= */

/* ===== 1. Utilitaires ===== */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const REDUCE_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER  = matchMedia('(pointer: fine)').matches;

const pad = n => String(n).padStart(2, '0');
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const setVars = (el, vars) => Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));

/* Ajoute la classe `in` une seule fois, quand la section devient visible */
const revealOnce = (el, threshold = .3) => {
  if (!el) return;
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { el.classList.add('in'); obs.disconnect(); }
  }, { threshold }).observe(el);
};

/* Relance une animation CSS sur un élément */
const retrigger = (el, cls, ms) => {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  if (ms) setTimeout(() => el.classList.remove(cls), ms);
};

/* Icônes SVG réutilisables */
document.body.insertAdjacentHTML('afterbegin', `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol>
  </svg>`);

/* ===== 2. Données ===== */
const CUR = '€';   // 'FCFA' → prix sans décimales

const categories = [
  { n: 'Fruits',   c: 22, i: '🍇', img: 'rayons/rayon-fruits.png',    bg: '#fff0ec' },
  { n: 'Légumes',  c: 32, i: '🥬', img: 'rayons/rayon-legumes.png',   bg: '#eaf6e1' },
  { n: 'Viande',   c: 14, i: '🥩', img: 'rayons/rayon-viandes.png',   bg: '#fdeceb' },
  { n: 'Boissons', c: 12, i: '🧃', img: 'rayons/rayon-jus.png',       bg: '#fff3e0' },
  { n: 'Épicerie', c: 72, i: '🍯', img: 'rayons/rayon-epiceries.png', bg: '#f7f4df' }
];

const products = [
  { n: 'Tomates bio de la ferme', u: '250 g', cat: 'Légumes',  i: '🍅', img: 'fruits/tomate.png',        p: '7,99',  off: 25, r: 4.8, k: 124 },
  { n: 'Viande bio de la ferme',  u: '1 kg',  cat: 'Viande',   i: '🥩', img: 'viandes/viande.png',       p: '11,00', off: 20, r: 4.6, k: 89 },
  { n: 'Miel pur de la ferme',    u: '500 g', cat: 'Épicerie', i: '🍯', img: 'fruits/miel.png',          p: '11,00', off: 20, r: 4.9, k: 210 },
  { n: 'Oranges fraîches bio',    u: '500 g', cat: 'Fruits',   i: '🍊', img: 'fruits/orange.png',        p: '11,00', off: 25, r: 4.7, k: 156 },
  { n: 'Carottes bio',            u: '500 g', cat: 'Légumes',  i: '🥕', img: 'fruits/carotte.png',       p: '4,50',  off: 15, r: 4.5, k: 73 },
  { n: 'Fraises fraîches',        u: '500 g', cat: 'Fruits',   i: '🍓', img: 'fruits/fraise.png',        p: '6,90',  off: 20, r: 4.8, k: 142 },
  { n: 'Pastèque bio',            u: 'pièce', cat: 'Fruits',   i: '🍉', img: 'fruits/pasteque.png',      p: '7,99',  off: 10, r: 4.4, k: 58 },
  { n: 'Thé vert bio',            u: '100 g', cat: 'Boissons', i: '🍵', img: 'fruits/the-vert.png',      p: '5,40',  off: 20, r: 4.6, k: 97 },
  { n: 'Mélange de noix',         u: '250 g', cat: 'Épicerie', i: '🥜', img: 'noix/noix.png',            p: '9,20',  off: 15, r: 4.7, k: 81 },
  { n: 'Salade fraîche',          u: 'pièce', cat: 'Légumes',  i: '🥗', img: 'legumes/salade.png',       p: '3,80',  off: 20, r: 4.5, k: 64 },
  { n: 'Côtelettes de porc',      u: '1 kg',  cat: 'Viande',   i: '🍖', img: 'viandes/cotelet-porc.png', p: '12,50', off: 10, r: 4.3, k: 52 },
  { n: 'Jus de fruits bio',       u: '1 L',   cat: 'Boissons', i: '🧃', img: 'fruits/jus.png',           p: '4,90',  off: 20, r: 4.6, k: 110 }
];

const reviews = [
  { n: 'Michelle Smith', c: 'Cotonou',       s: 5, p: 'Tomates bio',       t: 'Des produits vraiment frais, livrés rapidement. Je recommande !' },
  { n: 'David Anderson', c: 'Calavi',        s: 5, p: 'Légumes verts',     t: 'Le service client est réactif et les légumes sont excellents.' },
  { n: 'Aïcha Koffi',    c: 'Cotonou',       s: 5, p: 'Panier bio',        t: "J'ai enfin trouvé une boutique bio de confiance près de chez moi." },
  { n: 'Paul Martin',    c: 'Porto-Novo',    s: 4, p: 'Miel de ferme',     t: "Très bon rapport qualité-prix, et l'application est pratique." },
  { n: 'Sarah Lopez',    c: 'Cotonou',       s: 5, p: 'Fraises',           t: 'Les fruits sont délicieux, emballage soigné.' },
  { n: 'Jean Dupont',    c: 'Abomey-Calavi', s: 5, p: 'Légumes de saison', t: 'Livraison gratuite et produits de saison : parfait.' },
  { n: 'Fatou Diallo',   c: 'Cotonou',       s: 5, p: 'Épices',            t: 'Les épices sentent bon et le goût est incomparable.' },
  { n: 'Koffi Mensah',   c: 'Ouidah',        s: 4, p: 'Oranges',           t: 'Des oranges très juteuses. Livré à l’heure, rien à redire.' },
  { n: 'Inès Adjovi',    c: 'Cotonou',       s: 5, p: 'Salade',            t: 'Je commande chaque semaine, tout arrive toujours bien frais.' },
  { n: 'Marc Tossou',    c: 'Parakou',       s: 5, p: 'Noix fraîches',     t: 'Qualité constante et prix honnêtes. Mes enfants adorent.' }
];

const TOTAL_NEWS = 24;
const news = [
  { t: "Ce qu'il faut savoir sur la détox",     img: 'detoxe.png', d: '2026-10-20', cat: 'Bien-être', min: 4, slug: 'detox',
    ex: 'Jus, fibres, hydratation : on démêle le vrai du faux pour une détox simple et sans excès.' },
  { t: 'Pizza au poulet, tomates et basilic',   img: 'pizza.png',  d: '2026-10-14', cat: 'Recette',   min: 6, slug: 'pizza-poulet',
    ex: 'Une pâte fine, des tomates mûries au soleil et du basilic frais : prête en 30 minutes.' },
  { t: '5 raisons de manger des légumes verts', img: 'legume.png', d: '2026-10-08', cat: 'Nutrition', min: 3, slug: 'legumes-verts',
    ex: 'Fer, fibres, vitamines : pourquoi les légumes verts méritent une place à chaque repas.' },
  { t: 'Conserver ses fruits plus longtemps',   img: 'detoxe.png', d: '2026-10-01', cat: 'Astuces',   min: 5, slug: 'conservation-fruits',
    ex: "Au frais, à l'air libre ou à l'abri de la lumière : les bons gestes selon chaque fruit." },
  { t: 'Les épices bio à avoir en cuisine',     img: 'pizza.png',  d: '2026-09-24', cat: 'Cuisine',   min: 4, slug: 'epices-bio',
    ex: "Curcuma, cumin, piment : notre sélection pour relever vos plats toute l'année." },
  { t: 'Bien choisir ses légumes de saison',    img: 'legume.png', d: '2026-09-17', cat: 'Saison',    min: 5, slug: 'legumes-saison',
    ex: 'Moins chers, plus savoureux, plus locaux : le calendrier des légumes du moment.' }
];

/* ===== 3. Rayons (accordéon) ===== */
const imgOrEmoji = (src, emoji, cls, extra = '') =>
  src ? `<img class="${cls}" src="./images/${src}" alt="" ${extra}>`
      : `<span class="${cls}" aria-hidden="true">${emoji}</span>`;

const renderCategories = () => {
  const root = $('#cats');
  root.innerHTML = categories.map(c => {
    const sample = products.filter(p => p.cat === c.n).slice(0, 3).map(p => p.n).join(', ');
    return `
    <a href="#popular" class="cat" data-f="${c.n}" style="--bg:${c.bg}">
      <span class="cat-n" aria-hidden="true">${c.c}</span>
      ${imgOrEmoji(c.img, c.i, 'ic', 'width="200" height="200" loading="lazy"')}
      <b class="cat-name">${c.n}</b>
      <span class="cat-more"><span>
        <span class="cat-count">${c.c} articles</span>
        <span class="cat-ex">${sample}</span>
        <span class="cat-go">Voir les produits</span>
      </span></span>
    </a>`;
  }).join('');

  const els = $$('.cat', root);
  const open = el => els.forEach(x => x.classList.toggle('on', x === el));
  els.forEach(el => {
    el.addEventListener('pointerenter', () => open(el));
    el.addEventListener('focus', () => open(el));
  });
  open(els[0]);
};

/* ===== 4. Produits ===== */
const num   = s => parseFloat(String(s).replace(',', '.'));
const money = n => n.toLocaleString('fr-FR', {
  minimumFractionDigits: CUR === 'FCFA' ? 0 : 2,
  maximumFractionDigits: CUR === 'FCFA' ? 0 : 2
}) + '\u00a0' + CUR;
const tint  = cat => (categories.find(c => c.n === cat) || {}).bg || '#f4f4f0';

const productCard = p => {
  const now = num(p.p);
  const was = now / (1 - p.off / 100);
  return `
  <article class="card">
    <div class="media" style="--tint:${tint(p.cat)}">
      <span class="off">−${p.off}&nbsp;%</span>
      <button type="button" class="fav" aria-label="Ajouter ${p.n} aux favoris" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-heart"/></svg>
      </button>
      <div class="pic">${p.img
        ? `<img src="./images/${p.img}" alt="${p.n}" loading="lazy" data-emo="${p.i}">`
        : `<span class="emo" aria-hidden="true">${p.i}</span>`}</div>
    </div>
    <div class="info">
      <p class="tag">${p.cat}</p>
      <h3>${p.n}</h3>
      <p class="unit">${p.u || ''}</p>
      <div class="rate" role="img" aria-label="Note ${p.r} sur 5, ${p.k} avis">
        <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-star"/></svg>
        <b>${p.r.toFixed(1).replace('.', ',')}</b><span>(${p.k} avis)</span>
      </div>
      <div class="price"><b>${money(now)}</b><s aria-label="Ancien prix">${money(was)}</s></div>
    </div>
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
};

const initProducts = () => {
  const grid = $('#popGrid'), tabs = $('#tabs');
  let current = 'best', token = 0;

  const render = (f, animate = false) => {
    const list = (f === 'best'
      ? [...products].sort((a, b) => b.k - a.k)
      : products.filter(p => p.cat === f)).slice(0, 8);
    grid.innerHTML = list.map(productCard).join('');
    $$('.card', grid).forEach((c, i) => {
      c.style.setProperty('--i', i);
      if (animate) c.classList.add('enter');
    });
  };

  /* Pastille glissante sous l'onglet actif */
  const pill = Object.assign(document.createElement('i'), { className: 'tab-pill' });
  tabs.prepend(pill);
  const active = () => $('button.active', tabs);
  const movePill = (b, instant) => {
    if (instant) pill.style.transition = 'none';
    pill.style.width  = b.offsetWidth + 'px';
    pill.style.height = b.offsetHeight + 'px';
    pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
    if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
  };
  const syncPill = () => movePill(active(), true);
  syncPill();
  addEventListener('resize', syncPill);
  addEventListener('load', syncPill);

  /* Sortie des cartes puis entrée en cascade */
  const swap = f => {
    if (f === current) return;
    current = f;
    const t = ++token;
    if (REDUCE_MOTION) return render(f);

    grid.style.minHeight = grid.offsetHeight + 'px';
    grid.classList.add('leaving');
    setTimeout(() => {
      if (t !== token) return;
      render(f, true);
      grid.classList.remove('leaving');
      setTimeout(() => { if (t === token) grid.style.minHeight = ''; }, 900);
    }, 280);
  };

  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', tabs).forEach(x => {
      x.classList.toggle('active', x === b);
      x.setAttribute('aria-pressed', x === b);
    });
    movePill(b);
    b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); // onglets scrollables en mobile
    swap(b.dataset.f);
  });

  /* Rayons et offres : un clic active l'onglet correspondant */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-f]'); if (!a) return;
    $(`[data-f="${a.dataset.f}"]`, tabs)?.click();
  });

  render('best');
};

/* ===== 5. Panier, quantité, favoris ===== */
const initCart = () => {
  let count = 0;

  const setQty = (c, n) => {
    n = clamp(n, 1, 99);
    $('.q-val', c).textContent = n;
    $('.minus', c).disabled = n <= 1;
    $('.plus', c).disabled = n >= 99;
  };

  /* Le produit vole vers le panier */
  const fly = (from, to, done) => {
    if (REDUCE_MOTION || !from || !to) return done();

    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const size = 56;
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    const lift = Math.min(160, Math.abs(dy) * .4 + 60);
    const img = $('img', from);

    const ghost = document.createElement('div');
    ghost.className = 'fly';
    ghost.innerHTML = img ? `<img src="${img.src}" alt="">` : from.textContent.trim();
    ghost.style.cssText = `left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px`;
    document.body.appendChild(ghost);

    ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * .5}px,${dy * .5 - lift}px) scale(.85) rotate(150deg)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px,${dy}px) scale(.2) rotate(360deg)`, opacity: .7 }
    ], { duration: 800, easing: 'ease-in-out' }).onfinish = () => {
      ghost.remove();
      done();
      retrigger(to, 'catch', 500);
    };
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
      fly($('.pic', c), $('.cart'), () => {
        count += n;
        $('#cartCount').textContent = count;
      });
      const label = $('span', btn);
      btn.classList.add('done');
      label.textContent = 'Ajouté';
      clearTimeout(btn.t);
      btn.t = setTimeout(() => { btn.classList.remove('done'); label.textContent = 'Ajouter'; }, 1400);
    }
  });

  /* Image introuvable : retour à l'emoji */
  document.addEventListener('error', e => {
    const im = e.target;
    if (im.tagName !== 'IMG' || !im.closest('.pic')) return;
    const emo = Object.assign(document.createElement('span'), { className: 'emo', textContent: im.dataset.emo || '🛒' });
    emo.setAttribute('aria-hidden', 'true');
    im.replaceWith(emo);
  }, true);

  /* Badge du panier : animation + libellé accessible */
  const badge = $('#cartCount');
  new MutationObserver(() => {
    retrigger(badge, 'bump');
    badge.parentElement.setAttribute('aria-label', `Panier, ${badge.textContent} article(s)`);
  }).observe(badge, { childList: true, characterData: true, subtree: true });
};

/* ===== 6. Avis clients ===== */
const initReviews = () => {
  const sec = $('#avis'); if (!sec) return;
  const hues = ['#6cb33f', '#f47a20', '#2c3e50', '#8bc34a', '#e0620f', '#4f9a28'];
  const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const stars = s => '★'.repeat(s) + `<span class="off">${'★'.repeat(5 - s)}</span>`;

  const reviewCard = (r, i) => `
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

  /* Un groupe + son clone = boucle sans saut */
  const fillRow = (el, list, offset) => {
    const one = list.map((r, i) => reviewCard(r, i + offset)).join('');
    const grp = one.repeat(Math.max(1, Math.ceil(1800 / (list.length * 316))));
    el.innerHTML = `<div class="rv-track">
      <div class="rv-grp">${grp}</div>
      <div class="rv-grp rv-clone" aria-hidden="true">${grp}</div>
    </div>`;
  };
  fillRow($('#rvA'), reviews.filter((_, i) => i % 2 === 0), 0);
  fillRow($('#rvB'), reviews.filter((_, i) => i % 2 === 1), 3);

  revealOnce(sec);
};

/* ===== 7. Header ===== */
const initHeader = () => {
  const header = $('#header'), burger = $('#burger'), menu = $('#menu');
  const accountBtn = $('#accountBtn'), dropdown = $('#dropdown');

  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  const setAccount = open => {
    dropdown.hidden = !open;
    accountBtn.setAttribute('aria-expanded', open);
  };

  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  accountBtn.addEventListener('click', e => { e.stopPropagation(); setAccount(dropdown.hidden); });
  document.addEventListener('click', e => { if (!e.target.closest('.account')) setAccount(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    setAccount(false); setMenu(false); accountBtn.focus();
  });

  /* Ombre au défilement + lien actif */
  const links = $$('a', menu);
  const home = links.find(a => !a.hash);
  const spy = links.filter(a => a.hash)
    .map(a => ({ a, el: $(a.hash) })).filter(x => x.el);

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
};

/* ===== 8. Hero ===== */
const initHero = () => {
  const hero = $('#hero'); if (!hero) return;
  document.documentElement.classList.add('js');

  /* Titre découpé mot par mot */
  const title = $('[data-split]', hero);
  title.setAttribute('aria-label', title.textContent);
  title.innerHTML = title.textContent.trim().split(/\s+/)
    .map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');

  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('in')));

  /* Compteurs */
  $$('[data-count]', hero).forEach(el => {
    const max = +el.dataset.count;
    if (REDUCE_MOTION) { el.textContent = max.toLocaleString('fr-FR'); return; }
    const t0 = performance.now() + 700, dur = 1400;
    const tick = now => {
      const k = clamp((now - t0) / dur, 0, 1);
      el.textContent = Math.round(max * (1 - (1 - k) ** 3)).toLocaleString('fr-FR');
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* Parallaxe (souris uniquement) */
  if (REDUCE_MOTION || !FINE_POINTER) return;
  const visual = $('.hx-visual', hero);
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    setVars(visual, { '--mx': ((e.clientX - r.left) / r.width - .5) * 2, '--my': ((e.clientY - r.top) / r.height - .5) * 2 });
  });
  hero.addEventListener('mouseleave', () => setVars(visual, { '--mx': 0, '--my': 0 }));
};

/* ===== 9. Newsletter ===== */
const initNewsletter = () => {
  $('#news').onsubmit = e => {
    e.preventDefault();
    const msg = $('#newsMsg');
    msg.textContent = 'Merci ! Vous êtes inscrit(e).';
    $('#email').value = '';
    clearTimeout(msg.t);
    msg.t = setTimeout(() => (msg.textContent = ''), 5000);
  };
};

/* ===== 10. Actualités (magazine) ===== */
const initNews = () => {
  const nx = $('#nx'), stage = $('#nxStage'), list = $('#nxList');
  const fmt = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const arrow = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>`;

  const count = $('#newsCount');
  if (count) count.textContent = `${news.length} sur ${TOTAL_NEWS}`;

  stage.innerHTML = news.map(n => `
    <article class="nx-slide">
      <img src="./images/${n.img}" alt="">
      <div class="nx-body">
        <span class="nx-cat">${n.cat}</span>
        <h3>${n.t}</h3>
        <p>${n.ex}</p>
        <a class="nx-link" href="blog.html#${n.slug}">Lire l'article <i aria-hidden="true">${arrow}</i></a>
      </div>
    </article>`).join('') +
    `<div class="nx-num"><b id="nxCur">01</b>/${pad(news.length)} à la une</div>`;

  list.innerHTML = news.map((n, i) => `
    <li><button class="nx-item" data-i="${i}">
      <img src="./images/${n.img}" alt="" loading="lazy">
      <span><b>${n.t}</b><small>${fmt(n.d)} · ${n.min} min</small></span>
      <i class="bar"></i>
    </button></li>`).join('');

  const slides = $$('.nx-slide', stage);
  const items  = $$('.nx-item', list);
  let cur = 0;

  const go = i => {
    cur = (i + news.length) % news.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === cur));
    items.forEach((b, k) => {
      b.classList.toggle('on', k === cur);
      k === cur ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current');
    });
    $('#nxCur').textContent = pad(cur + 1);

    const lb = list.getBoundingClientRect(), r = items[cur].parentElement.getBoundingClientRect();
    list.scrollTo({ top: list.scrollTop + (r.top - lb.top) - 6, left: list.scrollLeft + (r.left - lb.left) - 6, behavior: 'smooth' });
  };

  list.addEventListener('animationend', e => { if (e.target.classList.contains('bar')) go(cur + 1); });
  list.addEventListener('click', e => {
    const b = e.target.closest('.nx-item');
    if (b && +b.dataset.i !== cur) go(+b.dataset.i);
  });
  nx.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
  });

  /* Pause : survol souris, focus clavier, hors écran */
  let hov = false, foc = false, vis = false;
  const sync = () => nx.classList.toggle('paused', hov || foc || !vis);
  const bodies = () => $$('.nx-body', stage);

  nx.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hov = true; sync(); } });
  nx.addEventListener('pointerleave', e => {
    if (e.pointerType !== 'mouse') return;
    hov = false; sync();
    bodies().forEach(b => setVars(b, { '--px': 0, '--py': 0 }));
  });
  nx.addEventListener('focusin',  e => { foc = e.target.matches(':focus-visible'); sync(); });
  nx.addEventListener('focusout', () => { foc = false; sync(); });
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; sync(); }, { threshold: .35 }).observe(nx);

  stage.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    const v = { '--px': ((e.clientX - r.left) / r.width - .5) * 2, '--py': ((e.clientY - r.top) / r.height - .5) * 2 };
    bodies().forEach(b => setVars(b, v));
  });

  go(0);
};

/* ===== 11. Init ===== */
renderCategories();
initProducts();
initCart();
initReviews();
initHeader();
initHero();
initNewsletter();
initNews();
revealOnce($('#app'), .25);     // application mobile
revealOnce($('#about'), .3);    // parcours « du champ à la porte »