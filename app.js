(() => {
  'use strict';
  const products = window.IFCatalog;
  const categories = window.IFCategories;
  const store = window.IFStore;
  const main = document.querySelector('#main');
  const toastBox = document.querySelector('#toast');
  const searchDialog = document.querySelector('#search-dialog');
  const confirmDialog = document.querySelector('#confirm-dialog');
  const money = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value / 100);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const find = id => products.find(p => p.id === id);
  const categoryName = id => categories.find(c => c.id === id)?.name || 'Collection';
  const paths = {
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    user:'<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2.5a7.5 7.5 0 0 1 15 0V21"/>',
    bag:'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    heart:'<path d="M20.6 5.4a5 5 0 0 0-7.1 0L12 6.9l-1.5-1.5a5 5 0 0 0-7.1 7.1L12 21l8.6-8.5a5 5 0 0 0 0-7.1Z"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    arrow:'<path d="M5 19 19 5M5 5h14v14"/>',
    check:'<path d="m4 12 5 5L20 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
  document.querySelector('#search-open').innerHTML = icon('search');
  document.querySelector('.account-link').innerHTML = icon('user');
  document.querySelector('#cart-icon').innerHTML = icon('bag');
  document.querySelector('#menu-toggle').innerHTML = icon('menu');
  document.querySelectorAll('.close-dialog').forEach(el => el.innerHTML = icon('close'));
  let toastTimer;
  let currentRoute;

  function notify(message, cartLink = false) {
    clearTimeout(toastTimer);
    toastBox.innerHTML = `${icon('check')}<span>${esc(message)}</span>${cartLink ? '<a href="#panier">Voir le panier ↗</a>' : ''}`;
    toastBox.classList.add('visible');
    toastTimer = setTimeout(() => toastBox.classList.remove('visible'), 4500);
  }
  function art(product, extra = '') {
    return `<div class="product-art art-${esc(product.art)} ${extra}"><div class="object-frame"><img src="${esc(product.image)}" alt="${esc(product.name || categoryName(product.id))}" loading="lazy" width="600" height="600"></div></div>`;
  }
  function productCard(p) {
    const saved = store.read().favorites.includes(p.id);
    return `<article class="product-card"><div class="card-visual"><a href="#produit/${p.id}" aria-label="Découvrir ${esc(p.name)}">${art(p)}</a><span class="product-label">${esc(p.label)}</span><button class="favorite-button ${saved ? 'is-saved' : ''}" data-favorite="${p.id}" aria-label="${saved ? 'Retirer' : 'Ajouter'} ${esc(p.name)} ${saved ? 'des' : 'aux'} favoris" aria-pressed="${saved}">${icon('heart')}</button></div><div class="card-meta"><span>${esc(categoryName(p.category))} <span aria-hidden="true">/</span> ${esc(p.universe)}</span><span>Prix démo</span></div><div class="card-title"><h3><a href="#produit/${p.id}">${esc(p.name)}</a></h3><strong>${money(p.price)}</strong></div><div class="card-bottom"><p>${esc(p.subtitle)}</p><button class="add-round" data-add="${p.id}" aria-label="Ajouter ${esc(p.name)} au panier">${icon('plus')}</button></div></article>`;
  }
  function crumb(label, middle = '') {
    return `<div class="breadcrumbs"><a href="#accueil">Accueil</a><span>/</span>${middle}<span>${esc(label)}</span></div>`;
  }
  function emptyState(title, text, link = '#collection', label = 'Explorer la collection') {
    return `<div class="empty-state"><span class="empty-symbol" aria-hidden="true">↗</span><h2>${esc(title)}</h2><p>${esc(text)}</p><a href="${link}" class="button">${esc(label)} ${icon('arrow')}</a></div>`;
  }
  function home() {
    return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="small-cross" aria-hidden="true">✳</span> POUR CEUX QUI VIVENT LEUR PASSION</div><h1>LA PASSION<br>PREND <span>FORME.</span></h1><p>Des histoires qui nous marquent aux objets que l’on garde. Faites une place à votre univers.</p><a class="button" href="#collection">Explorer la collection ${icon('arrow')}</a><div class="hero-foot"><span class="tiny-line"></span><span>TABLEAUX &nbsp; / &nbsp; FIGURINES &nbsp; / &nbsp; KATANAS</span></div></div><div class="hero-visual"><span class="hero-index">FIG. 001 — L’ESPRIT IMPACT FRAME</span><div class="hero-red-block"></div><div class="hero-manga-frame"><img src="assets/aventure.jpg" alt="Composition de cases du manga One Piece avec Luffy et son équipage" width="1024" height="559" fetchpriority="high"></div><div class="circle-stamp" aria-hidden="true"><span>OBJETS DE</span><b>PASSION</b><span>HISTOIRES À GARDER</span></div><div class="hero-caption"><span>L’aventure commence ici.</span><span>ARCHIVE N° 001</span></div></div></section>
    <div class="manifesto-strip" aria-hidden="true"><span>DE LA PAGE À VOTRE COLLECTION</span><b>✳</b><span>L’UNIVERS MANGA, AUTREMENT</span><b>✳</b><span>FAITES PLACE À LA PASSION</span><b>✳</b></div>
    <section class="section wrap"><div class="section-heading"><div><span class="eyebrow">TROIS UNIVERS. UNE MÊME PASSION.</span><h2>À chacun sa collection.</h2></div><a class="text-link" href="#collection">Tout explorer ${icon('arrow')}</a></div><div class="category-grid">${categories.map(c => `<a href="#collection?categorie=${c.id}" class="category-card"><div class="category-number">${c.number} <span>COLLECTION</span></div>${art(c)}<div class="category-caption"><div><h3>${c.name}</h3><p>${c.tagline}</p></div>${icon('arrow')}</div></a>`).join('')}</div></section>
    <section class="section selection-section"><div class="wrap"><div class="section-heading"><div><span class="eyebrow">LES PIÈCES QUI RACONTENT QUELQUE CHOSE</span><h2>La sélection Impact Frame.</h2></div><span class="section-note">Catalogue illustratif · prix de démonstration</span></div><div class="product-grid home-grid">${products.slice(0,3).map(productCard).join('')}</div><div class="section-bottom"><a class="button secondary" href="#collection">Voir toute la collection ${icon('arrow')}</a></div></div></section>
    <section class="story-teaser wrap"><div class="story-visual"><img src="assets/grand-line.png" alt="Le navire de l’équipage One Piece dans un paysage sous-marin lumineux" width="1200" height="800" loading="lazy"><span>UNE HISTOIRE DE PASSION, AVANT TOUT.</span></div><div class="story-copy"><span class="eyebrow">L’ESPRIT DU PROJET</span><h2>Certains univers<br>ne nous quittent jamais.</h2><p>Une scène qui reste en tête. Un personnage qui nous inspire. Impact Frame est né de cette envie : donner une place aux histoires qui nous accompagnent.</p><a class="text-link" href="#histoire">Découvrir notre histoire ${icon('arrow')}</a></div></section>
    <section class="archive-callout wrap"><span class="archive-star" aria-hidden="true">✳</span><div><span class="eyebrow">UN PROJET À GARDER</span><h2>L’aventure continue, en archive.</h2><p>Une boutique imaginée, restaurée pour le plaisir de la parcourir.</p></div><a href="#archive" class="text-link">À propos de cette édition ${icon('arrow')}</a></section>`;
  }
  function collection(params) {
    const category = categories.find(c => c.id === params.get('categorie'));
    const query = (params.get('recherche') || '').slice(0,100);
    const sorting = params.get('tri') || 'selection';
    const onlySaved = params.get('favoris') === '1';
    let list = products.filter(p => (!category || p.category === category.id) && (!query || norm(`${p.name} ${p.subtitle} ${p.category} ${p.universe}`).includes(norm(query))) && (!onlySaved || store.read().favorites.includes(p.id)));
    if (sorting === 'prix-asc') list.sort((a,b) => a.price-b.price);
    if (sorting === 'prix-desc') list.sort((a,b) => b.price-a.price);
    if (sorting === 'nom') list.sort((a,b) => a.name.localeCompare(b.name,'fr'));
    const title = onlySaved ? 'Vos coups de cœur.' : category ? `${category.name}.` : 'Des histoires à collectionner.';
    const description = onlySaved ? 'Les pièces que vous avez mises de côté, à retrouver ici.' : category?.description || 'Un univers, trois façons de l’exposer. Trouvez la pièce qui vous ressemble.';
    return `<div class="wrap">${crumb(category?.name || 'La collection')}<section class="page-intro"><span class="eyebrow">LA COLLECTION IMPACT FRAME</span><h1>${esc(title)}</h1><p>${esc(description)}</p></section><div class="collection-toolbar"><div class="filter-tabs" aria-label="Filtrer par collection"><a href="#collection" ${!category && !onlySaved ? 'aria-current="page"' : ''}>Tout <span>${products.length}</span></a>${categories.map(c=>`<a href="#collection?categorie=${c.id}" ${category?.id===c.id?'aria-current="page"':''}>${c.name} <span>${products.filter(p=>p.category===c.id).length}</span></a>`).join('')}</div><label class="sort-label">Trier par <select id="sort-select" aria-label="Trier les produits">${[['selection','Notre sélection'],['prix-asc','Prix croissant'],['prix-desc','Prix décroissant'],['nom','Nom : A à Z']].map(([v,l])=>`<option value="${v}" ${sorting===v?'selected':''}>${l}</option>`).join('')}</select></label></div><form id="catalog-search" class="catalog-search"><label class="sr-only" for="catalog-input">Rechercher dans la collection</label><div>${icon('search')}<input type="search" id="catalog-input" name="recherche" value="${esc(query)}" placeholder="Rechercher dans la collection…" maxlength="100"><button type="submit">Rechercher</button></div><span>${list.length} pièce${list.length>1?'s':''}${query ? ` pour « ${esc(query)} » <a href="#collection">Effacer</a>`:''}</span></form><div class="demo-note"><span aria-hidden="true">↳</span> Une collection imaginée pour l’archive. Visuels et prix de démonstration ; aucune vente réelle.</div>${list.length ? `<div class="product-grid collection-grid">${list.map(productCard).join('')}</div>` : emptyState('Aucune pièce pour le moment.', 'Essayez un autre mot ou explorez l’ensemble de la collection.')}<div class="collection-end"><span>VOUS AVEZ EXPLORÉ TOUTE LA COLLECTION</span><span aria-hidden="true">✳</span><a class="text-link" href="#histoire">Et si on parlait de l’histoire ? ↗</a></div></div>`;
  }
  function product(id) {
    const p = find(id);
    if (!p) return missing();
    const saved = store.read().favorites.includes(id);
    return `<div class="wrap">${crumb(p.name,`<a href="#collection?categorie=${p.category}">${categoryName(p.category)}</a><span>/</span>`)}<section class="product-detail"><div class="detail-visual">${art(p)}<div class="visual-caption"><span>${esc(p.universe)} · ${esc(categoryName(p.category))}</span><span>VISUEL ILLUSTRATIF</span></div></div><div class="detail-copy"><span class="eyebrow">${esc(categoryName(p.category))} / ${esc(p.universe)}</span><h1>${esc(p.name)}</h1><p class="product-subtitle">${esc(p.subtitle)}</p><div class="detail-price"><strong>${money(p.price)}</strong><span>Prix de démonstration</span></div><p>${esc(p.description)}</p><div class="detail-purchase"><label for="product-quantity">Quantité<input id="product-quantity" type="number" min="1" max="20" value="1" inputmode="numeric"></label><button class="button" data-add="${p.id}" data-detail="true">Ajouter au panier ${icon('plus')}</button><button class="favorite-button detail-favorite ${saved?'is-saved':''}" data-favorite="${p.id}" aria-label="${saved?'Retirer des':'Ajouter aux'} favoris" aria-pressed="${saved}">${icon('heart')}</button></div><p class="local-hint">Votre sélection reste dans ce navigateur. Aucune commande réelle.</p><dl class="product-specs">${p.details.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl><details class="product-notice"><summary>À propos de cette pièce de démonstration</summary><p>${esc(p.note)}</p></details></div></section><section class="section"><div class="section-heading"><div><span class="eyebrow">POUR PROLONGER L’AVENTURE</span><h2>Dans le même esprit.</h2></div><a class="text-link" href="#collection">La collection ${icon('arrow')}</a></div><div class="product-grid home-grid">${products.filter(x=>x.id!==id).slice(0,3).map(productCard).join('')}</div></section></div>`;
  }
  function cart() {
    const state = store.read();
    if (!state.cart.length) return `<div class="wrap">${crumb('Panier')}<section class="page-intro"><span class="eyebrow">VOTRE SÉLECTION</span><h1>Le panier.</h1></section>${emptyState('Le début d’une collection.', 'Votre panier est encore vide. Les histoires à collectionner vous attendent.')}</div>`;
    const total = state.cart.reduce((sum,i)=>sum+find(i.id).price*i.quantity,0);
    const count = state.cart.reduce((sum,i)=>sum+i.quantity,0);
    return `<div class="wrap">${crumb('Panier')}<section class="page-intro"><span class="eyebrow">VOTRE SÉLECTION</span><h1>Le panier<span class="title-count">(${count})</span>.</h1><p>Quelques pièces, et déjà tout un univers.</p></section><div class="cart-layout"><div><div class="cart-table-head"><span>PIÈCE</span><span>QUANTITÉ</span><span>TOTAL</span></div>${state.cart.map(i=>{const p=find(i.id);return `<article class="cart-item"><a class="cart-art" href="#produit/${p.id}">${art(p)}</a><div class="cart-item-info"><span class="eyebrow">${esc(categoryName(p.category))}</span><h2><a href="#produit/${p.id}">${esc(p.name)}</a></h2><span>${money(p.price)} · prix démo</span><button class="remove-link" data-remove="${p.id}">Retirer</button></div><div class="quantity-control"><button data-quantity="${p.id}" data-value="${i.quantity-1}" aria-label="Diminuer la quantité de ${esc(p.name)}">−</button><label class="sr-only" for="qty-${p.id}">Quantité de ${esc(p.name)}</label><input id="qty-${p.id}" data-qty-input="${p.id}" type="number" value="${i.quantity}" min="0" max="20" inputmode="numeric"><button data-quantity="${p.id}" data-value="${i.quantity+1}" aria-label="Augmenter la quantité de ${esc(p.name)}" ${i.quantity>=20?'disabled':''}>+</button></div><strong class="line-total">${money(p.price*i.quantity)}</strong></article>`;}).join('')}<a href="#collection" class="text-link continue-link">← Continuer à explorer</a></div><aside class="cart-summary"><span class="eyebrow">RÉCAPITULATIF</span><h2>Votre collection<br>prend forme.</h2><div><span>Sélection (${count} pièce${count>1?'s':''})</span><span>${money(total)}</span></div><div><span>Livraison</span><span>Sans objet · démo</span></div><div class="summary-total"><strong>Total simulé</strong><strong>${money(total)}</strong></div><button class="button" id="order-open">Simuler la commande ${icon('arrow')}</button><p>Aucun paiement. Aucune expédition.<br>Un souvenir de votre visite, enregistré dans votre carnet.</p></aside></div></div>`;
  }
  function orderPage(id) {
    const order = store.read().orders.find(o=>o.id===id);
    if (!order) return missing();
    return `<div class="wrap order-page"><span class="success-mark">${icon('check')}</span><span class="eyebrow">SÉLECTION ENREGISTRÉE</span><h1>Une collection<br>qui vous ressemble.</h1><p>Votre simulation est terminée. Retrouvez ce souvenir dans votre carnet, sur ce navigateur.</p><div class="order-receipt"><div><span>${esc(order.id)}</span><span>${new Date(order.date).toLocaleDateString('fr-FR')}</span></div>${order.items.map(i=>`<div><span>${esc(i.name)} × ${i.quantity}</span><span>${money(i.price*i.quantity)}</span></div>`).join('')}<div class="receipt-total"><strong>Total simulé</strong><strong>${money(order.total)}</strong></div><p>Archive de démonstration · Aucune vente ni paiement</p></div><div class="order-actions"><a class="button" href="#carnet">Mon carnet ${icon('arrow')}</a><button class="button secondary" data-download-order="${esc(order.id)}">Télécharger le souvenir ↓</button></div><a class="text-link" href="#collection">Continuer la visite ↗</a></div>`;
  }
  function notebook() {
    const state = store.read();
    const favorites = products.filter(p=>state.favorites.includes(p.id));
    return `<div class="wrap">${crumb('Mon carnet')}<section class="page-intro"><span class="eyebrow">VOTRE ESPACE COLLECTIONNEUR</span><h1>${state.profile.name ? `Le carnet de ${esc(state.profile.name)}.` : 'Le carnet de vos passions.'}</h1><p>Vos coups de cœur et vos sélections, réunis au même endroit.</p></section><div class="notebook-profile"><div><h2>Faites comme chez vous.</h2><p>Un simple pseudonyme pour personnaliser votre visite. Sans compte ni mot de passe.</p></div><form id="profile-form"><label for="profile-name">Votre pseudonyme</label><div><input id="profile-name" name="name" maxlength="40" value="${esc(state.profile.name)}" placeholder="Collectionneur" autocomplete="off"><button class="button" type="submit">Enregistrer</button></div></form></div><section class="section notebook-section"><div class="section-heading"><div><span class="eyebrow">LES PIÈCES MISES DE CÔTÉ</span><h2>Vos coups de cœur<span class="title-count">(${favorites.length})</span>.</h2></div></div>${favorites.length ? `<div class="product-grid collection-grid">${favorites.map(productCard).join('')}</div>` : `<p class="quiet-empty">Un objet vous plaît ? Touchez le cœur sur sa fiche pour le retrouver ici. <a href="#collection">Explorer la collection ↗</a></p>`}</section><section class="notebook-section"><div class="section-heading"><div><span class="eyebrow">SOUVENIRS DE VISITE</span><h2>Vos sélections.</h2></div><span class="section-note">20 souvenirs les plus récents</span></div>${state.orders.length ? `<div class="orders-list">${[...state.orders].sort((a,b)=>b.date.localeCompare(a.date)).map(o=>`<a href="#commande/${esc(o.id)}"><span>${esc(o.id)}<small>${new Date(o.date).toLocaleDateString('fr-FR')} · Simulation</small></span><span>${o.items.reduce((s,i)=>s+i.quantity,0)} pièce(s)</span><strong>${money(o.total)}</strong>${icon('arrow')}</a>`).join('')}</div>`:'<p class="quiet-empty">Votre carnet s’écrira au fil de vos sélections. Une simulation depuis le panier suffit.</p>'}</section><div class="privacy-note"><div><h3>Un carnet qui reste chez vous.</h3><p>${store.available?'Les informations sont conservées uniquement dans ce navigateur.':'Le stockage est indisponible : votre carnet restera disponible uniquement pendant cette visite.'} Aucun envoi à un serveur. Effacer ces données réinitialise le panier, les favoris, le pseudonyme et les souvenirs.</p></div><button class="text-link" id="reset-local">Effacer mon carnet</button></div></div>`;
  }
  function story() {
    return `<div class="wrap">${crumb('Notre histoire')}<section class="story-page-intro"><span class="eyebrow">L’HISTOIRE D’IMPACT FRAME</span><h1>Une passion.<br>Des histoires.<br><span>Une empreinte.</span></h1><p>On ne choisit pas toujours les univers qui nous marquent. Mais on peut choisir la place qu’on leur donne.</p></section><div class="story-panorama"><img src="assets/grand-line.png" alt="Un navire One Piece entre ombre et lumière sous l’océan" width="1200" height="800"><span>L’AVENTURE COMMENCE ICI.</span></div><section class="editorial-section"><span class="eyebrow">01 / L’IDÉE D’ORIGINE</span><div><h2>Faire sortir la passion des pages.</h2><p>Impact Frame a été imaginé comme une boutique dédiée aux objets de collection inspirés de la culture japonaise. Trois familles en dessinaient l’identité : les tableaux, les figurines et les katanas.</p><p>Au cœur du projet, l’univers de One Piece et une envie simple : retrouver dans un objet l’émotion d’une histoire, l’énergie d’un personnage ou l’atmosphère d’une aventure.</p></div></section><section class="editorial-section"><span class="eyebrow">02 / TROIS EXPRESSIONS</span><div><h2>À exposer. À regarder. À garder.</h2><div class="story-principles">${categories.map(c=>`<a href="#collection?categorie=${c.id}"><span>${c.number}</span><h3>${c.name}</h3><p>${c.tagline}</p>↗</a>`).join('')}</div></div></section><section class="editorial-section"><span class="eyebrow">03 / UN NOUVEAU CHAPITRE</span><div><h2>Terminer, pour mieux conserver.</h2><p>Le projet était resté inachevé. Cette édition lui donne une forme complète et consultable : une identité visuelle, un catalogue illustratif et un parcours de collection fonctionnel.</p><p>Une archive vivante de l’idée initiale, à ouvrir, à explorer et à garder.</p><a class="button" href="#collection">Entrer dans la collection ${icon('arrow')}</a></div></section></div>`;
  }
  function help() {
    const questions = [
      ['Peut-on acheter les objets présentés ?', 'Cette version est une archive interactive de démonstration. Les prix sont illustratifs : aucun objet ne peut être acheté, aucun paiement n’est demandé et aucune livraison n’est organisée.'],
      ['Comment fonctionne le panier ?', 'Ajoutez une pièce depuis le catalogue ou sa fiche, puis ajustez les quantités dans le panier (20 exemplaires maximum par pièce). Le bouton « Simuler la commande » permet de conserver votre sélection dans le carnet.'],
      ['Faut-il créer un compte ?', 'Votre carnet utilise seulement un pseudonyme facultatif. Les favoris, le panier et les simulations sont conservés dans ce navigateur, sur cet appareil. Aucun mot de passe ni adresse e-mail ne vous est demandé.'],
      ['Puis-je utiliser le site sans Internet ?', 'Oui. Tous les fichiers nécessaires sont inclus dans l’archive. Ouvrez index.html après avoir extrait le dossier. Le fonctionnement du stockage local peut varier selon le navigateur en ouverture directe ; le site continue alors en mémoire pendant la visite.'],
      ['Pourquoi certains objets sont-ils des concepts ?', 'La base de données initiale n’a pas été fournie. Le catalogue a donc été reconstitué à partir des catégories et des visuels disponibles. La figurine est un visuel concept généré pour compléter la démonstration. Les fiches précisent l’origine des images.'],
      ['Comment effacer ma sélection ?', 'Dans « Mon carnet », choisissez « Effacer mon carnet », puis confirmez. Cela efface uniquement les données de cette archive dans ce navigateur. Les fichiers du projet sont conservés.'],
      ['Comment activer la musique ?', 'Utilisez le bouton « Activer l’ambiance sonore » en bas de page. La musique d’origine ne démarre que sur votre demande et peut être coupée au même endroit.']
    ];
    return `<div class="wrap narrow">${crumb('Questions fréquentes')}<section class="page-intro"><span class="eyebrow">QUELQUES REPÈRES</span><h1>Tout simplement.</h1><p>Ce qu’il faut savoir pour profiter de l’archive.</p></section><div class="faq-list">${questions.map(([q,a],i)=>`<details ${i===0?'open':''}><summary><span>${esc(q)}</span><span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div><div class="help-end"><p>Envie de découvrir le projet derrière le site ?</p><a href="#archive" class="text-link">À propos de l’archive ${icon('arrow')}</a></div></div>`;
  }
  function archive() {
    return `<div class="wrap narrow">${crumb('À propos de l’archive')}<section class="page-intro"><span class="eyebrow">IMPACT FRAME / ÉDITION ARCHIVE 2026</span><h1>Une idée qui méritait<br>d’être terminée.</h1><p>Un projet de boutique manga, restauré pour être conservé et parcouru dans le temps.</p></section><div class="archive-facts"><div><span>FORMAT</span><strong>Site autonome</strong></div><div><span>COLLECTIONS</span><strong>3 univers</strong></div><div><span>STATUT</span><strong>Démonstration</strong></div></div><section class="prose"><h2>Le projet et cette édition</h2><p>Les sources d’Impact Frame présentaient une boutique de tableaux, figurines et katanas autour de One Piece, avec un début d’espace compte. Le site dépendait de PHP et d’une base MySQL qui n’accompagnait pas les fichiers.</p><p>Cette version transforme l’idée en une archive autonome : navigation complète, recherche, catalogue, fiches, favoris, panier et souvenirs de commande simulée. Elle fonctionne sans installation, sans base de données et sans service externe.</p><h2>Ce qui a été reconstitué</h2><p>Les noms des articles, prix et présentations du catalogue ont été créés pour la démonstration. Ils ne décrivent pas un stock ni une offre commerciale. Les tableaux sont des mises en scène des images d’origine. La figurine Luffy est un visuel concept généré avec ImageGen ; le katana reprend la photo fournie.</p><h2>Vos données restent locales</h2><p>Le site conserve dans ce navigateur le panier, les favoris, un pseudonyme facultatif et jusqu’à vingt simulations. Il ne crée aucun compte distant et ne transmet aucune commande. Le carnet permet d’effacer ces données. Aucun suivi de visite ni outil de mesure externe n’est intégré.</p><h2>Images, musique et crédits</h2><p>Les deux illustrations, la photographie du katana et le morceau « Overtaken » étaient présents dans les sources. L’illustration océanique porte le crédit visible <span class="credit-text">zzyzzyy.deviantart.com</span>, conservé dans l’image. Les autres auteurs ou ayants droit ne sont pas documentés dans les fichiers reçus.</p><p>One Piece et ses personnages appartiennent à leurs ayants droit. Impact Frame est présenté ici comme un projet de passion et une archive personnelle. Cette restauration ne constitue pas une licence de réutilisation des images ou de la musique.</p><h2>Conserver le projet</h2><p>Gardez le dossier complet et le fichier ZIP fourni. Le guide inclus explique l’ouverture, les fonctionnalités et les changements. Les sources initiales restent consultables dans l’historique du dépôt Git, avant cette restauration.</p><a class="button" href="#accueil">Retour à l’aventure ${icon('arrow')}</a></section></div>`;
  }
  function missing() { return `<div class="wrap">${emptyState('Cette page a pris le large.', 'Le lien ne correspond à aucune pièce ou page de l’archive.', '#accueil', 'Retour à l’accueil')}</div>`; }
  function render(focus = false) {
    const hash = location.hash.slice(1) || 'accueil';
    const [path, query = ''] = hash.split('?');
    const [route, id] = path.split('/');
    const params = new URLSearchParams(query);
    currentRoute = {route,id,params};
    let content;
    switch(route) {
      case 'accueil': content=home(); break;
      case 'collection': content=collection(params); break;
      case 'produit': content=product(id); break;
      case 'panier': content=cart(); break;
      case 'carnet': content=notebook(); break;
      case 'commande': content=orderPage(id); break;
      case 'histoire': content=story(); break;
      case 'aide': content=help(); break;
      case 'archive': content=archive(); break;
      default: content=missing();
    }
    main.innerHTML=content;
    document.title=`${({accueil:'La passion prend forme',collection:'La collection',produit:find(id)?.name || 'Pièce introuvable',panier:'Le panier',carnet:'Mon carnet',commande:'Votre souvenir',histoire:'Notre histoire',aide:'Questions fréquentes',archive:'Édition archive'})[route] || 'Page introuvable'} — Impact Frame`;
    const count=store.read().cart.reduce((sum,i)=>sum+i.quantity,0);
    document.querySelector('#cart-count').textContent=count;
    document.querySelector('.cart-link').setAttribute('aria-label',`Panier, ${count} article${count>1?'s':''}`);
    document.querySelectorAll('#navigation a').forEach(a=>{const active=a.getAttribute('href')===`#${route}${params.get('categorie')?`?categorie=${params.get('categorie')}`:''}`; if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(focus) { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  }
  function filterUpdate(changes) {
    const params=new URLSearchParams(currentRoute.params);
    Object.entries(changes).forEach(([k,v])=>v?params.set(k,v):params.delete(k));
    location.hash=`collection${params.size?'?'+params.toString():''}`;
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('.skip-link')) {event.preventDefault();main.focus();main.scrollIntoView({block:'start'});return;}
    if(event.target.closest('#navigation a')) {document.body.classList.remove('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');document.querySelector('#menu-toggle').setAttribute('aria-label','Ouvrir le menu');}
    const add=event.target.closest('[data-add]');
    if(add) {
      const p=find(add.dataset.add);
      const input=add.dataset.detail ? document.querySelector('#product-quantity') : null;
      const qty=input ? Number(input.value) : 1;
      if(!Number.isInteger(qty)||qty<1||qty>20) {input?.reportValidity(); notify('Choisissez une quantité entre 1 et 20.'); return;}
      const existing=store.read().cart.find(i=>i.id===p.id)?.quantity||0;
      if(existing+qty>20) {notify('Le panier est limité à 20 exemplaires par pièce.');return;}
      if(existing) store.quantity(p.id,existing+qty); else {store.add(p.id);if(qty>1)store.quantity(p.id,qty);}
      const count=store.read().cart.reduce((sum,i)=>sum+i.quantity,0);
      document.querySelector('#cart-count').textContent=count;
      document.querySelector('.cart-link').setAttribute('aria-label',`Panier, ${count} article${count>1?'s':''}`);
      notify(`${p.name} ajouté${qty>1?' × '+qty:''} au panier.`,true);
    }
    const favorite=event.target.closest('[data-favorite]');
    if(favorite) {const id=favorite.dataset.favorite;store.favorite(id);const saved=store.read().favorites.includes(id);document.querySelectorAll(`[data-favorite="${id}"]`).forEach(b=>{b.classList.toggle('is-saved',saved);b.setAttribute('aria-pressed',String(saved));b.setAttribute('aria-label',`${saved?'Retirer':'Ajouter'} ${find(id).name} ${saved?'des':'aux'} favoris`);});if(currentRoute.route==='carnet'||currentRoute.params.get('favoris'))render();notify(saved?'Une pièce de plus dans vos coups de cœur.':'Pièce retirée de vos coups de cœur.');}
    const remove=event.target.closest('[data-remove]');
    if(remove){store.remove(remove.dataset.remove);render();notify('Pièce retirée du panier.');}
    const quantity=event.target.closest('[data-quantity]');
    if(quantity){const key=quantity.dataset.quantity;const value=Number(quantity.dataset.value);store.quantity(key,value);render();document.querySelector(`[data-quantity="${key}"][data-value="${value+1}"]`)?.focus({preventScroll:true});}
    if(event.target.closest('#order-open')) {const state=store.read();document.querySelector('#confirm-summary').innerHTML=`<div class="confirm-total"><span>${state.cart.reduce((s,i)=>s+i.quantity,0)} pièce(s)</span><strong>${money(state.cart.reduce((s,i)=>s+find(i.id).price*i.quantity,0))}</strong></div>`;confirmDialog.showModal();}
    if(event.target.closest('#confirm-order')) {try{const order=store.order();confirmDialog.close();location.hash=`commande/${order.id}`;}catch(error){confirmDialog.close();notify(error.message);}}
    if(event.target.closest('[data-cancel-order]'))confirmDialog.close();
    if(event.target.closest('#search-open')){searchDialog.showModal();document.querySelector('#search-input').focus();}
    const close=event.target.closest('.close-dialog'); if(close)close.closest('dialog').close();
    if(event.target.closest('[data-close-search]'))searchDialog.close();
    const menu=event.target.closest('#menu-toggle');if(menu){const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('menu-open',open);}
    const download=event.target.closest('[data-download-order]');if(download)downloadOrder(download.dataset.downloadOrder);
    const reset=event.target.closest('#reset-local');if(reset){if(reset.dataset.confirm==='true'){store.reset();render();notify('Votre carnet a été réinitialisé.');}else{reset.dataset.confirm='true';reset.textContent='Confirmer l’effacement';}}
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='search-form'){event.preventDefault();const query=document.querySelector('#search-input').value.trim().slice(0,100);searchDialog.close();location.hash=query?`collection?recherche=${encodeURIComponent(query)}`:'collection';}
    if(event.target.id==='catalog-search'){event.preventDefault();filterUpdate({recherche:document.querySelector('#catalog-input').value.trim()});}
    if(event.target.id==='profile-form'){event.preventDefault();store.profile(document.querySelector('#profile-name').value);render();notify('Votre carnet est personnalisé.');}
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='sort-select')filterUpdate({tri:event.target.value});
    if(event.target.matches('[data-qty-input]')){const value=Number(event.target.value);if(Number.isInteger(value)&&value>=0&&value<=20){store.quantity(event.target.dataset.qtyInput,value);render();}else{notify('Choisissez une quantité entre 0 et 20.');render();}}
  });
  function downloadOrder(id){
    const o=store.read().orders.find(item=>item.id===id);if(!o)return;
    const text=`IMPACT FRAME — SOUVENIR DE COLLECTION\n${o.id}\n${new Date(o.date).toLocaleString('fr-FR')}\n\n${o.items.map(i=>`${i.name} × ${i.quantity} : ${money(i.price*i.quantity)}`).join('\n')}\n\nTOTAL SIMULÉ : ${money(o.total)}\n\nArchive de démonstration. Aucune commande, aucun paiement, aucune expédition.\n`;
    const url=URL.createObjectURL(new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`Impact-Frame-${o.id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  document.querySelector('#music-toggle').addEventListener('click',async()=>{
    const audio=document.querySelector('#ambience');const button=document.querySelector('#music-toggle');
    if(!audio.paused){audio.pause();button.textContent='Activer l’ambiance sonore ↗';button.setAttribute('aria-pressed','false');}
    else {try{audio.volume=0.25;await audio.play();button.textContent='Couper l’ambiance sonore ◼';button.setAttribute('aria-pressed','true');}catch{notify('La musique n’a pas pu démarrer. Vérifiez les fichiers de l’archive.');}}
  });
  [searchDialog,confirmDialog].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.body.classList.remove('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');document.querySelector('#menu-toggle').setAttribute('aria-label','Ouvrir le menu');}});
  window.addEventListener('hashchange',()=>{document.body.classList.remove('menu-open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');document.querySelector('#menu-toggle').setAttribute('aria-label','Ouvrir le menu');[searchDialog,confirmDialog].forEach(d=>{if(d.open)d.close();});render(true);});
  window.addEventListener('storage',event=>{if(event.key==='impact-frame-archive-v1'||event.key===null){if(confirmDialog.open)confirmDialog.close();render();}});
  render();
})();
