// la tablette de yanis : verrouillage, pages qui glissent, applis qui s'ouvrent depuis leur icône · by yanis
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ecran = $('#ecran'), verrou = $('#verrou'), piste = $('#piste'), pages = $('#pages');
  const doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // l'heure, en haut et sur l'écran verrouillé
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const court = s => s.length > 4 ? s.slice(0, 4).replace(/[aeiouy]$/, '') + '.' : s;
  const tic = () => {
    const d = new Date(), h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0');
    $('#be-heure').textContent = `${h}:${m}`;
    $('#be-date').textContent = `${jours[d.getDay()].slice(0, 3)}. ${d.getDate()} ${court(mois[d.getMonth()])}`;
    $('#v-heure').textContent = `${h}:${m}`;
    $('#v-date').textContent = `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
    $('#ag-jour').textContent = `${jours[d.getDay()].slice(0, 3)}.`;
    $('#ag-num').textContent = d.getDate();
  };
  tic(); setInterval(tic, 5000);

  // sur un téléphone, la tablette devient un iphone : on parle alors de téléphone
  const enIphone = matchMedia('(max-width: 600px)');
  const mots = [
    ['.notif-msg', 'ma tablette', 'mon téléphone'],
    ['#deverrouiller .vh', 'Ouvrir la tablette', 'Ouvrir le téléphone'],
    ['.saut', 'Aller à la tablette', 'Aller au téléphone'],
    ['#app-photos .a-chapeau', 'de la tablette', 'du téléphone'],
    ['#app-safari .liste-titres li:first-child span', 'dans la tablette', 'dans le téléphone'],
  ];
  const etiquettes = ['#bouton-veille', '#eteindre', '#et-poignee', '.gestes'];
  const nommer = () => {
    const tel = enIphone.matches, [de, vers] = tel ? [1, 2] : [2, 1];
    mots.forEach(m => $$(m[0]).forEach(el => { el.textContent = el.textContent.replace(m[de], m[vers]); }));
    etiquettes.forEach(s => $$(s).forEach(el => el.setAttribute('aria-label', el.getAttribute('aria-label').replace(tel ? 'la tablette' : 'le téléphone', tel ? 'le téléphone' : 'la tablette'))));
    // la barre d'adresse de l'iphone est courte : le texte d'attente aussi
    $('#sf-url').placeholder = tel ? 'Rechercher' : 'Rechercher sur Google ou saisir un site';
    $('#spot-q').placeholder = tel ? 'Rechercher' : 'Rechercher : react, linux, support…';
  };
  nommer(); enIphone.addEventListener('change', nommer);

  // ---------------------------------------------------------------
  // déverrouiller : un toucher, un glissé vers le haut, ou entrée
  // ---------------------------------------------------------------
  ecran.classList.add('verrouille'); $('#accueil').inert = true;
  const deverrouiller = () => {
    if (!ecran.classList.contains('verrouille')) return;
    ecran.classList.remove('verrouille'); $('#accueil').inert = false;
    verrou.classList.add('part');
    setTimeout(() => { verrou.hidden = true; }, doux ? 0 : 600);
    setTimeout(() => ecran.focus({ preventScroll: true }), doux ? 0 : 450);
    devoiler();
  };
  let depart = null;
  verrou.addEventListener('pointerdown', e => { depart = e.clientY; });
  verrou.addEventListener('pointerup', e => {
    // un glissé vers le haut ouvre ; un simple toucher passe par le clic juste après
    if (depart !== null && depart - e.clientY > 30) deverrouiller();
    depart = null;
  });
  verrou.addEventListener('click', deverrouiller);
  // au doigt, le navigateur garde le glissé vers le haut pour faire défiler la page : on le reprend pour ouvrir
  let yDoigt = null;
  verrou.addEventListener('touchstart', e => { yDoigt = e.touches[0].clientY; }, { passive: true });
  verrou.addEventListener('touchmove', e => { if (yDoigt !== null && e.touches[0].clientY < yDoigt && e.cancelable) e.preventDefault(); }, { passive: false });
  addEventListener('keydown', e => {
    if (!ecran.classList.contains('verrouille')) return;
    // seulement sur l'écran lui-même : les liens, les boutons et l'espace de la page gardent leur rôle
    const ici = e.target === ecran || (e.target === document.body && e.key === 'Enter');
    if (ici && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp')) { e.preventDefault(); deverrouiller(); }
  });
  // la notification ouvre directement la conversation
  $('#notif').addEventListener('click', e => { e.stopPropagation(); deverrouiller(); setTimeout(() => ouvrir('messages', $('.dock [data-ouvre="messages"]')), doux ? 0 : 520); });
  // sur l'iphone, en bas de l'écran verrouillé : la lampe éclaire la table, l'appareil photo s'ouvre directement
  const lampe = $('#v-lampe');
  lampe.addEventListener('click', e => {
    e.stopPropagation();
    const oui = lampe.getAttribute('aria-pressed') !== 'true';
    lampe.setAttribute('aria-pressed', String(oui)); $('#ipad').classList.toggle('lampe', oui); navigator.vibrate?.(10);
  });
  $('#v-photo').addEventListener('click', e => { e.stopPropagation(); deverrouiller(); setTimeout(() => ouvrir('camera', $('.dock [data-ouvre="camera"]')), doux ? 0 : 520); });

  // ---------------------------------------------------------------
  // les pages de l'accueil : on glisse au doigt, à la souris ou au trackpad
  // ---------------------------------------------------------------
  const nb = $$('.page', piste).length, points = $$('#points button');
  let page = 0;
  const allerPage = (i, anime = true) => {
    page = Math.max(0, Math.min(nb - 1, i));
    piste.classList.toggle('glisse', !anime);
    piste.style.transform = `translateX(${-page * 100}%)`;
    points.forEach((p, j) => p.setAttribute('aria-selected', String(j === page)));
    $$('.page', piste).forEach((p, j) => p.inert = j !== page);
  };
  allerPage(0, false);
  // la première fois, l'accueil laisse voir le bord de la page 2 : on comprend qu'il y en a une
  let devoile = false;
  function devoiler() {
    if (devoile || doux) return; devoile = true;
    setTimeout(() => { if (page !== 0 || ouverte || !$('#spot').hidden) return; piste.style.transform = 'translateX(-8%)'; setTimeout(() => allerPage(0), 450); }, 900);
  }
  points.forEach((p, j) => p.addEventListener('click', () => allerPage(j)));
  let glisse = null;
  pages.addEventListener('pointerdown', e => {
    if (e.button !== 0 || ecran.classList.contains('edition')) return;
    glisse = { x: e.clientX, y: e.clientY, l: pages.clientWidth, actif: false, id: e.pointerId };
  });
  pages.addEventListener('pointermove', e => {
    // pendant qu'on déplace une icône, les pages ne bougent pas
    if (ecran.classList.contains('edition')) { glisse = null; return; }
    if (!glisse) return;
    const dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
    if (!glisse.actif && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { glisse.actif = true; pages.setPointerCapture(glisse.id); piste.classList.add('glisse'); }
    if (!glisse.actif) return;
    // au bord, ça résiste un peu, comme sur la vraie
    const bord = (page === 0 && dx > 0) || (page === nb - 1 && dx < 0) ? .35 : 1;
    piste.style.transform = `translateX(calc(${-page * 100}% + ${dx * bord}px))`;
  });
  const lacher = e => {
    if (!glisse) return;
    const dx = e.clientX - glisse.x, etait = glisse.actif;
    glisse = null;
    if (!etait) return;
    allerPage(dx < -60 ? page + 1 : dx > 60 ? page - 1 : page);
    // le clic qui suit un glissé ne doit pas ouvrir une appli
    const bloque = ev => { ev.stopPropagation(); ev.preventDefault(); };
    pages.addEventListener('click', bloque, { capture: true, once: true });
    setTimeout(() => pages.removeEventListener('click', bloque, { capture: true }), 50);
  };
  pages.addEventListener('pointerup', lacher);
  pages.addEventListener('pointercancel', lacher);
  let roue = 0;
  pages.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    e.preventDefault();
    const t = Date.now(); if (t - roue < 450) return; roue = t;
    allerPage(page + (e.deltaX > 0 ? 1 : -1));
  }, { passive: false });
  ecran.addEventListener('keydown', e => {
    if (ouverte || e.target.closest('.cc, .spot')) return;
    if (e.key === 'ArrowRight') allerPage(page + 1);
    if (e.key === 'ArrowLeft') allerPage(page - 1);
  });

  // ---------------------------------------------------------------
  // ouvrir une appli depuis son icône, et la refermer vers elle
  // ---------------------------------------------------------------
  const claires = ['orders', 'borne', 'support', 'parcours', 'photos', 'apropos', 'messages', 'safari'];
  let ouverte = null, source = null;
  function origine(el) {
    const r = el.getBoundingClientRect(), e = ecran.getBoundingClientRect();
    return [`${r.left + r.width / 2 - e.left}px`, `${r.top + r.height / 2 - e.top}px`];
  }
  function ouvrir(nom, depuis) {
    const a = $(`#app-${nom}`); if (!a || ouverte === a) return;
    if (ouverte) fermer(true);
    source = depuis || null;
    const [ox, oy] = source ? origine(source.querySelector('.app-ico') || source) : ['50%', '50%'];
    a.style.setProperty('--ox', ox); a.style.setProperty('--oy', oy);
    a.hidden = false; a.classList.add('ferme');
    const defile = $('.a-defile', a); if (defile) { defile.style.scrollBehavior = 'auto'; defile.scrollTop = 0; defile.style.scrollBehavior = ''; }
    a.classList.remove('defile', 'titre-parti');
    a.getBoundingClientRect();
    a.classList.remove('ferme');
    ouverte = a;
    ecran.classList.add('app-ouverte'); $('#accueil').inert = true;
    ecran.classList.toggle('app-claire', claires.includes(nom));
    // le focus va sur l'appli elle-même : le clavier part de là, sans cadre bleu sur le bouton retour au toucher
    a.tabIndex = -1; a.focus({ preventScroll: true });
    if (nom === 'messages') lancerConversation();
    if (nom === 'camera') demarrerCamera();
    $('#ipad').dataset.appli = nom;
  }
  function fermer(vite = false) {
    const a = ouverte; if (!a) return;
    ouverte = null;
    if (a.id === 'app-camera') arreterCamera();
    delete $('#ipad').dataset.appli;
    if (source) { const [ox, oy] = origine(source.querySelector('.app-ico') || source); a.style.setProperty('--ox', ox); a.style.setProperty('--oy', oy); }
    a.classList.add('ferme');
    ecran.classList.remove('app-ouverte', 'app-claire');
    setTimeout(() => { if (ouverte !== a) a.hidden = true; }, vite || doux ? 0 : 420);
    if (!ecran.classList.contains('verrouille')) $('#accueil').inert = false;
    source?.focus({ preventScroll: true });
  }
  $$('[data-ouvre]').forEach(b => b.addEventListener('click', () => ouvrir(b.dataset.ouvre, b)));
  $$('[data-ferme]').forEach(b => b.addEventListener('click', () => fermer()));
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#visionneuse').hidden) { fermerVisionneuse(); return; }
    if (ouverte) fermer();
  });
  // glisser la barre du bas vers le haut ferme l'appli, comme sur la vraie
  $$('.a-barre').forEach(b => {
    let y0 = null;
    b.addEventListener('pointerdown', e => { y0 = e.clientY; b.setPointerCapture(e.pointerId); });
    b.addEventListener('pointerup', e => { if (y0 !== null && y0 - e.clientY > 20) fermer(); y0 = null; });
  });

  // ---------------------------------------------------------------
  // dans les applis : contrôle segmenté, carrousels, photos
  // ---------------------------------------------------------------
  $$('.segments').forEach(seg => {
    const onglets = $$('[role="tab"]', seg);
    const choisir = t => onglets.forEach(o => {
      const oui = o === t;
      o.setAttribute('aria-selected', String(oui)); o.tabIndex = oui ? 0 : -1;
      $(`#${o.getAttribute('aria-controls')}`).hidden = !oui;
    });
    onglets.forEach((o, i) => {
      o.addEventListener('click', () => choisir(o));
      o.addEventListener('keydown', e => {
        const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { const n = onglets[(i + k + onglets.length) % onglets.length]; choisir(n); n.focus(); }
      });
    });
    choisir(onglets[0]);
  });
  $$('[data-carrousel]').forEach(c => {
    const p = $('.c-piste', c), figs = $$('figure', p), pts = $('.c-points', c);
    const prec = $('.c-prec', c), suiv = $('.c-suiv', c);
    figs.forEach(() => pts.append(document.createElement('i')));
    const pas = () => p.clientWidth + 14;
    const maj = () => {
      const i = Math.round(p.scrollLeft / pas());
      $$('i', pts).forEach((d, j) => d.classList.toggle('actif', j === i));
      prec.disabled = i <= 0; suiv.disabled = i >= figs.length - 1;
    };
    prec.addEventListener('click', () => p.scrollBy({ left: -pas(), behavior: 'smooth' }));
    suiv.addEventListener('click', () => p.scrollBy({ left: pas(), behavior: 'smooth' }));
    p.addEventListener('scroll', maj, { passive: true }); maj();
  });

  // la barre du haut des applis : floutée dès qu'on descend, le petit titre quand le grand est passé
  $$('.appli').forEach(a => {
    const d = $('.a-defile', a), t = $('.a-titre', a);
    if (!d || !t) return;
    d.addEventListener('scroll', () => {
      a.classList.toggle('defile', d.scrollTop > 4);
      a.classList.toggle('titre-parti', d.scrollTop > t.offsetTop + t.offsetHeight - 76);
    }, { passive: true });
  });

  const vis = $('#visionneuse'), visPiste = $('#vis-piste'), visLeg = $('#vis-legende'), grille = $('.grille-photos'), visSuppr = $('#vis-supprimer');
  const indexVis = () => Math.round(visPiste.scrollLeft / visPiste.clientWidth);
  const legende = () => {
    const img = $$('img', visPiste)[indexVis()];
    visLeg.textContent = img?.alt || '';
    visSuppr.hidden = !img?.dataset.perso;
  };
  visPiste.addEventListener('scroll', legende, { passive: true });
  function ouvrirVisionneuse(i) {
    visPiste.innerHTML = '';
    $$('button', grille).forEach(v => { const img = $('img', v).cloneNode(); img.loading = 'eager'; if (v.dataset.perso) img.dataset.perso = v.dataset.perso; visPiste.append(img); });
    vis.hidden = false;
    requestAnimationFrame(() => { visPiste.scrollTo({ left: i * visPiste.clientWidth, behavior: 'instant' }); legende(); });
    $('#vis-fermer').focus();
  }
  grille.addEventListener('click', e => { const b = e.target.closest('button'); if (b) ouvrirVisionneuse($$('button', grille).indexOf(b)); });
  function fermerVisionneuse() { const i = indexVis(); vis.hidden = true; $$('button', grille)[i]?.focus({ preventScroll: true }); }
  const visPas = k => visPiste.scrollBy({ left: k * visPiste.clientWidth, behavior: 'smooth' });
  $('.vis-prec').addEventListener('click', () => visPas(-1));
  $('.vis-suiv').addEventListener('click', () => visPas(1));
  vis.addEventListener('keydown', e => { if (e.key === 'ArrowRight') visPas(1); if (e.key === 'ArrowLeft') visPas(-1); });
  $('#vis-fermer').addEventListener('click', fermerVisionneuse);

  // ---------------------------------------------------------------
  // messages : yanis écrit, puis on lui répond par mail
  // ---------------------------------------------------------------
  const fil = $('#m-fil');
  let lancee = false;
  async function lancerConversation() {
    if (lancee) return; lancee = true;
    const bulles = $$('.bulle[data-attente]', fil);
    for (const b of bulles) {
      if (!b.hasAttribute('data-attente')) return;
      if (!doux) {
        const ecrit = document.createElement('p'); ecrit.className = 'bulle lui ecrit'; ecrit.innerHTML = '<i></i><i></i><i></i>';
        ecrit.setAttribute('aria-hidden', 'true');
        fil.append(ecrit); fil.scrollTop = fil.scrollHeight;
        await new Promise(r => setTimeout(r, 380 + Math.min(900, b.textContent.length * 9)));
        ecrit.remove();
        if (!b.hasAttribute('data-attente')) return;
      }
      b.removeAttribute('data-attente'); fil.append(b); fil.scrollTop = fil.scrollHeight;
    }
  }
  // si on écrit avant la fin, les messages de yanis arrivent d'un coup, avant le vôtre
  const toutAfficher = () => { $$('.bulle.ecrit', fil).forEach(n => n.remove()); $$('.bulle[data-attente]', fil).forEach(b => { b.removeAttribute('data-attente'); fil.append(b); }); };
  $('#m-saisie').addEventListener('submit', e => {
    e.preventDefault();
    const champ = $('#m-texte'), texte = champ.value.trim();
    if (!texte) { champ.focus(); return; }
    const b = document.createElement('p'); b.className = 'bulle moi'; b.textContent = texte;
    const st = document.createElement('p'); st.className = 'm-statut'; st.textContent = 'Ouverture de votre messagerie…';
    $$('.m-statut', fil).forEach(s => s.remove());
    toutAfficher();
    fil.append(b, st); fil.scrollTop = fil.scrollHeight; champ.value = '';
    setTimeout(() => {
      location.href = `mailto:yanis.ms@icloud.com?subject=${encodeURIComponent('Message depuis ton portfolio')}&body=${encodeURIComponent(texte)}`;
      st.textContent = 'Plus qu’à l’envoyer depuis votre messagerie. Rien ne s’ouvre ? Écrivez à yanis.ms@icloud.com';
    }, doux ? 0 : 650);
  });

  // ---------------------------------------------------------------
  // la vraie batterie et le vrai réseau de l'appareil qui regarde
  // ---------------------------------------------------------------
  const battTxt = $('#be-batt'), batt = $('#be-batterie'), ccBatt = $('#cc-batt'), ccRes = $('#cc-reseau'), wifi = $('#be-wifi');
  if (navigator.getBattery) navigator.getBattery().then(b => {
    const maj = () => {
      const pc = Math.round(b.level * 100);
      battTxt.textContent = `${pc} %`;
      batt.style.setProperty('--niveau', b.level);
      batt.classList.toggle('charge', b.charging); batt.classList.toggle('faible', b.level <= .2 && !b.charging);
      ccBatt.textContent = `Votre batterie : ${pc} %${b.charging ? ', en charge' : ''}`;
    };
    maj(); b.addEventListener('levelchange', maj); b.addEventListener('chargingchange', maj);
  }).catch(() => {});
  else ccBatt.textContent = 'Batterie : votre navigateur la garde pour lui';
  const reseau = () => {
    const ok = navigator.onLine;
    wifi.classList.toggle('hors-ligne', !ok);
    ccRes.textContent = ok ? 'En ligne' : 'Hors ligne';
  };
  reseau(); addEventListener('online', reseau); addEventListener('offline', reseau);

  // ---------------------------------------------------------------
  // le centre de contrôle : on le tire depuis le coin en haut à droite
  // ---------------------------------------------------------------
  const cc = $('#cc'), zone = $('#zone-cc');
  const ouvrirCC = () => { if (!cc.hidden) return; cc.hidden = false; zone.setAttribute('aria-expanded', 'true'); $('#cc-sombre').focus({ preventScroll: true }); mesurerPage(); };
  const fermerCC = () => { if (cc.hidden) return; cc.hidden = true; zone.setAttribute('aria-expanded', 'false'); zone.focus({ preventScroll: true }); };
  let yCC = null;
  zone.addEventListener('pointerdown', e => { yCC = e.clientY; zone.setPointerCapture(e.pointerId); });
  zone.addEventListener('pointermove', e => { if (yCC !== null && e.clientY - yCC > 24) { yCC = null; ouvrirCC(); } });
  zone.addEventListener('pointerup', () => { if (yCC !== null) ouvrirCC(); yCC = null; });
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrirCC(); } });
  cc.addEventListener('click', e => { if (e.target === cc) fermerCC(); });
  // le mode sombre, gardé pour la prochaine visite
  const sombre = $('#cc-sombre');
  const appliquerSombre = oui => { ecran.classList.toggle('sombre', oui); sombre.setAttribute('aria-pressed', String(oui)); try { localStorage.setItem('ym-sombre', oui ? '1' : '0'); } catch (_) {} };
  try { appliquerSombre(localStorage.getItem('ym-sombre') === '1' || (localStorage.getItem('ym-sombre') === null && matchMedia('(prefers-color-scheme: dark)').matches)); } catch (_) {}
  sombre.addEventListener('click', () => appliquerSombre(!ecran.classList.contains('sombre')));
  // la luminosité : un voile noir par-dessus tout l'écran
  const lum = $('#cc-lum'), voile = $('#voile-lum');
  const lumiere = () => { lum.style.setProperty('--v', `${(lum.value - lum.min) / (lum.max - lum.min) * 100}%`); voile.style.opacity = ((100 - lum.value) / 100 * 1.1).toFixed(3); };
  lum.addEventListener('input', lumiere); lumiere();
  // la rotation : la tablette passe en portrait, le contenu se remet en place tout seul
  const ipad = $('#ipad'), rot = $('#cc-rotation');
  rot.addEventListener('click', () => {
    const faire = () => { const oui = !ipad.classList.contains('portrait'); ipad.classList.toggle('portrait', oui); rot.setAttribute('aria-pressed', String(oui)); };
    fermerCC();
    document.startViewTransition && !doux ? document.startViewTransition(faire) : faire();
  });
  // le plein écran, le vrai
  const plein = $('#cc-plein');
  plein.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.(); else document.documentElement.requestFullscreen?.().catch(() => {});
  });
  document.addEventListener('fullscreenchange', () => plein.setAttribute('aria-pressed', String(!!document.fullscreenElement)));
  // la page se mesure elle-même
  function mesurerPage() {
    const nav = performance.getEntriesByType('navigation')[0], res = performance.getEntriesByType('resource');
    if (!nav) return;
    const poids = [nav, ...res].reduce((t, r) => t + (r.transferSize || r.encodedBodySize || 0), 0);
    $('#cc-mesure').textContent = `Chargée en ${Math.round(nav.loadEventEnd || nav.domContentLoadedEventEnd)} ms, ${Math.round(poids / 1024)} Ko en ${res.length + 1} requêtes.`;
  }

  // ---------------------------------------------------------------
  // la recherche : tout le texte de la tablette, sans accents ni majuscules
  // ---------------------------------------------------------------
  const spot = $('#spot'), q = $('#spot-q'), resultats = $('#spot-res');
  const sans = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const index = [];
  $$('.appli').forEach(a => {
    const nom = a.dataset.appli, titreAppli = $('.a-petit-titre', a)?.textContent || $('h2', a)?.textContent.trim() || nom;
    index.push({ titre: titreAppli, texte: $('.a-chapeau', a)?.textContent || '', appli: nom, el: null });
    $$('.liste > li, .carte, .c-piste figure, .bulle', a).forEach(el => {
      const t = el.querySelector('b, summary, time') || el;
      const titre = (el.matches('.c-piste figure') ? 'Capture' : t.textContent).trim();
      index.push({ titre: titre.slice(0, 80), texte: el.textContent.replace(/\s+/g, ' ').trim(), appli: nom, el });
    });
  });
  const icone = nom => { const ico = $(`.page [data-ouvre="${nom}"] .app-ico, .dock [data-ouvre="${nom}"] .app-ico`); return ico ? ico.cloneNode(true) : null; };
  const marquer = (texte, mots) => {
    const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const base = sans(texte);
    const zones = [];
    mots.forEach(m => { let i = base.indexOf(m); while (i >= 0) { zones.push([i, i + m.length]); i = base.indexOf(m, i + m.length); } });
    zones.sort((x, y) => x[0] - y[0]);
    let out = '', k = 0;
    zones.forEach(([a, b]) => { if (a < k) return; out += esc(texte.slice(k, a)) + '<mark>' + esc(texte.slice(a, b)) + '</mark>'; k = b; });
    return out + esc(texte.slice(k));
  };
  const extrait = (texte, mot) => { const i = sans(texte).indexOf(mot); const d = Math.max(0, i - 40); return (d ? '… ' : '') + texte.slice(d, d + 120); };
  let choix = 0, trouves = [];
  const chercher = () => {
    const mots = sans(q.value).split(/\s+/).filter(Boolean);
    resultats.innerHTML = ''; choix = 0;
    if (!mots.length) { trouves = []; return; }
    trouves = index.map(it => {
      const t = sans(it.titre), x = sans(it.texte);
      if (!mots.every(m => t.includes(m) || x.includes(m))) return null;
      return { it, score: mots.reduce((s, m) => s + (t.startsWith(m) ? 4 : t.includes(m) ? 2 : 1), 0) - (it.el ? 0 : -1) };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8).map(r => r.it);
    if (!trouves.length) { resultats.innerHTML = '<li class="spot-vide" role="presentation">Rien trouvé. Essayez « react », « linux » ou « support ».</li>'; return; }
    trouves.forEach((it, i) => {
      const li = document.createElement('li'); li.setAttribute('role', 'option'); li.id = `r-${i}`;
      const ico = icone(it.appli); if (ico) { ico.classList.add('r-ico'); ico.removeAttribute('aria-hidden'); ico.setAttribute('aria-hidden', 'true'); li.append(ico); } else li.append(document.createElement('span'));
      const txt = document.createElement('span');
      txt.innerHTML = `<b>${marquer(it.titre, mots)}</b><small>${marquer(extrait(it.texte, mots[0]), mots)}</small>`;
      const app = document.createElement('span'); app.className = 'r-app'; app.textContent = $(`#app-${it.appli} .a-petit-titre`)?.textContent || $(`#app-${it.appli} h2`)?.textContent || '';
      li.append(txt, app);
      li.addEventListener('click', () => aller(it));
      li.addEventListener('pointermove', () => selection(i));
      resultats.append(li);
    });
    selection(0);
  };
  const selection = i => {
    choix = i; $$('li[role="option"]', resultats).forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
    q.setAttribute('aria-activedescendant', `r-${i}`);
    $(`#r-${i}`)?.scrollIntoView({ block: 'nearest' });
  };
  const ouvrirSpot = () => { if (ecran.classList.contains('verrouille')) deverrouiller(); fermerCC(); spot.hidden = false; q.value = ''; resultats.innerHTML = ''; setTimeout(() => q.focus(), 30); };
  const fermerSpot = () => { spot.hidden = true; };
  $('#spot-annuler').addEventListener('click', fermerSpot);
  function aller(it) {
    fermerSpot();
    ouvrir(it.appli, $$(`.page [data-ouvre="${it.appli}"], .dock [data-ouvre="${it.appli}"]`).find(el => !el.closest('[inert]') && el.offsetParent));
    if (!it.el) return;
    setTimeout(() => {
      // si la ligne est dans un onglet caché ou un pli fermé, on l'ouvre d'abord
      const pan = it.el.closest('[role="tabpanel"]'); if (pan && pan.hidden) $(`[aria-controls="${pan.id}"]`)?.click();
      const pli = it.el.closest('details'); if (pli) pli.open = true;
      const fig = it.el.closest('.c-piste'); if (fig) fig.scrollTo({ left: it.el.offsetLeft - fig.offsetLeft, behavior: 'smooth' });
      const d = it.el.closest('.a-defile, .m-fil');
      if (d) d.scrollTo({ top: it.el.getBoundingClientRect().top - d.getBoundingClientRect().top + d.scrollTop - 110, behavior: 'smooth' });
      it.el.classList.remove('surligne'); void it.el.offsetWidth; it.el.classList.add('surligne');
    }, doux ? 0 : 480);
  }
  q.addEventListener('input', chercher);
  q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (trouves.length) selection((choix + 1) % trouves.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (trouves.length) selection((choix - 1 + trouves.length) % trouves.length); }
    if (e.key === 'Enter' && trouves[choix]) { e.preventDefault(); aller(trouves[choix]); }
  });
  spot.addEventListener('click', e => { if (e.target === spot) fermerSpot(); });
  $('#bouton-chercher').addEventListener('click', ouvrirSpot);
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); spot.hidden ? ouvrirSpot() : fermerSpot(); }
    if (e.key === 'Escape') { if (!spot.hidden) { e.stopImmediatePropagation(); fermerSpot(); } else if (!cc.hidden) { e.stopImmediatePropagation(); fermerCC(); } else if (ecran.classList.contains('edition')) finEdition(); }
  }, true);
  // glisser vers le bas sur l'accueil ouvre aussi la recherche, comme sur la vraie
  let ySpot = null;
  pages.addEventListener('pointerdown', e => { ySpot = e.clientY; });
  pages.addEventListener('pointerup', e => {
    if (ySpot !== null && e.clientY - ySpot > 70 && !ecran.classList.contains('edition')) {
      ouvrirSpot();
      // le clic qui suit le glissé ne doit pas ouvrir le widget dessous
      const bloque = ev => { ev.stopPropagation(); ev.preventDefault(); };
      pages.addEventListener('click', bloque, { capture: true, once: true });
      setTimeout(() => pages.removeEventListener('click', bloque, { capture: true }), 50);
    }
    ySpot = null;
  });

  // ---------------------------------------------------------------
  // l'appui long : les icônes tremblent et se déplacent, l'ordre est gardé
  // ---------------------------------------------------------------
  const cle = el => el.dataset.ouvre || el.getAttribute('href');
  const sauver = () => { try { localStorage.setItem('ym-ordre', JSON.stringify($$('.page', piste).map(p => $$(':scope > .app', p).map(cle)))); } catch (_) {} };
  try {
    const ordre = JSON.parse(localStorage.getItem('ym-ordre') || 'null');
    if (ordre) $$('.page', piste).forEach((p, i) => (ordre[i] || []).forEach(k => { const el = $$(':scope > .app', p).find(a => cle(a) === k); if (el) p.append(el); }));
  } catch (_) {}
  const finBtn = $('#fin-edition');
  const debutEdition = () => { if (ecran.classList.contains('edition')) return; ecran.classList.add('edition'); finBtn.hidden = false; navigator.vibrate?.(12); };
  function finEdition() { ecran.classList.remove('edition'); finBtn.hidden = true; sauver(); }
  finBtn.addEventListener('click', finEdition);
  let appui = null, porte = null;
  // en mode édition, un clic n'ouvre pas l'appli
  pages.addEventListener('click', e => { if (ecran.classList.contains('edition') && e.target.closest('.app')) { e.preventDefault(); e.stopPropagation(); } }, true);
  pages.addEventListener('pointerdown', e => {
    const app = e.target.closest('.page > .app'); if (!app || e.button !== 0) return;
    // à la souris, on bloque le glisser du navigateur : sinon safari attrape le lien et pas l'icône
    if (e.pointerType === 'mouse') e.preventDefault();
    if (ecran.classList.contains('edition')) { prendre(app, e); return; }
    appui = { x: e.clientX, y: e.clientY, t: setTimeout(() => { appui = null; debutEdition(); prendre(app, e); }, 520) };
  });
  pages.addEventListener('pointermove', e => {
    if (appui && Math.hypot(e.clientX - appui.x, e.clientY - appui.y) > 8) { clearTimeout(appui.t); appui = null; }
    if (porte) deplacer(e);
  });
  const relache = () => { if (appui) { clearTimeout(appui.t); appui = null; } if (porte) poser(); };
  pages.addEventListener('dragstart', e => e.preventDefault());
  pages.addEventListener('pointerup', relache); pages.addEventListener('pointercancel', relache);
  // au doigt le navigateur garde les glissés verticaux pour lui, on reprend ceux qui sont à nous
  let tDoigt = null;
  pages.addEventListener('touchstart', e => { tDoigt = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  pages.addEventListener('touchmove', e => {
    if (!tDoigt || !e.cancelable) return;
    // une icône portée après l'appui long : la page ne bouge pas
    if (porte) { e.preventDefault(); return; }
    // vers le bas avec la page tout en haut : c'est la recherche
    const dx = e.touches[0].clientX - tDoigt.x, dy = e.touches[0].clientY - tDoigt.y;
    const enHaut = scrollY <= 0 && (e.target.closest('.page')?.scrollTop || 0) <= 0;
    if (enHaut && dy > 0 && dy > Math.abs(dx) && !ecran.classList.contains('edition')) e.preventDefault();
  }, { passive: false });
  function prendre(app, e) {
    const r = app.getBoundingClientRect();
    porte = { app, dx: e.clientX - r.left, dy: e.clientY - r.top, id: e.pointerId };
    try { pages.setPointerCapture(e.pointerId); } catch (_) {}
    app.classList.add('porte'); app.classList.remove('pose');
    deplacer(e);
  }
  // l'icône suit le doigt ; quand elle passe sur une autre, elles échangent leur place en glissant (flip)
  function deplacer(e) {
    const { app } = porte, page = app.parentElement;
    const autres = $$(':scope > .app', page).filter(a => a !== app);
    const cible = autres.find(a => { const r = a.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
    if (cible) {
      const avant = new Map(autres.map(a => [a, a.getBoundingClientRect()]));
      const apres = [...page.children].indexOf(cible) > [...page.children].indexOf(app);
      page.insertBefore(app, apres ? cible.nextSibling : cible);
      autres.forEach(a => {
        const r0 = avant.get(a), r1 = a.getBoundingClientRect();
        if (r0.left === r1.left && r0.top === r1.top) return;
        a.animate([{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px)` }, { transform: 'none' }], { duration: doux ? 0 : 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }
    app.style.transform = 'none';
    const r = app.getBoundingClientRect();
    app.style.transform = `translate(${e.clientX - porte.dx - r.left}px, ${e.clientY - porte.dy - r.top}px)`;
  }
  function poser() {
    const { app } = porte; porte = null;
    app.classList.remove('porte'); app.classList.add('pose');
    app.style.transform = '';
    setTimeout(() => app.classList.remove('pose'), 300);
    sauver();
  }

  // ---------------------------------------------------------------
  // le fond d'écran suit la souris, ou l'inclinaison du téléphone
  // ---------------------------------------------------------------
  if (!doux) {
    let raf = 0, px = 0, py = 0;
    const poserVars = () => { raf = 0; ecran.style.setProperty('--px', px.toFixed(3)); ecran.style.setProperty('--py', py.toFixed(3)); };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = ecran.getBoundingClientRect();
      px = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2)));
      py = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2)));
      raf ||= requestAnimationFrame(poserVars);
    }, { passive: true });
    addEventListener('deviceorientation', e => {
      if (e.gamma === null) return;
      px = Math.max(-1, Math.min(1, e.gamma / 30)); py = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      raf ||= requestAnimationFrame(poserVars);
    });
  }

  // ---------------------------------------------------------------
  // les boutons de la tablette : veille et volume
  // ---------------------------------------------------------------
  function verrouiller() {
    if (ouverte) fermer(true);
    spot.hidden = true; cc.hidden = true; if (ecran.classList.contains('edition')) finEdition();
    verrou.hidden = false; verrou.classList.remove('part');
    ecran.classList.add('verrouille'); $('#accueil').inert = true;
  }
  const veille = $('#bouton-veille'), eteindre = $('#eteindre'), poignee = $('#et-poignee'), demarrage = $('#demarrage');
  let horsTension = false, appuiLong = false, tVeille = 0;
  // un appui court : veille ou réveil ; un appui long : le menu pour éteindre
  veille.addEventListener('pointerdown', () => {
    appuiLong = false;
    tVeille = setTimeout(() => { appuiLong = true; if (!horsTension) ouvrirEteindre(); }, 750);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => veille.addEventListener(t, () => clearTimeout(tVeille)));
  veille.addEventListener('click', () => {
    if (appuiLong) { appuiLong = false; return; }
    if (horsTension) { demarrer(); return; }
    if (!eteindre.hidden) { fermerEteindre(); return; }
    if (ecran.classList.contains('eteint')) { ecran.classList.remove('eteint'); return; }
    verrouiller(); ecran.classList.add('eteint');
  });
  // toucher l'écran en veille le rallume ; éteinte, il faut le bouton
  ecran.addEventListener('pointerdown', e => {
    if (!ecran.classList.contains('eteint')) return;
    e.stopPropagation(); e.preventDefault();
    if (!horsTension) ecran.classList.remove('eteint');
  }, true);
  function ouvrirEteindre() { eteindre.hidden = false; poignee.style.transform = ''; poignee.focus({ preventScroll: true }); navigator.vibrate?.(20); }
  function fermerEteindre() { eteindre.hidden = true; }
  $('#et-annuler').addEventListener('click', fermerEteindre);
  function couper() {
    fermerEteindre(); verrouiller();
    horsTension = true; ecran.classList.add('eteint');
  }
  function demarrer() {
    horsTension = false; demarrage.hidden = false; ecran.classList.remove('eteint');
    setTimeout(() => { demarrage.hidden = true; }, doux ? 300 : 2300);
  }
  // la poignée se glisse jusqu'au bout pour éteindre ; au clavier, entrée suffit
  let prisePoignee = null;
  poignee.addEventListener('pointerdown', e => { prisePoignee = { x: e.clientX, max: $('#et-curseur').clientWidth - poignee.offsetWidth - 10 }; poignee.classList.add('glisse'); poignee.setPointerCapture(e.pointerId); });
  poignee.addEventListener('pointermove', e => {
    if (!prisePoignee) return;
    const dx = Math.max(0, Math.min(prisePoignee.max, e.clientX - prisePoignee.x));
    poignee.style.transform = `translateX(${dx}px)`;
    $('.et-texte', eteindre).style.opacity = 1 - dx / prisePoignee.max;
  });
  const lacherPoignee = e => {
    if (!prisePoignee) return;
    const fin = e.clientX - prisePoignee.x >= prisePoignee.max * .9;
    prisePoignee = null; poignee.classList.remove('glisse'); $('.et-texte', eteindre).style.opacity = '';
    if (fin) couper(); else poignee.style.transform = '';
  };
  poignee.addEventListener('pointerup', lacherPoignee); poignee.addEventListener('pointercancel', lacherPoignee);
  poignee.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); couper(); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !eteindre.hidden) fermerEteindre(); });
  $('#cc-verrou').addEventListener('click', () => { fermerCC(); verrouiller(); });
  const hud = $('#hud-volume'), niveauEl = $('#hv-niveau');
  let volume = 8, hudT = 0;
  const regler = k => {
    volume = Math.max(0, Math.min(16, volume + k));
    niveauEl.style.width = `${volume / 16 * 100}%`;
    $('#hv-ondes').style.opacity = volume ? 1 : .2;
    $('#hv-texte').textContent = `Volume ${Math.round(volume / 16 * 100)} %`;
    hud.hidden = false; clearTimeout(hudT); hudT = setTimeout(() => { hud.hidden = true; }, 1400);
  };
  $('#bouton-volp').addEventListener('click', () => regler(1));
  $('#bouton-volm').addEventListener('click', () => regler(-1));

  // ---------------------------------------------------------------
  // safari : mes sites s'ouvrent dans la tablette, les autres dans un onglet
  // ---------------------------------------------------------------
  const sfCadre = $('#sf-cadre'), sfAccueil = $('#sf-accueil'), sfUrl = $('#sf-url'), sfProg = $('#sf-progres'), sfPrec = $('#sf-prec');
  // ces sites acceptent d'être affichés dans la tablette ; google aussi, grâce à igu=1. les autres partent dans un onglet
  const ACCEPTENT = ['habbozino.com', 'wikipedia.org', 'shawliiath.github.io'];
  const accepte = u => { const h = domaine(u); return ACCEPTENT.some(d => h === d || h.endsWith('.' + d)) || (h === 'google.com' && /[?&]igu=1/.test(u)); };
  const recherche = q => `https://www.google.com/search?igu=1&hl=fr&q=${encodeURIComponent(q)}`;
  const sfOnglet = $('#sf-onglet');
  const histo = [];
  function domaine(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (_) { return u; } }
  const courant = () => histo[histo.length - 1];
  const afficherAdresse = () => {
    const c = courant();
    sfUrl.value = !c ? '' : c.q || domaine(c.url);
    sfPrec.disabled = !histo.length; sfOnglet.disabled = !histo.length;
  };
  const toast = texte => { const t = document.createElement('p'); t.className = 'sf-toast'; t.textContent = texte; $('.sf-corps').append(t); setTimeout(() => t.remove(), 2600); };
  const montrer = quoi => { sfAccueil.hidden = quoi !== 'accueil'; sfCadre.hidden = quoi !== 'cadre'; };
  const externe = c => c.q ? `https://www.google.com/search?q=${encodeURIComponent(c.q)}` : c.url;
  function ouvrirOnglet(u) { window.open(u, '_blank', 'noopener'); toast('Ouvert dans un nouvel onglet'); }
  let chargements = 0;
  function chargerPage(entree, garder) {
    if (!accepte(entree.url)) { ouvrirOnglet(entree.url); afficherAdresse(); return; }
    if (garder) histo.push(entree);
    chargements = 0; $('.sf-astuce')?.remove();
    montrer('cadre');
    sfProg.classList.remove('fini'); void sfProg.offsetWidth; sfProg.classList.add('charge');
    sfCadre.src = entree.url;
    afficherAdresse();
  }
  function naviguer(texte, garder = true) {
    const u = texte.trim(); if (!u) return;
    if (/^https?:\/\//.test(u)) chargerPage({ url: u }, garder);
    else if (!/\s/.test(u) && /\.[a-z]{2,}(\/|$)/i.test(u)) chargerPage({ url: `https://${u}` }, garder);
    else chargerPage({ url: recherche(u), q: u }, garder);
  }
  // un lien cliqué dans la page change de site sans qu'on puisse le voir : si la page reste blanche, on propose l'onglet
  sfCadre.addEventListener('load', () => {
    if (!sfCadre.getAttribute('src')) return;
    chargements++;
    if (chargements < 2 || $('.sf-astuce')) return;
    const b = document.createElement('div'); b.className = 'sf-astuce';
    b.innerHTML = '<span>Page blanche ? Ce site refuse d’être affiché dans une autre page.</span><button type="button">Ouvrir dans un onglet</button><button type="button" class="sf-astuce-x" aria-label="Fermer">×</button>';
    b.querySelector('button').addEventListener('click', () => { const c = courant(); if (c) ouvrirOnglet(externe(c)); b.remove(); });
    b.querySelector('.sf-astuce-x').addEventListener('click', () => b.remove());
    $('.sf-corps').append(b);
  });
  sfOnglet.addEventListener('click', () => { const c = courant(); if (c) ouvrirOnglet(externe(c)); });
  sfCadre.addEventListener('load', () => { if (!sfCadre.src) return; sfProg.classList.remove('charge'); sfProg.classList.add('fini'); });
  $$('.sf-fav[data-url]').forEach(f => f.addEventListener('click', () => naviguer(f.dataset.url)));
  $('#sf-form').addEventListener('submit', e => { e.preventDefault(); naviguer(sfUrl.value); sfUrl.blur(); });
  sfUrl.addEventListener('focus', () => { const c = courant(); if (c && !c.q) sfUrl.value = c.url; sfUrl.select(); });
  sfUrl.addEventListener('blur', afficherAdresse);
  sfPrec.addEventListener('click', () => {
    histo.pop();
    const c = courant();
    if (!c) { sfCadre.removeAttribute('src'); montrer('accueil'); afficherAdresse(); }
    else chargerPage(c, false);
  });
  $('#sf-recharger').addEventListener('click', () => { const c = courant(); if (c) chargerPage(c, false); });

  // ---------------------------------------------------------------
  // l'appareil photo : la vraie caméra, les photos gardées sur l'appareil (indexeddb)
  // ---------------------------------------------------------------
  const video = $('#cam-video'), camMsg = $('#cam-message'), declencheur = $('#cam-declencheur'), vignette = $('#cam-vignette'), derniere = $('#cam-derniere'), retourner = $('#cam-retourner');
  let flux = null, face = 'user';
  // les photos ne vivent qu'en mémoire : rien n'est envoyé ni enregistré, tout disparaît au rechargement
  // (on efface aussi la petite base qu'une version d'essai avait pu laisser dans le navigateur)
  try { indexedDB.deleteDatabase('ym-tablette'); } catch (_) {}
  let numero = 0;
  function ajouterGalerie(id, blob, date) {
    const url = URL.createObjectURL(blob);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'perso'; b.dataset.perso = id;
    const img = new Image(); img.src = url; img.alt = `Votre photo, ${new Date(date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}`;
    b.append(img);
    grille.prepend(b);
    return url;
  }
  const majVignette = url => { derniere.src = url; derniere.hidden = false; vignette.disabled = false; vignette.classList.remove('nouvelle'); void vignette.offsetWidth; vignette.classList.add('nouvelle'); };
  async function demarrerCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { montrerMsg('Ce navigateur ne donne pas accès à la caméra.'); return; }
    try {
      arreterCamera();
      flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: face, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      if (ouverte?.id !== 'app-camera') { arreterCamera(); return; }
      video.srcObject = flux; video.classList.toggle('miroir', face === 'user');
      camMsg.hidden = true; declencheur.disabled = false;
      const cams = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
      retourner.disabled = cams.length < 2;
    } catch (e) {
      montrerMsg(e.name === 'NotAllowedError' ? 'La caméra est refusée. Autorisez-la dans votre navigateur pour prendre une photo.' : 'Pas de caméra disponible sur cet appareil.', e.name === 'NotAllowedError');
    }
  }
  function montrerMsg(t, reessayer = false) {
    camMsg.textContent = t;
    if (reessayer) { const r = document.createElement('button'); r.type = 'button'; r.className = 'cam-reessayer'; r.textContent = 'Réessayer'; r.addEventListener('click', demarrerCamera); camMsg.append(r); }
    camMsg.hidden = false; declencheur.disabled = true; retourner.disabled = true;
  }
  function arreterCamera() { flux?.getTracks().forEach(t => t.stop()); flux = null; video.srcObject = null; }
  retourner.addEventListener('click', () => { face = face === 'user' ? 'environment' : 'user'; demarrerCamera(); });
  declencheur.addEventListener('click', async () => {
    if (!flux || !video.videoWidth) return;
    // l'image est prise à la taille réelle de la caméra, dans le même sens que l'aperçu
    const cv = document.createElement('canvas'); cv.width = video.videoWidth; cv.height = video.videoHeight;
    const ctx = cv.getContext('2d');
    if (face === 'user') { ctx.translate(cv.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0);
    const flash = $('#cam-flash'); flash.classList.remove('clic'); void flash.offsetWidth; flash.classList.add('clic');
    navigator.vibrate?.(15);
    const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .88));
    majVignette(ajouterGalerie(`photo-${++numero}`, blob, Date.now()));
    $('#cam-annonce').textContent = 'Photo ajoutée à la galerie';
  });
  vignette.addEventListener('click', () => ouvrir('photos', $('.dock [data-ouvre="photos"]')));
  visSuppr.addEventListener('click', () => {
    const img = $$('img', visPiste)[indexVis()]; if (!img?.dataset.perso) return;
    const id = img.dataset.perso;
    const b = $(`.grille-photos [data-perso="${id}"]`);
    if (b) { URL.revokeObjectURL($('img', b).src); b.remove(); }
    const reste = $$('.grille-photos .perso img')[0];
    if (reste) derniere.src = reste.src; else { derniere.hidden = true; vignette.disabled = true; }
    fermerVisionneuse();
  });

  // ---------------------------------------------------------------
  // autour de l'appareil : la phrase qui s'allume, les captures qui s'ouvrent, l'appareil qui recule
  // ---------------------------------------------------------------
  const allumes = $$('.allume'), vitrines = $$('.vitrine img'), ipadEl = $('#ipad');
  if (!doux) allumes.forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map(m => `<span>${m}</span>`).join(' '); el.classList.add('pret'); });
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  let rafPage = 0;
  const majPage = () => {
    rafPage = 0;
    const vh = innerHeight;
    // mot à mot : la phrase est entièrement allumée quand elle arrive au tiers haut de l'écran
    if (!doux) allumes.forEach(el => {
      const r = el.getBoundingClientRect(), mots = el.children;
      const p = borne((vh * .9 - r.top) / (r.height + vh * .45), 0, 1), n = Math.round(p * mots.length);
      for (let i = 0; i < mots.length; i++) mots[i].classList.toggle('on', i < n);
    });
    vitrines.forEach(img => { const r = img.getBoundingClientRect(); img.style.setProperty('--p', borne((vh - r.top) / (vh * .75), 0, 1).toFixed(3)); });
    // sur grand écran, l'appareil recule et s'assombrit un peu quand on le quitte
    if (!doux && innerWidth > 600) {
      const r = ipadEl.getBoundingClientRect(), q = borne(-r.top / (r.height * .9), 0, 1);
      ipadEl.style.scale = (1 - q * .08).toFixed(4);
      ipadEl.style.filter = q ? `brightness(${(1 - q * .45).toFixed(3)})` : '';
    }
  };
  addEventListener('scroll', () => { rafPage ||= requestAnimationFrame(majPage); }, { passive: true });
  addEventListener('resize', () => { rafPage ||= requestAnimationFrame(majPage); });
  majPage();

  // ---------------------------------------------------------------
  // autour de la tablette : le halo suit l'écran, les phrases montent quand on descend
  // ---------------------------------------------------------------
  new MutationObserver(() => $('#ipad').classList.toggle('eteinte', ecran.classList.contains('eteint'))).observe(ecran, { attributes: true, attributeFilter: ['class'] });
  const aReveler = $$('.phrase, .final h2, .final-sous, .final-liens');
  aReveler.forEach(el => el.classList.add('revele'));
  if ('IntersectionObserver' in window && !doux) {
    const vu = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); vu.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    aReveler.forEach(el => vu.observe(el));
  } else aReveler.forEach(el => el.classList.add('vu'));
})();
