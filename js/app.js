/* ============================================================
   LINK ESTUDIANTIL — app.js
   Header/footer compartidos, sesión de usuario (localStorage),
   componentes (carrusel, modal, toast, acordeón) y lógica
   de cada página.
   ============================================================ */

/* ------------------------------------------------------------
   1. Utilidades
------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const Store = {
  key: (k) => 'le.' + k,
  get(k, fallback = null) {
    try { const v = localStorage.getItem(Store.key(k)); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem(Store.key(k), JSON.stringify(v)); return true; }
    catch (e) { return false; }
  },
  del(k) { try { localStorage.removeItem(Store.key(k)); } catch (e) {} }
};

const Auth = {
  actual() { return Store.get('sesion'); },
  registrados() { return Store.get('usuarios', []); },
  todos() { return DATA.usuarios.concat(Auth.registrados()); },
  entrar(correo, clave) {
    const u = Auth.todos().find(x => x.correo.toLowerCase() === correo.toLowerCase().trim() && x.clave === clave);
    if (!u) return null;
    const { clave: _, ...seguro } = u;
    Store.set('sesion', seguro);
    return seguro;
  },
  registrar(datos) {
    if (Auth.todos().some(u => u.correo.toLowerCase() === datos.correo.toLowerCase())) return { error: 'Ese correo ya tiene una cuenta. Inicia sesión.' };
    const nuevo = {
      id: 'u' + Date.now(), verificado: false, codigo: String(Date.now()).slice(-11),
      bio: datos.rol === 'tutor' ? 'Nuevo tutor en Link Estudiantil.' : 'Nuevo estudiante en Link Estudiantil.',
      foto: 'assets/usuarios/nuevo.jpg', ...datos
    };
    const lista = Auth.registrados(); lista.push(nuevo); Store.set('usuarios', lista);
    const { clave: _, ...seguro } = nuevo;
    Store.set('sesion', seguro);
    return { ok: seguro };
  },
  salir() { Store.del('sesion'); location.href = R('index.html'); }
};

const iniciales = (nombre = '') => nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
const estrellas = (n) => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));
const param = (k) => new URLSearchParams(location.search).get(k);

/* --- Rutas: index.html vive en la raíz y el resto en /pages --- */
const EN_PAGES = /\/pages\//.test(location.pathname);
/* R('tutores.html') -> 'pages/tutores.html' desde la raíz, 'tutores.html' desde /pages */
const R = (archivo) => archivo === 'index.html'
  ? (EN_PAGES ? '../index.html' : 'index.html')
  : (EN_PAGES ? archivo : 'pages/' + archivo);
/* A('assets/x.jpg') -> '../assets/x.jpg' desde /pages */
const A = (ruta) => (EN_PAGES ? '../' + ruta : ruta);

/* ------------------------------------------------------------
   2. Íconos (SVG inline, sin librerías externas)
------------------------------------------------------------ */
const I = (d, extra = '') => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const ICONS = {
  menu:   I('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'),
  home:   I('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  users:  I('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  user:   I('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  book:   I('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  bell:   I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  cal:    I('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  search: I('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  help:   I('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  image:  I('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', 'width="18" height="18"'),
  chevR:  I('<polyline points="9 18 15 12 9 6"/>', 'width="16" height="16"'),
  chevL:  I('<polyline points="15 18 9 12 15 6"/>', 'width="16" height="16"'),
  chevD:  I('<polyline points="6 9 12 15 18 9"/>', 'width="18" height="18"'),
  check:  I('<polyline points="20 6 9 17 4 12"/>'),
  plus:   I('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  logout: I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'),
  clock:  I('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 'width="16" height="16"'),
  pin:    I('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', 'width="16" height="16"'),
  mail:   I('<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>'),
  down:   I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>', 'width="18" height="18"'),
  play:   I('<polygon points="5 3 19 12 5 21 5 3"/>', 'width="16" height="16"'),
  spark:  I('<path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/>', 'width="16" height="16"')
};

/* Placeholder bonito para imágenes que aún no existen en /assets */
function ph(img, label, clase = '') {
  return `<div class="ph ${clase}" data-img="${A(img)}" role="img" aria-label="${label}">
      <span class="ph__icon">${ICONS.image}</span><span class="ph__label">${label}</span>
    </div>`;
}
function cargarImagenes(ctx = document) {
  $$('[data-img]', ctx).forEach(nodo => {
    const src = nodo.dataset.img;
    if (!src) return;
    const test = new Image();
    test.onload = () => { nodo.style.backgroundImage = `url('${src}')`; nodo.classList.add('is-loaded'); };
    test.src = src;
  });
}

/* ------------------------------------------------------------
   2b. Validación de formularios con mensajes concretos
   (cada mensaje dice QUÉ pasó y QUÉ hacer, no solo "campo inválido")
------------------------------------------------------------ */
function errorCampo(input, mensaje) {
  const grupo = input.closest('.form-group') || input.parentElement;
  grupo.classList.add('has-error');
  input.setAttribute('aria-invalid', 'true');
  let p = grupo.querySelector('.field-error');
  if (!p) {
    p = document.createElement('p');
    p.className = 'field-error';
    p.id = (input.id || 'campo') + '-error';
    p.setAttribute('role', 'alert');
    grupo.appendChild(p);
  }
  p.textContent = mensaje;
  input.setAttribute('aria-describedby', p.id);
  return false;
}
function limpiarErrores(form) {
  $$('.has-error', form).forEach(g => g.classList.remove('has-error'));
  $$('.field-error', form).forEach(p => p.remove());
  $$('[aria-invalid]', form).forEach(i => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
  const g = $('.error-message', form); if (g) { g.textContent = ''; g.classList.add('hidden'); }
}
function errorGeneral(form, mensaje) {
  const g = $('.error-message', form);
  if (g) { g.textContent = mensaje; g.classList.remove('hidden'); g.setAttribute('role', 'alert'); }
  return false;
}
/* Devuelve el problema exacto del correo, o null si está bien */
function problemaCorreo(v) {
  v = (v || '').trim();
  if (!v) return 'Escribe tu correo para continuar.';
  if (/\s/.test(v)) return 'El correo no puede llevar espacios. Bórralos e inténtalo de nuevo.';
  if (!v.includes('@')) return 'Al correo le falta el signo @. Debe verse así: nombre@correo.com';
  const partes = v.split('@');
  if (partes.length > 2) return 'El correo tiene más de un signo @. Deja solo uno.';
  const [usuario, dominio] = partes;
  if (!usuario) return 'Falta el nombre antes del @. Debe verse así: nombre@correo.com';
  if (!dominio) return 'Falta el dominio después del @. Debe verse así: nombre@correo.com';
  if (!dominio.includes('.')) return 'Al dominio "' + dominio + '" le falta la terminación (.com, .edu, .ec…).';
  if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(v)) return 'Revisa el correo: tiene caracteres que no se permiten.';
  return null;
}
/* Enfoca el primer campo con error para que el usuario no lo busque */
function enfocarPrimerError(form) {
  const primero = $('[aria-invalid="true"]', form);
  if (primero) primero.focus();
}

/* ------------------------------------------------------------
   3. Header, menú lateral, tabbar y footer
------------------------------------------------------------ */
const NAV_PUBLICO = [
  { href: 'index.html',    txt: 'Inicio',   ico: 'home'  },
  { href: 'tutores.html',  txt: 'Tutores',  ico: 'users' },
  { href: 'cursos.html',   txt: 'Cursos',   ico: 'book'  },
  { href: 'ayuda.html',    txt: 'Ayuda',    ico: 'help'  }
];
const NAV_PRIVADO = [
  { href: 'inicio.html',         txt: 'Menú',     ico: 'home'  },
  { href: 'tutores.html',        txt: 'Tutores',  ico: 'users' },
  { href: 'cursos.html',         txt: 'Cursos',   ico: 'book'  },
  { href: 'sesiones.html',       txt: 'Sesiones', ico: 'cal'   },
  { href: 'notificaciones.html', txt: 'Mensajes', ico: 'bell'  }
];
const TABBAR = (auth) => auth
  ? [{ href: 'inicio.html', txt: 'Menú', ico: 'home' }, { href: 'tutores.html', txt: 'Tutores', ico: 'users' },
     { href: 'sesiones.html', txt: 'Sesiones', ico: 'cal' }, { href: 'notificaciones.html', txt: 'Mensajes', ico: 'bell' },
     { href: 'perfil.html', txt: 'Perfil', ico: 'user' }]
  : [{ href: 'index.html', txt: 'Inicio', ico: 'home' }, { href: 'tutores.html', txt: 'Tutores', ico: 'users' },
     { href: 'cursos.html', txt: 'Cursos', ico: 'book' }, { href: 'ayuda.html', txt: 'Ayuda', ico: 'help' },
     { href: 'login.html', txt: 'Entrar', ico: 'user' }];

const archivoActual = () => location.pathname.split('/').pop() || 'index.html';

function montarHeader() {
  const cont = $('#site-header'); if (!cont) return;
  const u = Auth.actual();
  const nav = u ? NAV_PRIVADO : NAV_PUBLICO;
  const aqui = archivoActual();
  const sinLeer = u ? DATA.mensajes.filter(m => !m.leido).length : 0;

  cont.innerHTML = `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="app-header">
    <div class="header-inner">
      <a class="brand" href="${u ? R('inicio.html') : R('index.html')}" aria-label="Link Estudiantil, ir al inicio">
        <span class="brand-logo"></span>
        <span class="logo-text">Link<span>Estudiantil</span></span>
      </a>

      <nav class="main-nav" aria-label="Navegación principal">
        ${nav.map(n => `<a class="nav-link ${aqui === n.href ? 'is-active' : ''}" href="${R(n.href)}" ${aqui === n.href ? 'aria-current="page"' : ''}>${ICONS[n.ico]}<span>${n.txt}</span></a>`).join('')}
      </nav>

      <div class="header-actions">
        <button class="nav-icon" type="button" id="btn-drawer" aria-label="Abrir menú" aria-expanded="false">${ICONS.menu}</button>
        ${u ? `
          <a class="nav-icon" href="${R('notificaciones.html')}" aria-label="Mensajes">${ICONS.bell}${sinLeer ? '<span class="dot-badge"></span>' : ''}</a>
          <a class="nav-icon ${aqui === 'perfil.html' ? 'is-active' : ''}" href="${R('perfil.html')}" aria-label="Mi perfil">${ICONS.user}</a>
        ` : `
          <a class="btn btn-outline btn-sm" href="${R('login.html')}">Iniciar sesión</a>
          <a class="btn btn-primary btn-sm" href="${R('registro.html')}">Crear cuenta</a>
        `}
      </div>
    </div>
  </header>

  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <aside class="drawer" id="drawer" aria-label="Menú lateral">
    <div class="spread">
      <span class="brand"><span class="brand-logo"></span><span class="logo-text">Link<span>Estudiantil</span></span></span>
      <button class="nav-icon" id="btn-drawer-close" type="button" aria-label="Cerrar menú">✕</button>
    </div>

    ${u ? `<div class="row" style="gap:.6rem;margin-top:.5rem">
        <span class="avatar-placeholder">${iniciales(u.nombre)}</span>
        <span><strong>${u.nombre}</strong><br><span class="hint">${u.rol}</span></span>
      </div>` : ''}

    <p class="drawer-section-label">Navegación</p>
    <nav class="drawer-nav">
      ${nav.map(n => `<a class="nav-link ${aqui === n.href ? 'is-active' : ''}" href="${R(n.href)}">${ICONS[n.ico]}<span>${n.txt}</span></a>`).join('')}
    </nav>

    <p class="drawer-section-label">${u ? 'Mi cuenta' : 'Empieza aquí'}</p>
    <nav class="drawer-nav">
      ${u ? `
        <a class="nav-link" href="${R('perfil.html')}">${ICONS.user}<span>Mi perfil</span></a>
        <a class="nav-link" href="${R('publicar.html')}">${ICONS.plus}<span>Publicar tutoría</span></a>
        <a class="nav-link" href="${R('confianza.html')}">${ICONS.shield}<span>Confianza y verificación</span></a>
        <a class="nav-link" href="${R('ayuda.html')}">${ICONS.help}<span>Ayuda</span></a>
        <button class="nav-link" id="btn-salir" type="button" style="border:none;background:none;cursor:pointer;width:100%">${ICONS.logout}<span>Cerrar sesión</span></button>
      ` : `
        <a class="nav-link" href="${R('login.html')}">${ICONS.user}<span>Iniciar sesión</span></a>
        <a class="nav-link" href="${R('registro.html')}">${ICONS.plus}<span>Crear cuenta</span></a>
        <a class="nav-link" href="${R('confianza.html')}">${ICONS.shield}<span>Confianza y verificación</span></a>
      `}
    </nav>
  </aside>`;

  const drawer = $('#drawer'), backdrop = $('#drawer-backdrop'), btn = $('#btn-drawer');
  const abrir = (v) => {
    drawer.classList.toggle('is-open', v); backdrop.classList.toggle('is-open', v);
    btn.setAttribute('aria-expanded', String(v));
    document.body.style.overflow = v ? 'hidden' : '';
  };
  btn.addEventListener('click', () => abrir(!drawer.classList.contains('is-open')));
  backdrop.addEventListener('click', () => abrir(false));
  $('#btn-drawer-close').addEventListener('click', () => abrir(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') abrir(false); });
  const salir = $('#btn-salir'); if (salir) salir.addEventListener('click', Auth.salir);
}

function montarTabbar() {
  const cont = $('#site-tabbar'); if (!cont) return;
  const u = Auth.actual(); const aqui = archivoActual();
  cont.innerHTML = `<nav class="mobile-tabbar" aria-label="Navegación inferior">
    ${TABBAR(u).map(n => `<a class="tabbar-link ${aqui === n.href ? 'is-active' : ''}" href="${R(n.href)}" ${aqui === n.href ? 'aria-current="page"' : ''}>${ICONS[n.ico]}<span>${n.txt}</span></a>`).join('')}
  </nav>`;
}

function montarFooter() {
  const cont = $('#site-footer'); if (!cont) return;
  const redes = [
    ['Instagram', 'https://www.instagram.com'], ['Facebook', 'https://www.facebook.com'],
    ['X', 'https://x.com'], ['LinkedIn', 'https://www.linkedin.com'],
    ['YouTube', 'https://www.youtube.com'], ['TikTok', 'https://www.tiktok.com']
  ];
  cont.innerHTML = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <span class="brand"><span class="brand-logo"></span><span class="logo-text">Link<span>Estudiantil</span></span></span>
        <p style="margin-top:.75rem;max-width:34ch">Conectamos estudiantes con tutores verificados. Reserva una sesión, sigue tu curso y aprende a tu ritmo.</p>
        <div class="social-links" style="margin-top:1rem">
          ${redes.map(([nombre, url]) => `<a class="social-link" href="${url}" target="_blank" rel="noopener" title="Link Estudiantil en ${nombre}"><span aria-hidden="true">${nombre[0]}</span><span class="sr-only">Link Estudiantil en ${nombre}</span></a>`).join('')}
        </div>
      </div>
      <div>
        <h3>Plataforma</h3>
        <a href="${R('tutores.html')}">Buscar tutores</a>
        <a href="${R('cursos.html')}">Cursos</a>
        <a href="${R('sesiones.html')}">Sesiones</a>
        <a href="${R('publicar.html')}">Publicar tutoría</a>
      </div>
      <div>
        <h3>Cuenta</h3>
        <a href="${R('login.html')}">Iniciar sesión</a>
        <a href="${R('registro.html')}">Crear cuenta</a>
        <a href="${R('perfil.html')}">Mi perfil</a>
        <a href="${R('confianza.html')}">Verificación</a>
      </div>
      <div>
        <h3>Soporte</h3>
        <a href="${R('ayuda.html')}">Centro de ayuda</a>
        <a href="${R('ayuda.html')}#contacto">Contacto</a>
        <a href="${R('ayuda.html')}#faq">Preguntas frecuentes</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Link Estudiantil · Proyecto académico PUCE</span>
      <span>Brandon Lozano · Alisson Mediavilla · Christopher Villagómez</span>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------
   4. Componentes reutilizables
------------------------------------------------------------ */
function toast(msg, tipo = '') {
  let stack = $('.toast-stack');
  if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.setAttribute('aria-live', 'polite'); document.body.appendChild(stack); }
  const t = document.createElement('div');
  t.className = 'toast ' + (tipo ? 'toast--' + tipo : '');
  t.setAttribute('role', 'status');
  t.innerHTML = `${tipo === 'ok' ? ICONS.check : ICONS.spark}<span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; }, 2600);
  setTimeout(() => t.remove(), 3100);
}

function abrirModal(titulo, contenidoHTML, textoBoton = 'Entendido', alConfirmar) {
  let back = $('#modal-back');
  if (!back) {
    back = document.createElement('div');
    back.id = 'modal-back'; back.className = 'modal-backdrop';
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(back);
    back.addEventListener('click', e => { if (e.target === back) back.classList.remove('is-open'); });
  }
  $('.modal', back).innerHTML = `
    <div class="spread"><h3>${titulo}</h3><button class="nav-icon" id="modal-x" aria-label="Cerrar">✕</button></div>
    <div style="margin:1rem 0">${contenidoHTML}</div>
    <div class="row" style="justify-content:flex-end">
      <button class="btn btn-outline" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-ok">${textoBoton}</button>
    </div>`;
  back.classList.add('is-open');
  cargarImagenes(back);
  const cerrar = () => back.classList.remove('is-open');
  $('#modal-x').onclick = cerrar;
  $('#modal-cancel').onclick = cerrar;
  $('#modal-ok').onclick = () => { cerrar(); if (alConfirmar) alConfirmar(); };
}

function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-visible')); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
}

function initContadores() {
  $$('[data-count]').forEach(nodo => {
    const fin = parseFloat(nodo.dataset.count); const suf = nodo.dataset.suffix || '';
    let inicio = null;
    const paso = (t) => {
      if (!inicio) inicio = t;
      const p = Math.min((t - inicio) / 1200, 1);
      nodo.textContent = Math.floor(fin * p).toLocaleString('es-EC') + suf;
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}

function initCarruseles() {
  $$('.carousel').forEach(car => {
    const track = $('.carousel-track', car);
    const mover = (dir) => track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: 'smooth' });
    const prev = $('.carousel-btn--prev', car), next = $('.carousel-btn--next', car);
    if (prev) prev.addEventListener('click', () => mover(-1));
    if (next) next.addEventListener('click', () => mover(1));
  });
}

function initAcordeones() {
  $$('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const abierto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!abierto));
      const panel = btn.nextElementSibling;
      if (panel) panel.classList.toggle('hidden', abierto);
    });
  });
}

function initProgreso() {
  $$('.progress-circle').forEach(c => {
    const v = parseInt(c.dataset.progress || '0', 10);
    c.classList.toggle('is-complete', v >= 100);
    $('.progress-value', c) && ($('.progress-value', c).textContent = v + '%');
    setTimeout(() => c.style.setProperty('--progress', v), 120);
  });
  $$('.progress-bar > span').forEach(b => {
    setTimeout(() => { b.style.width = (b.dataset.value || 0) + '%'; }, 150);
  });
}

/* Tarjetas reutilizables ------------------------------------ */
function cardTutor(t) {
  return `<a class="card tutor-card" href="${R('tutor.html')}?id=${t.id}">
    <div class="card-image-wrapper">${ph(t.img, t.nombre)}</div>
    <p class="card-title">${t.titulo}</p>
    <p class="card-subtitle">${t.nombre}${t.verificado ? ' ✓' : ''}</p>
    <p class="star-rating">${estrellas(t.rating)} <span class="hint">${t.rating}</span></p>
    <div class="card-meta"><span class="chip chip--gray">${t.modalidad}</span><span class="price">$${t.precio}/h</span></div>
  </a>`;
}
function cardCurso(c) {
  return `<a class="card" href="${R('curso.html')}?id=${c.id}">
    <div class="card-image-wrapper">${ph(c.img, c.materia, 'ph--wide')}</div>
    <p class="card-title" style="white-space:normal">${c.titulo}</p>
    <p class="card-subtitle">${c.tutor}</p>
    <div class="card-meta">
      <span class="hint">${c.lecciones} lecciones · ${c.horas} h</span>
      <span class="price">$${c.precio}</span>
    </div>
  </a>`;
}
function itemCursoLista(c) {
  const completo = c.progreso >= 100;
  return `<a class="course-item" href="${R('curso.html')}?id=${c.id}">
    <span class="course-thumb">${ph(c.img, c.materia)}</span>
    <span class="course-info">
      <span class="course-title">${c.titulo}</span>
      <span class="course-teacher">${c.tutor}</span>
    </span>
    <span class="course-arrow">${ICONS.chevR}</span>
    <span class="progress-wrap">
      <span class="progress-circle" data-progress="${c.progreso}"><span class="progress-value">0%</span></span>
      <span class="progress-label">${completo ? 'Completado' : c.estado}</span>
    </span>
  </a>`;
}

/* ------------------------------------------------------------
   5. Páginas
------------------------------------------------------------ */
const Paginas = {

  /* ---------- Landing ---------- */
  landing() {
    $('#materias-marquee') && ($('#materias-marquee').innerHTML =
      DATA.materias.concat(DATA.materias).map(m => `<span class="marquee-item">${m.nombre}</span>`).join(''));

    $('#tutores-destacados') && ($('#tutores-destacados').innerHTML =
      DATA.tutores.slice(0, 6).map(cardTutor).join(''));

    $('#cursos-destacados') && ($('#cursos-destacados').innerHTML =
      DATA.cursos.slice(0, 6).map(cardCurso).join(''));

    $('#materias-grid') && ($('#materias-grid').innerHTML = DATA.materias.map(m => `
      <a class="card text-center" href="${R('tutores.html')}?materia=${encodeURIComponent(m.nombre)}">
        <span class="subject-icon icon-chip--${m.chip}" style="margin:0 auto .5rem">${m.abrev}</span>
        <p class="card-title" style="font-size:var(--font-size-body)">${m.nombre}</p>
        <p class="hint">${m.tutores} tutores</p>
      </a>`).join(''));

    $('#testimonios') && ($('#testimonios').innerHTML = DATA.resenas.concat(DATA.resenas).slice(0, 5).map(r => `
      <blockquote class="quote-card">
        <p>“${r.texto}”</p>
        <footer><span class="avatar-placeholder">${r.iniciales}</span>
          <span><strong>${r.autor}</strong><br><span class="star-rating">${estrellas(r.estrellas)}</span></span>
        </footer>
      </blockquote>`).join(''));
  },

  /* ---------- Login ---------- */
  login() {
    const cont = $('#demo-users');
    if (cont) {
      cont.innerHTML = DATA.usuarios.map(u => `
        <button class="demo-user" type="button" data-correo="${u.correo}" data-clave="${u.clave}">
          <span><strong>${u.nombre}</strong><br><span class="hint">${u.correo}</span></span>
          <span class="chip">${u.rol}</span>
        </button>`).join('');
      $$('.demo-user', cont).forEach(b => b.addEventListener('click', () => {
        $('#correo').value = b.dataset.correo;
        $('#clave').value = b.dataset.clave;
        toast('Datos cargados. Ahora entra.', 'ok');
      }));
    }

    const form = $('#form-login');
    form.addEventListener('submit', e => {
      e.preventDefault();
      limpiarErrores(form);
      const campoCorreo = $('#correo'), campoClave = $('#clave');
      const correo = campoCorreo.value.trim(), clave = campoClave.value;

      const malCorreo = problemaCorreo(correo);
      if (malCorreo) { errorCampo(campoCorreo, malCorreo); enfocarPrimerError(form); return; }
      if (!clave) { errorCampo(campoClave, 'Escribe tu contraseña. La de las cuentas demo es 123456.'); enfocarPrimerError(form); return; }

      const cuenta = Auth.todos().find(x => x.correo.toLowerCase() === correo.toLowerCase());
      if (!cuenta) {
        errorCampo(campoCorreo, 'No existe ninguna cuenta con ese correo. Revisa que esté bien escrito o crea una cuenta nueva.');
        enfocarPrimerError(form); return;
      }
      const u = Auth.entrar(correo, clave);
      if (!u) {
        errorCampo(campoClave, 'La contraseña no coincide con la cuenta de ' + cuenta.nombre + '. Vuelve a escribirla.');
        campoClave.value = ''; enfocarPrimerError(form); return;
      }
      toast('Hola de nuevo, ' + u.nombre.split(' ')[0], 'ok');
      setTimeout(() => location.href = param('next') || 'inicio.html', 600);
    });
  },

  /* ---------- Registro ---------- */
  registro() {
    const form = $('#form-registro');
    form.addEventListener('submit', e => {
      e.preventDefault();
      limpiarErrores(form);
      const cNombre = $('#r-nombre'), cCorreo = $('#r-correo'), cClave = $('#r-clave'), cClave2 = $('#r-clave2');
      const nombre = cNombre.value.trim(), correo = cCorreo.value.trim();
      const clave = cClave.value, clave2 = cClave2.value, rol = $('#r-rol').value;

      if (!nombre) { errorCampo(cNombre, 'Escribe tu nombre. Lo verán los tutores al reservar.'); return enfocarPrimerError(form); }
      if (nombre.split(/\s+/).length < 2) { errorCampo(cNombre, 'Falta el apellido. Escribe nombre y apellido, por ejemplo: Brandon Lozano.'); return enfocarPrimerError(form); }
      const malCorreo = problemaCorreo(correo);
      if (malCorreo) { errorCampo(cCorreo, malCorreo); return enfocarPrimerError(form); }
      if (!clave) { errorCampo(cClave, 'Falta la contraseña. Debe tener 6 caracteres o más.'); return enfocarPrimerError(form); }
      if (clave.length < 6) { errorCampo(cClave, 'La contraseña tiene ' + clave.length + ' caracteres y necesita al menos 6. Agrega ' + (6 - clave.length) + ' más.'); return enfocarPrimerError(form); }
      if (clave !== clave2) { errorCampo(cClave2, 'Las dos contraseñas no son iguales. Vuelve a escribir la repetición.'); cClave2.value = ''; return enfocarPrimerError(form); }

      const res = Auth.registrar({ nombre, correo, clave, rol });
      if (res.error) { errorCampo(cCorreo, res.error); return enfocarPrimerError(form); }
      toast('Cuenta creada. Bienvenido a Link Estudiantil.', 'ok');
      setTimeout(() => location.href = 'inicio.html', 700);
    });

    $('#r-clave').addEventListener('input', e => {
      const v = e.target.value, barra = $('#fuerza > span');
      const fuerza = Math.min(100, v.length * 12 + (/[A-Z]/.test(v) ? 15 : 0) + (/\d/.test(v) ? 15 : 0));
      barra.style.width = fuerza + '%';
      $('#fuerza-txt').textContent = fuerza < 40 ? 'Débil' : fuerza < 75 ? 'Aceptable' : 'Fuerte';
    });
  },

  /* ---------- Menú principal (dashboard) ---------- */
  inicio() {
    const u = Auth.actual();
    $('#perfil-nombre').textContent = u.nombre;
    $('#perfil-id').textContent = 'ID - ' + u.codigo;
    $('#perfil-bio').textContent = '“' + u.bio + '”';
    $('#perfil-avatar').textContent = iniciales(u.nombre);
    $('#saludo').textContent = 'Hola, ' + u.nombre.split(' ')[0];

    const misCursos = DATA.cursos.filter(c => c.progreso > 0);
    $('#mis-cursos').innerHTML = misCursos.map(itemCursoLista).join('');
    $('#tutores-home').innerHTML = DATA.tutores.slice(0, 4).map(cardTutor).join('');
    $('#materias-home').innerHTML = DATA.cursos.slice(2, 6).map(cardCurso).join('');

    const horas = misCursos.reduce((a, c) => a + c.horas, 0);
    $('#kpi-cursos').dataset.count = misCursos.length;
    $('#kpi-horas').dataset.count = horas;
    $('#kpi-sesiones').dataset.count = (Store.get('sesiones', DATA.sesiones) || []).length;

    /* Formulario de configuración rápida */
    const btn = $('#btn-config'), form = $('#config-form');
    btn.addEventListener('click', () => {
      const oculto = form.classList.contains('hidden');
      form.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(oculto));
      btn.textContent = oculto ? 'Cerrar' : 'Configuración';
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const s = Auth.actual();
      s.nombre = $('#input-nombre').value.trim() || s.nombre;
      s.codigo = $('#input-id').value.trim() || s.codigo;
      s.bio = $('#input-bio').value.trim() || s.bio;
      Store.set('sesion', s);
      toast('Perfil actualizado', 'ok');
      setTimeout(() => location.reload(), 700);
    });
    $('#input-nombre').value = u.nombre;
    $('#input-id').value = u.codigo;
    $('#input-bio').value = u.bio;
  },

  /* ---------- Buscar tutores ---------- */
  tutores() {
    const selMateria = $('#f-materia'), selModalidad = $('#f-modalidad'), selOrden = $('#f-orden'), buscador = $('#f-texto');
    selMateria.innerHTML = '<option value="">Todas las materias</option>' +
      DATA.materias.map(m => `<option>${m.nombre}</option>`).join('');

    const preset = param('materia');
    if (preset) selMateria.value = preset;

    function pintar() {
      let lista = DATA.tutores.slice();
      const texto = buscador.value.toLowerCase().trim();
      if (selMateria.value) lista = lista.filter(t => t.materia === selMateria.value);
      if (selModalidad.value) lista = lista.filter(t => t.modalidad === selModalidad.value);
      if ($('#f-verificado').checked) lista = lista.filter(t => t.verificado);
      if (texto) lista = lista.filter(t => (t.nombre + t.titulo + t.materia).toLowerCase().includes(texto));

      if (selOrden.value === 'precio') lista.sort((a, b) => a.precio - b.precio);
      if (selOrden.value === 'rating') lista.sort((a, b) => b.rating - a.rating);
      if (selOrden.value === 'resenas') lista.sort((a, b) => b.reseñas - a.reseñas);

      $('#contador').textContent = `${lista.length} tutor${lista.length === 1 ? '' : 'es'} disponible${lista.length === 1 ? '' : 's'}`;
      $('#resultados').innerHTML = lista.length
        ? lista.map(cardTutor).join('')
        : `<div class="empty-state" style="grid-column:1/-1">
             <h3>No encontramos tutores con esos filtros</h3>
             <p>Prueba quitando la materia o la modalidad.</p>
             <button class="btn btn-outline" id="limpiar-2" style="margin-top:1rem">Limpiar filtros</button>
           </div>`;
      cargarImagenes($('#resultados'));
      const l2 = $('#limpiar-2'); if (l2) l2.addEventListener('click', limpiar);
    }
    function limpiar() {
      selMateria.value = ''; selModalidad.value = ''; selOrden.value = 'rating';
      buscador.value = ''; $('#f-verificado').checked = false; pintar();
    }

    [selMateria, selModalidad, selOrden, $('#f-verificado')].forEach(el => el.addEventListener('change', pintar));
    buscador.addEventListener('input', pintar);
    $('#limpiar').addEventListener('click', limpiar);
    $('#ahora').innerHTML = DATA.tutores.filter(t => t.rating >= 4.8).slice(0, 4).map(cardTutor).join('');
    pintar();
  },

  /* ---------- Perfil de un tutor ---------- */
  tutor() {
    const t = DATA.tutores.find(x => x.id === param('id')) || DATA.tutores[0];
    document.title = t.nombre + ' · Link Estudiantil';
    $('#t-foto').innerHTML = ph(t.img, t.nombre, 'ph--tall');
    $('#t-nombre').textContent = t.nombre;
    $('#t-titulo').textContent = t.titulo;
    $('#t-bio').textContent = t.bio;
    $('#t-rating').innerHTML = `<span class="star-rating">${estrellas(t.rating)}</span> <strong>${t.rating}</strong> <span class="hint">(${t.reseñas} reseñas)</span>`;
    $('#t-precio').textContent = '$' + t.precio + '/hora';
    $('#t-chips').innerHTML = `
      <span class="chip">${t.materia}</span>
      <span class="chip chip--gray">${t.modalidad}</span>
      <span class="chip chip--gray">${t.nivel}</span>
      <span class="chip chip--gray">${ICONS.pin} ${t.ciudad}</span>
      ${t.verificado ? '<span class="badge-verified">✓ Verificado</span>' : '<span class="chip chip--warn">En verificación</span>'}`;
    $('#t-resenas').innerHTML = DATA.resenas.map(r => `
      <article class="review-card">
        <span class="avatar-placeholder avatar-placeholder--lg">${r.iniciales}</span>
        <div>
          <p><strong>${r.autor}</strong></p>
          <p class="star-rating">${estrellas(r.estrellas)}</p>
          <p class="review-comment">${r.texto}</p>
        </div>
      </article>`).join('');

    /* Reserva */
    $('#slots').innerHTML = DATA.horarios.map((h, i) =>
      `<button class="slot" type="button" data-hora="${h}" ${i % 4 === 3 ? 'disabled' : ''}>${h}</button>`).join('');
    let horaElegida = null;
    $$('#slots .slot').forEach(s => s.addEventListener('click', () => {
      $$('#slots .slot').forEach(x => x.classList.remove('is-selected'));
      s.classList.add('is-selected'); horaElegida = s.dataset.hora;
    }));

    const hoy = new Date(); hoy.setDate(hoy.getDate() + 1);
    $('#fecha').value = hoy.toISOString().slice(0, 10);
    $('#fecha').min = new Date().toISOString().slice(0, 10);

    $('#btn-reservar').addEventListener('click', () => {
      if (!Auth.actual()) { location.href = R('login.html') + '?next=' + encodeURIComponent('tutor.html?id=' + t.id); return; }
      if (!horaElegida) {
        const aviso = $('#slots-error') || Object.assign(document.createElement('p'), { id: 'slots-error', className: 'field-error' });
        aviso.setAttribute('role', 'alert');
        aviso.textContent = 'Falta elegir la hora. Toca uno de los horarios de arriba que no esté tachado.';
        $('#slots').after(aviso);
        $('#slots .slot:not([disabled])').focus();
        return;
      }
      const avisoViejo = $('#slots-error'); if (avisoViejo) avisoViejo.remove();
      const fecha = $('#fecha').value;
      abrirModal('Confirmar reserva', `
        <p>Vas a reservar una sesión de <strong>${t.materia}</strong> con <strong>${t.nombre}</strong>.</p>
        <ul style="margin-top:.75rem" class="stack">
          <li>${ICONS.cal} Fecha: <strong>${fecha}</strong></li>
          <li>${ICONS.clock} Hora: <strong>${horaElegida}</strong></li>
          <li>${ICONS.pin} Modalidad: <strong>${t.modalidad}</strong></li>
        </ul>
        <p class="form-note" style="margin-top:.75rem">Pagas al finalizar la sesión: $${t.precio}</p>`,
        'Confirmar reserva', () => {
          const s = Store.get('sesiones', DATA.sesiones.slice());
          s.unshift({ id: 's' + Date.now(), curso: t.titulo, tutor: t.nombre, fecha, hora: horaElegida, modalidad: t.modalidad, estado: 'Pendiente' });
          Store.set('sesiones', s);
          toast('Sesión reservada. La verás en Sesiones.', 'ok');
        });
    });
  },

  /* ---------- Catálogo de cursos ---------- */
  cursos() {
    const buscador = $('#c-texto'), selMateria = $('#c-materia'), selOrden = $('#c-orden');
    selMateria.innerHTML = '<option value="">Todas las materias</option>' + DATA.materias.map(m => `<option>${m.nombre}</option>`).join('');
    function pintar() {
      let l = DATA.cursos.slice();
      const q = buscador.value.toLowerCase().trim();
      if (selMateria.value) l = l.filter(c => c.materia === selMateria.value);
      if (q) l = l.filter(c => (c.titulo + c.tutor).toLowerCase().includes(q));
      if (selOrden.value === 'precio') l.sort((a, b) => a.precio - b.precio);
      if (selOrden.value === 'rating') l.sort((a, b) => b.rating - a.rating);
      $('#c-contador').textContent = l.length + ' cursos';
      $('#cursos-grid').innerHTML = l.length ? l.map(cardCurso).join('')
        : '<div class="empty-state" style="grid-column:1/-1"><h3>Nada por aquí</h3><p>Cambia la materia o borra el texto de búsqueda.</p></div>';
      cargarImagenes($('#cursos-grid'));
    }
    [buscador, selMateria, selOrden].forEach(e => e.addEventListener('input', pintar));
    pintar();
  },

  /* ---------- Detalle de curso ---------- */
  curso() {
    const c = DATA.cursos.find(x => x.id === param('id')) || DATA.cursos[0];
    document.title = c.titulo + ' · Link Estudiantil';
    $('#c-portada').innerHTML = ph(c.img, c.materia, 'ph--wide');
    $('#c-titulo').textContent = c.titulo;
    $('#c-tutor').textContent = c.tutor;
    $('#c-meta').innerHTML = `<span class="chip">${c.materia}</span>
      <span class="chip chip--gray">${c.lecciones} lecciones</span>
      <span class="chip chip--gray">${c.horas} horas</span>
      <span class="star-rating">${estrellas(c.rating)} ${c.rating}</span>`;
    $('#c-precio').textContent = '$' + c.precio;

    const guardado = Store.get('progreso.' + c.id, null);
    const hechas = guardado || DATA.lecciones.map(l => l.hecha);
    const pintarLecciones = () => {
      $('#c-lecciones').innerHTML = DATA.lecciones.map((l, i) => `
        <li class="task-item ${hechas[i] ? 'is-done' : ''}">
          <input type="checkbox" id="lec${i}" ${hechas[i] ? 'checked' : ''}>
          <label for="lec${i}" class="task-text" style="flex:1;cursor:pointer">
            <strong>${l.n}. ${l.titulo}</strong><br><span class="hint">${ICONS.play} ${l.min} min</span>
          </label>
        </li>`).join('');
      $$('#c-lecciones input').forEach((chk, i) => chk.addEventListener('change', () => {
        hechas[i] = chk.checked; Store.set('progreso.' + c.id, hechas);
        pintarLecciones(); actualizar();
        toast(chk.checked ? 'Lección completada' : 'Lección marcada como pendiente', 'ok');
      }));
    };
    const actualizar = () => {
      const p = Math.round(hechas.filter(Boolean).length / hechas.length * 100);
      $('#c-progreso-bar').style.width = p + '%';
      $('#c-progreso-txt').textContent = p + '% completado';
      const anillo = $('#c-anillo');
      anillo.dataset.progress = p; anillo.style.setProperty('--progress', p);
      anillo.classList.toggle('is-complete', p >= 100);
      $('.progress-value', anillo).textContent = p + '%';
    };
    pintarLecciones(); actualizar();

    $('#c-relacionados').innerHTML = DATA.cursos.filter(x => x.id !== c.id).slice(0, 4).map(cardCurso).join('');
    $('#btn-inscribir').addEventListener('click', () => {
      if (!Auth.actual()) { location.href = R('login.html') + '?next=' + encodeURIComponent('curso.html?id=' + c.id); return; }
      toast('Te inscribiste en el curso', 'ok');
    });
  },

  /* ---------- Sesiones y agendamiento ---------- */
  sesiones() {
    const pintar = () => {
      const lista = Store.get('sesiones', DATA.sesiones.slice());
      const activos = DATA.cursos.filter(c => c.progreso > 0 && c.progreso < 100);
      const completos = DATA.cursos.filter(c => c.progreso >= 100);

      $('#cursos-activos').innerHTML = activos.map(c => tarjetaSesionCurso(c)).join('') ||
        '<p class="hint">Todavía no empiezas ningún curso.</p>';
      $('#cursos-completos').innerHTML = completos.map(c => tarjetaSesionCurso(c)).join('') ||
        '<p class="hint">Aún no completas cursos.</p>';

      $('#agenda-lista').innerHTML = lista.length ? lista.map(s => `
        <li class="timeline-item">
          <div class="spread">
            <div>
              <strong>${s.curso}</strong>
              <p class="hint">${ICONS.user} ${s.tutor} · ${ICONS.cal} ${s.fecha} · ${ICONS.clock} ${s.hora} · ${s.modalidad}</p>
            </div>
            <div class="row">
              <span class="chip ${s.estado === 'Confirmada' ? 'chip--green' : 'chip--warn'}">${s.estado}</span>
              <button class="btn btn-outline btn-sm" data-cancelar="${s.id}">Cancelar</button>
            </div>
          </div>
        </li>`).join('')
        : '<p class="empty-state">No tienes sesiones agendadas. Busca un tutor y reserva la primera.</p>';

      $$('[data-cancelar]').forEach(b => b.addEventListener('click', () => {
        abrirModal('Cancelar sesión', '<p>Se liberará el horario y el tutor recibirá un aviso. Esta acción no se puede deshacer.</p>', 'Cancelar sesión', () => {
          Store.set('sesiones', Store.get('sesiones', DATA.sesiones.slice()).filter(x => x.id !== b.dataset.cancelar));
          pintar(); toast('Sesión cancelada', 'ok');
        });
      }));
      initProgreso(); cargarImagenes();
    };

    const tarjetaSesionCurso = (c) => `
      <article class="session-card">
        <p class="card-title" style="white-space:normal">${c.titulo}</p>
        <div class="course-row">
          <span class="course-thumb">${ph(c.img, c.materia)}</span>
          <span class="course-arrow">${ICONS.chevR}</span>
          <span class="progress-wrap">
            <span class="progress-circle" data-progress="${c.progreso}"><span class="progress-value">0%</span></span>
            <span class="progress-label">${c.progreso >= 100 ? 'Completado' : 'En proceso'}</span>
          </span>
        </div>
        <p class="course-teacher">${c.tutor}</p>
        <a class="btn ${c.progreso >= 100 ? 'btn-outline' : 'btn-primary'} w-full" href="${R('curso.html')}?id=${c.id}" style="margin-top:.75rem">
          ${c.progreso >= 100 ? 'Ver certificado' : 'Continuar curso'}
        </a>
      </article>`;

    $('#materias-carrusel').innerHTML = DATA.materias.map(m => `
      <a class="subject-item" href="${R('tutores.html')}?materia=${encodeURIComponent(m.nombre)}">
        <span class="subject-icon icon-chip--${m.chip}">${m.abrev}</span>
        <span class="subject-name">${m.nombre}</span>
        <span class="subject-status">${m.tutores} tutores</span>
      </a>`).join('');

    $('#btn-nueva').addEventListener('click', () => location.href = R('tutores.html'));
    pintar();
  },

  /* ---------- Notificaciones ---------- */
  notificaciones() {
    const mensajes = Store.get('mensajes', DATA.mensajes.slice());
    let activo = mensajes[0];

    const pintarLista = () => {
      $('#lista-mensajes').innerHTML = mensajes.map(m => `
        <li>
          <button class="message-item ${m.id === activo.id ? 'is-active' : ''}" data-id="${m.id}">
            <span class="avatar-placeholder">${m.iniciales}</span>
            <span class="message-item-info">
              <span class="message-sender">${m.autor}<span class="message-time">${m.tiempo}</span></span>
              <span class="message-preview">${m.asunto}</span>
            </span>
            ${!m.leido ? '<span class="unread-dot"></span>' : ''}
          </button>
        </li>`).join('');
      $$('#lista-mensajes .message-item').forEach(b => b.addEventListener('click', () => {
        activo = mensajes.find(m => m.id === b.dataset.id);
        activo.leido = true; Store.set('mensajes', mensajes);
        pintarLista(); pintarDetalle();
      }));
      $('#sin-leer').textContent = mensajes.filter(m => !m.leido).length + ' sin leer';
    };

    const pintarDetalle = () => {
      $('#detalle').innerHTML = `
        <div class="message-detail-header">
          <span class="avatar-placeholder avatar-placeholder--lg">${activo.iniciales}</span>
          <div>
            <p class="message-sender">${activo.autor}</p>
            <p class="message-time">${activo.tiempo}</p>
          </div>
        </div>
        <h3 style="margin-top:1rem">${activo.asunto}</h3>
        <div class="message-body">${activo.texto}</div>
        ${activo.adjunto ? `
          <p class="hint" style="margin-top:1rem">Archivo adjunto</p>
          <div class="attachment-file">
            <span class="file-icon">PDF</span>
            <span class="file-info"><span class="file-name">${activo.adjunto.nombre}</span><span class="file-meta">${activo.adjunto.peso}</span></span>
            <button class="nav-icon" id="btn-descargar" aria-label="Descargar">${ICONS.down}</button>
          </div>` : ''}
        <div class="message-actions">
          <button class="btn btn-primary" id="btn-responder">Responder</button>
          <button class="btn btn-outline" id="btn-visto">Marcar como no leído</button>
          <button class="btn btn-danger" id="btn-borrar">Borrar</button>
        </div>`;
      const d = $('#btn-descargar');
      if (d) d.addEventListener('click', () => toast('Descarga simulada: ' + activo.adjunto.nombre));
      $('#btn-responder').addEventListener('click', () => {
        abrirModal('Responder a ' + activo.autor,
          `<div class="form-group"><label for="resp">Tu respuesta</label><textarea id="resp" rows="4" placeholder="Escribe tu mensaje…"></textarea></div>`,
          'Enviar respuesta', () => toast('Respuesta enviada', 'ok'));
      });
      $('#btn-visto').addEventListener('click', () => { activo.leido = false; Store.set('mensajes', mensajes); pintarLista(); toast('Marcado como no leído'); });
      $('#btn-borrar').addEventListener('click', () => {
        abrirModal('Borrar mensaje', '<p>El mensaje se elimina solo de tu bandeja.</p>', 'Borrar', () => {
          const i = mensajes.findIndex(m => m.id === activo.id);
          mensajes.splice(i, 1); Store.set('mensajes', mensajes);
          if (!mensajes.length) { $('#detalle').innerHTML = '<div class="empty-state"><h3>Bandeja vacía</h3><p>Cuando un tutor te escriba, lo verás aquí.</p></div>'; $('#lista-mensajes').innerHTML = ''; return; }
          activo = mensajes[0]; pintarLista(); pintarDetalle();
        });
      });
    };

    pintarLista(); pintarDetalle();
    construirCalendario($('#calendario'));

    /* Tareas pendientes */
    const pintarTareas = () => {
      const tareas = Store.get('tareas', []);
      $('#tareas').innerHTML = tareas.length ? tareas.map((t, i) => `
        <li class="task-item ${t.hecha ? 'is-done' : ''}">
          <input type="checkbox" id="t${i}" ${t.hecha ? 'checked' : ''} data-i="${i}">
          <label class="task-text" for="t${i}" style="flex:1">${t.texto}</label>
          <button class="link-more" data-del="${i}" aria-label="Eliminar">✕</button>
        </li>`).join('')
        : '<p class="tasks-empty">No hay tareas pendientes.</p>';
      $$('#tareas input').forEach(c => c.addEventListener('change', () => {
        const t = Store.get('tareas', []); t[c.dataset.i].hecha = c.checked; Store.set('tareas', t); pintarTareas();
      }));
      $$('#tareas [data-del]').forEach(b => b.addEventListener('click', () => {
        const t = Store.get('tareas', []); t.splice(b.dataset.del, 1); Store.set('tareas', t); pintarTareas();
      }));
    };
    $('#form-tarea').addEventListener('submit', e => {
      e.preventDefault();
      const v = $('#nueva-tarea').value.trim(); if (!v) return;
      const t = Store.get('tareas', []); t.push({ texto: v, hecha: false }); Store.set('tareas', t);
      $('#nueva-tarea').value = ''; pintarTareas(); toast('Tarea agregada', 'ok');
    });
    pintarTareas();

    $('#btn-crear-evento').addEventListener('click', () => {
      abrirModal('Crear evento', `
        <div class="form-group"><label for="ev-t">Título</label><input id="ev-t" placeholder="Tutoría de Química"></div>
        <div class="form-row">
          <div class="form-group"><label for="ev-f">Fecha</label><input type="date" id="ev-f" value="${new Date().toISOString().slice(0,10)}"></div>
          <div class="form-group"><label for="ev-h">Hora</label><input type="time" id="ev-h" value="16:00"></div>
        </div>`, 'Crear evento', () => toast('Evento creado en tu agenda', 'ok'));
    });
    $('#btn-borrar-evento').addEventListener('click', () =>
      abrirModal('Borrar evento', '<p>Selecciona un día marcado en el calendario para liberar ese horario.</p>', 'Borrar', () => toast('Evento borrado')));
  },

  /* ---------- Confianza y verificación ---------- */
  confianza() {
    const u = Auth.actual();
    $('#resultados-confianza').innerHTML = DATA.tutores.slice(0, 4).map(cardTutor).join('');
    $('#mis-resenas').innerHTML = DATA.resenas.map(r => `
      <article class="review-card">
        <span class="avatar-placeholder avatar-placeholder--lg">${r.iniciales}</span>
        <div>
          <p><strong>${r.autor}</strong></p>
          <p class="star-rating">${estrellas(r.estrellas)}</p>
          <p class="review-comment">${r.texto}</p>
        </div>
      </article>`).join('');

    $('#pro-nombre').textContent = u.nombre;
    $('#pro-avatar').textContent = iniciales(u.nombre);
    $('#pro-rol').textContent = u.rol === 'tutor' ? 'Cuenta de tutor' : 'Cuenta de estudiante';

    const nivel = Store.get('verificacion', u.verificado ? 3 : 1);
    const pintarNivel = (n) => {
      $$('#trust span').forEach((s, i) => s.classList.toggle('is-on', i < n));
      $('#trust-txt').textContent = n >= 3 ? 'Cuenta verificada' : n === 2 ? 'Verificación en revisión' : 'Sin verificar';
      $('#trust-icon').textContent = n >= 3 ? '✓' : '!';
    };
    pintarNivel(nivel);

    $('#btn-verificar').addEventListener('click', () => {
      abrirModal('Verificar mi cuenta', `
        <p>Para obtener el sello verde necesitas subir:</p>
        <ul class="stack" style="margin:.75rem 0">
          <li>${ICONS.check} Documento de identidad</li>
          <li>${ICONS.check} Respaldo académico (título o matrícula)</li>
          <li>${ICONS.check} Una foto de perfil clara</li>
        </ul>
        <div class="form-group"><label for="doc">Archivo</label><input type="file" id="doc"></div>`,
        'Enviar a revisión', () => { Store.set('verificacion', 2); pintarNivel(2); toast('Documentos enviados. Revisión en 48 h.', 'ok'); });
    });
    $('#btn-reportar').addEventListener('click', () =>
      abrirModal('Reportar un usuario', `
        <div class="form-group"><label for="rep-u">Usuario</label><input id="rep-u" placeholder="Nombre o correo"></div>
        <div class="form-group"><label for="rep-m">¿Qué pasó?</label><textarea id="rep-m" rows="3"></textarea></div>`,
        'Enviar reporte', () => toast('Reporte enviado al equipo', 'ok')));
    $('#btn-eliminar').addEventListener('click', () =>
      abrirModal('Eliminar cuenta', '<p>Se borrarán tus datos guardados en este navegador y se cerrará la sesión.</p>', 'Eliminar cuenta', () => {
        Store.del('sesion'); toast('Cuenta eliminada'); setTimeout(() => location.href = R('index.html'), 900);
      }));
    $('#btn-agregar-resena').addEventListener('click', () =>
      abrirModal('Agregar reseña', `
        <div class="form-group"><label for="re-t">Tutor</label>
          <select id="re-t">${DATA.tutores.map(t => `<option>${t.nombre}</option>`).join('')}</select></div>
        <div class="form-group"><label for="re-e">Calificación</label>
          <select id="re-e"><option>5 estrellas</option><option>4 estrellas</option><option>3 estrellas</option><option>2 estrellas</option><option>1 estrella</option></select></div>
        <div class="form-group"><label for="re-c">Comentario</label><textarea id="re-c" rows="3"></textarea></div>`,
        'Publicar reseña', () => toast('Reseña publicada', 'ok')));
  },

  /* ---------- Publicar tutoría ---------- */
  publicar() {
    $('#p-materia').innerHTML = DATA.materias.map(m => `<option>${m.nombre}</option>`).join('');
    const horarios = new Set();
    $('#p-horarios').innerHTML = DATA.horarios.map(h => `<button class="slot" type="button" data-h="${h}">${h}</button>`).join('');
    $$('#p-horarios .slot').forEach(s => s.addEventListener('click', () => {
      s.classList.toggle('is-selected');
      s.classList.contains('is-selected') ? horarios.add(s.dataset.h) : horarios.delete(s.dataset.h);
      $('#p-horas-txt').textContent = horarios.size ? [...horarios].sort().join(' · ') : 'Ningún horario seleccionado';
    }));

    const previa = () => {
      $('#previa').innerHTML = `
        <div class="card-image-wrapper">${ph('assets/tutores/nuevo.jpg', 'Tu foto')}</div>
        <p class="card-title" style="white-space:normal">${$('#p-titulo').value || 'Título de tu tutoría'}</p>
        <p class="card-subtitle">${(Auth.actual() || {}).nombre || 'Tu nombre'}</p>
        <div class="card-meta"><span class="chip chip--gray">${$('#p-modalidad').value}</span>
          <span class="price">$${$('#p-precio').value || 0}/h</span></div>`;
      cargarImagenes($('#previa'));
    };
    ['#p-titulo', '#p-precio', '#p-modalidad'].forEach(s => $(s).addEventListener('input', previa));
    previa();

    $('#form-publicar').addEventListener('submit', e => {
      e.preventDefault();
      limpiarErrores(e.target);
      const cTitulo = $('#p-titulo'), cPrecio = $('#p-precio'), cDesc = $('#p-desc');
      if (cTitulo.value.trim().length < 10) {
        errorCampo(cTitulo, 'El título es muy corto. Escribe al menos 10 caracteres que digan qué enseñas, por ejemplo: "Cálculo diferencial desde cero".');
        return enfocarPrimerError(e.target);
      }
      const precio = Number(cPrecio.value);
      if (!precio || precio < 1 || precio > 200) {
        errorCampo(cPrecio, 'El precio por hora debe estar entre $1 y $200. Escribiste "' + cPrecio.value + '".');
        return enfocarPrimerError(e.target);
      }
      if (cDesc.value.trim().length < 20) {
        errorCampo(cDesc, 'La descripción necesita al menos 20 caracteres. Cuenta cómo enseñas y para quién es la tutoría.');
        return enfocarPrimerError(e.target);
      }
      if (!horarios.size) {
        toast('Falta elegir horarios: toca al menos una hora de la lista.', 'error');
        $('#p-horarios .slot').focus();
        return;
      }
      const nueva = {
        id: 't' + Date.now(), nombre: (Auth.actual() || {}).nombre || 'Tutor demo',
        materia: $('#p-materia').value, titulo: $('#p-titulo').value, precio: Number($('#p-precio').value),
        rating: 5, reseñas: 0, modalidad: $('#p-modalidad').value, nivel: $('#p-nivel').value,
        verificado: false, ciudad: $('#p-ciudad').value, img: 'assets/tutores/nuevo.jpg', bio: $('#p-desc').value
      };
      const mias = Store.get('publicaciones', []); mias.push(nueva); Store.set('publicaciones', mias);
      DATA.tutores.unshift(nueva);
      toast('Tutoría publicada. Ya aparece en la búsqueda.', 'ok');
      setTimeout(() => location.href = R('tutores.html'), 900);
    });
  },

  /* ---------- Perfil ---------- */
  perfil() {
    const u = Auth.actual();
    $('#pf-avatar').textContent = iniciales(u.nombre);
    $('#pf-nombre').textContent = u.nombre;
    $('#pf-rol').innerHTML = `<span class="chip">${u.rol}</span> ${u.verificado ? '<span class="badge-verified">✓ Verificado</span>' : '<span class="chip chip--warn">Sin verificar</span>'}`;
    $('#pf-correo').textContent = u.correo;
    ['nombre', 'correo', 'codigo', 'bio'].forEach(k => { const i = $('#e-' + k); if (i) i.value = u[k] || ''; });

    $('#form-perfil').addEventListener('submit', e => {
      e.preventDefault();
      const s = Auth.actual();
      s.nombre = $('#e-nombre').value.trim(); s.correo = $('#e-correo').value.trim();
      s.codigo = $('#e-codigo').value.trim(); s.bio = $('#e-bio').value.trim();
      Store.set('sesion', s); toast('Cambios guardados', 'ok');
      setTimeout(() => location.reload(), 700);
    });

    const prefs = Store.get('prefs', { correos: true, recordatorios: true, novedades: false });
    Object.keys(prefs).forEach(k => { const c = $('#pref-' + k); if (c) c.checked = prefs[k]; });
    $$('[id^="pref-"]').forEach(c => c.addEventListener('change', () => {
      prefs[c.id.replace('pref-', '')] = c.checked; Store.set('prefs', prefs); toast('Preferencias actualizadas', 'ok');
    }));

    $('#mis-cursos-perfil').innerHTML = DATA.cursos.filter(c => c.progreso > 0).map(itemCursoLista).join('');
    $('#btn-cerrar').addEventListener('click', Auth.salir);
  },

  /* ---------- Ayuda ---------- */
  ayuda() {
    $('#faq').innerHTML = DATA.faq.map((f, i) => `
      <div class="accordion-item">
        <button class="accordion-trigger" aria-expanded="${i === 0}">${f.p}<span class="chev">${ICONS.chevD}</span></button>
        <div class="accordion-panel ${i === 0 ? '' : 'hidden'}">${f.r}</div>
      </div>`).join('');
    initAcordeones();
    const form = $('#form-contacto');
    form.addEventListener('submit', e => {
      e.preventDefault();
      limpiarErrores(form);
      const cNombre = $('#a-nombre'), cCorreo = $('#a-correo'), cMsg = $('#a-msg');

      if (!cNombre.value.trim()) { errorCampo(cNombre, 'Escribe tu nombre para saber quién nos escribe.'); return enfocarPrimerError(form); }
      const malCorreo = problemaCorreo(cCorreo.value);
      if (malCorreo) { errorCampo(cCorreo, malCorreo + ' Lo necesitamos para responderte.'); return enfocarPrimerError(form); }
      const largo = cMsg.value.trim().length;
      if (!largo) { errorCampo(cMsg, 'Cuéntanos qué pasó. Sin el mensaje no podemos ayudarte.'); return enfocarPrimerError(form); }
      if (largo < 15) { errorCampo(cMsg, 'El mensaje es muy corto (' + largo + ' caracteres). Escribe al menos 15 explicando qué ocurrió.'); return enfocarPrimerError(form); }

      form.reset();
      toast('Mensaje enviado. Te respondemos en menos de 24 horas.', 'ok');
    });
    /* El error se limpia en cuanto el usuario corrige el campo */
    $$('#form-contacto input, #form-contacto textarea').forEach(c =>
      c.addEventListener('input', () => {
        const g = c.closest('.form-group');
        if (g && g.classList.contains('has-error')) {
          g.classList.remove('has-error');
          const p = g.querySelector('.field-error'); if (p) p.remove();
          c.removeAttribute('aria-invalid');
        }
      }));
  }
};

/* Calendario simple para la agenda ---------------------------- */
function construirCalendario(cont, conEventos = true) {
  if (!cont) return;
  let ref = new Date();
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const pintar = () => {
    const año = ref.getFullYear(), mes = ref.getMonth();
    const primero = new Date(año, mes, 1);
    const inicio = (primero.getDay() + 6) % 7; // lunes primero
    const dias = new Date(año, mes + 1, 0).getDate();
    const hoy = new Date();
    const eventos = (Store.get('sesiones', DATA.sesiones) || []).map(s => s.fecha);

    let celdas = '';
    for (let i = 0; i < inicio; i++) celdas += '<td class="is-outside"><span class="day">·</span></td>';
    for (let d = 1; d <= dias; d++) {
      const iso = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const esHoy = hoy.getFullYear() === año && hoy.getMonth() === mes && hoy.getDate() === d;
      const tiene = conEventos && eventos.includes(iso);
      celdas += `<td class="${esHoy ? 'is-today' : ''} ${tiene ? 'has-event' : ''}"><button class="day" data-iso="${iso}">${d}</button></td>`;
    }
    const filas = celdas.match(/(<td[\s\S]*?<\/td>){1,7}/g) || [];
    cont.innerHTML = `
      <div class="agenda-controls">
        <button class="agenda-nav" id="cal-prev" aria-label="Mes anterior">‹</button>
        <span class="agenda-month">${meses[mes]} ${año}</span>
        <button class="agenda-nav" id="cal-next" aria-label="Mes siguiente">›</button>
      </div>
      <table class="agenda-calendar">
        <thead><tr>${['L','M','X','J','V','S','D'].map(d => `<th>${d}</th>`).join('')}</tr></thead>
        <tbody>${filas.map(f => `<tr>${f}</tr>`).join('')}</tbody>
      </table>`;
    $('#cal-prev', cont).onclick = () => { ref = new Date(año, mes - 1, 1); pintar(); };
    $('#cal-next', cont).onclick = () => { ref = new Date(año, mes + 1, 1); pintar(); };
    $$('.day[data-iso]', cont).forEach(b => b.addEventListener('click', () => {
      $$('td', cont).forEach(td => td.classList.remove('is-selected'));
      b.parentElement.classList.add('is-selected');
      const s = (Store.get('sesiones', DATA.sesiones) || []).filter(x => x.fecha === b.dataset.iso);
      toast(s.length ? `${s.length} sesión(es) el ${b.dataset.iso}` : 'Día libre: ' + b.dataset.iso);
    }));
  };
  pintar();
}

/* ------------------------------------------------------------
   6. Arranque
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const pagina = document.body.dataset.page;
  const requiereSesion = document.body.dataset.auth === 'true';

  if (requiereSesion && !Auth.actual()) {
    location.replace(R('login.html') + '?next=' + encodeURIComponent(archivoActual() + location.search));
    return;
  }

  montarHeader();
  montarTabbar();
  montarFooter();

  try { if (Paginas[pagina]) Paginas[pagina](); }
  catch (e) { console.error('Error en la página "' + pagina + '":', e); }

  cargarImagenes();
  initReveal();
  initContadores();
  initCarruseles();
  initAcordeones();
  initProgreso();

  /* El logo se pinta desde CSS; si existe assets/logo.png se quita el fallback */
  const test = new Image();
  test.onload = () => $$('.brand-logo').forEach(l => l.classList.add('has-logo'));
  test.src = A('assets/logo.png');
});
