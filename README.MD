# Link Estudiantil

Plataforma web de tutorías: los estudiantes buscan y reservan clases con tutores verificados, y los tutores publican sus tutorías, ponen su precio por hora y abren horarios. Además hay cursos grabados para avanzar a tu propio ritmo.

Todo está hecho con **HTML, CSS y JavaScript puro** (más Tailwind por CDN). No hay backend ni base de datos: los usuarios, sesiones, tareas y el progreso se guardan en el navegador con `localStorage`.

---

## Demo

- **Sitio publicado:** `https://<tu-usuario>.github.io/<tu-repo>/`
- **Prototipo en Figma:** https://www.figma.com/design/h4bIt7j46gZEgBdY31GAPJ/Untitled?node-id=0-1&p=f&t=NSUSnb4N13ktKsFy-0

## Usuarios demo

La contraseña de las tres cuentas es **123456**. En la pantalla de login puedes tocar la tarjeta de un usuario y se llena solo.

| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | `estudiante@link.edu` | `123456` |
| Tutora | `tutora@link.edu` | `123456` |
| Administrador | `admin@link.edu` | `123456` |

También puedes crear una cuenta nueva desde **Crear cuenta**; queda guardada en tu navegador.

---

## Páginas

| Archivo | Pantalla | Necesita sesión |
|---|---|---|
| `index.html` | Landing pública (hero, materias, tutores, testimonios) | No |
| `pages/login.html` | Iniciar sesión | No |
| `pages/registro.html` | Crear cuenta (estudiante o tutor) | No |
| `pages/inicio.html` | Menú principal: perfil, tus cursos, tutores, materias | Sí |
| `pages/tutores.html` | Buscar tutores con filtros y orden | No |
| `pages/tutor.html` | Perfil del tutor, reseñas y reserva de sesión | No |
| `pages/cursos.html` | Catálogo de cursos | No |
| `pages/curso.html` | Detalle del curso, lecciones y progreso | No |
| `pages/sesiones.html` | Cursos activos, completados y agendamiento | Sí |
| `pages/notificaciones.html` | Mensajes, agenda y tareas pendientes | Sí |
| `pages/confianza.html` | Verificación, reseñas, reportes y cuenta Pro | Sí |
| `pages/publicar.html` | Publicar una tutoría con vista previa en vivo | Sí |
| `pages/perfil.html` | Datos personales y preferencias | Sí |
| `pages/ayuda.html` | Preguntas frecuentes y contacto | No |

Las páginas marcadas con "Sí" redirigen al login si no hay sesión, y vuelven a la página pedida después de entrar.

## Qué se puede hacer

- Iniciar sesión, registrarse y cerrar sesión.
- Filtrar tutores por materia, modalidad, texto y solo verificados; ordenar por precio, calificación o reseñas.
- Reservar una sesión eligiendo fecha y hora; la sesión aparece en Sesiones y marcada en el calendario.
- Cancelar sesiones.
- Marcar lecciones de un curso: el progreso se guarda y el anillo se actualiza.
- Leer, responder (simulado), marcar como no leído y borrar mensajes.
- Crear y completar tareas pendientes.
- Enviar la cuenta a verificación y ver el medidor de confianza.
- Publicar una tutoría y verla aparecer en la búsqueda.
- Editar el perfil y las preferencias de notificación.

---

## Estructura

```
.
├── index.html                   # única página en la raíz (landing)
├── pages/                       # las otras 13 páginas
│   ├── login.html   registro.html   inicio.html
│   ├── tutores.html tutor.html      cursos.html   curso.html
│   ├── sesiones.html  notificaciones.html
│   └── confianza.html publicar.html perfil.html   ayuda.html
├── css/
│   └── styles.css               # :root con los tokens del UI Kit + componentes
├── js/
│   ├── tailwind-config.js       # colores del UI Kit dentro de Tailwind
│   ├── data.js                  # datos demo (usuarios, tutores, cursos, mensajes)
│   └── app.js                   # header/footer, sesión, componentes y lógica por página
├── assets/                      # imágenes (ver más abajo)
├── .nojekyll                    # para que GitHub Pages sirva todo tal cual
└── README.md
```

Las páginas de `pages/` cargan los recursos con `../css/`, `../js/` y `../assets/`. Entre ellas se enlazan con el nombre del archivo a secas (`tutores.html`), porque son vecinas.

El header, el menú lateral, la barra inferior de celular y el footer se generan desde `app.js`, así que la navegación es igual en todas las páginas y se cambia en un solo lugar. Ahí hay dos ayudantes que resuelven las rutas según dónde estés:

```js
const EN_PAGES = /\/pages\//.test(location.pathname);
const R = (archivo) => archivo === 'index.html'
  ? (EN_PAGES ? '../index.html' : 'index.html')
  : (EN_PAGES ? archivo : 'pages/' + archivo);
const A = (ruta) => (EN_PAGES ? '../' + ruta : ruta);
```

Si agregas una página nueva, guárdala en `pages/`, copia el `<head>` de cualquiera de ellas y súmala al arreglo `NAV_PUBLICO` o `NAV_PRIVADO` de `app.js`.

## Imágenes (carpeta `assets/`)

Mientras una imagen no exista, se muestra un **placeholder con el nombre del archivo**; apenas subes la imagen con ese nombre, aparece sola sin tocar el código.

```
assets/
├── logo.png                 # logo principal (lo usa el header, el footer y el favicon)
├── hero.jpg                 # foto grande de la portada
├── tutores/                 # olivia.jpg, mateo.jpg, sarah.jpg, kevin.jpg, daniela.jpg,
│                            # andres.jpg, camila.jpg, luis.jpg, paula.jpg, jorge.jpg,
│                            # nicole.jpg, ivan.jpg, nuevo.jpg
├── cursos/                  # ingles-a2.jpg, ingles-entrevistas.jpg, calculo-1.jpg,
│                            # python.jpg, quimica.jpg, sql.jpg, tesis.jpg, estadistica.jpg
├── materias/                # calculo.jpg, ingles.jpg, quimica.jpg, programacion.jpg,
│                            # fisica.jpg, estadistica.jpg, redaccion.jpg, bdd.jpg
└── usuarios/                # brandon.jpg, alisson.jpg, christopher.jpg, ana.jpg, diego.jpg, maria.jpg
```

Los nombres exactos están en `js/data.js`, en el campo `img` de cada elemento.

## Diseño (UI Kit)

Todo sale del `:root` de `css/styles.css`, tomado del UI Kit del equipo:

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#0064e0` | Botones primarios, enlaces, estado activo |
| `--color-secondary` | `#0ba06a` | Títulos principales, éxito, completado |
| `--color-selected` | `#a5d8ff` | Elemento seleccionado |
| `--color-error` | `#ff383c` | Errores y acciones destructivas |
| `--color-card-bg` | `#dddddd` | Tarjetas |
| `--color-muted` | `#5f6470` | Texto secundario |
| Tipografía | Inter 400/500/600/700/800 | 30 extrabold, 24 bold, 20 semibold, 14 regular |

Los mismos colores están cargados en Tailwind (`js/tailwind-config.js`), así que `bg-primary` o `text-secondary` funcionan igual.

## Responsive

Puntos de corte: 1100, 960, 760, 700 y 480 px.

- **Escritorio:** menú horizontal con texto y layouts de 2 o 3 columnas.
- **Tablet:** el menú deja solo los íconos y las columnas se apilan.
- **Celular (≤700 px):** el menú se va abajo como barra fija de 5 accesos, igual que en el wireframe, y el resto del menú vive en el panel lateral.

También respeta `prefers-reduced-motion` y tiene foco visible con teclado.

---

## Cómo ejecutarlo

**Opción rápida:** abre `index.html` con doble clic. Todo funciona porque no hay servidor.

**Con servidor local** (recomendado, evita rarezas del navegador con archivos locales):

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar en GitHub Pages

Sí, funciona en GitHub Pages tal cual: es un sitio estático, todas las rutas son relativas y no hay nada que compilar.

1. Sube la carpeta al repositorio (con `index.html` en la raíz).
2. En GitHub: **Settings → Pages**.
3. En *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda y espera un minuto. La URL queda como `https://<tu-usuario>.github.io/<tu-repo>/`.

Dos cosas a tener en cuenta:

- Los nombres de archivo distinguen mayúsculas: `Assets/Logo.PNG` no es lo mismo que `assets/logo.png`.
- El archivo `.nojekyll` ya está incluido para que Pages no ignore carpetas.

## Tecnologías

- HTML5 semántico
- CSS3 (variables, grid, flexbox, `conic-gradient`, animaciones)
- JavaScript (ES6, sin librerías ni frameworks)
- Tailwind CSS por CDN
- Google Fonts (Inter)
- `localStorage` como almacenamiento
- Git y GitHub Pages

## Integrantes

- Brandon Lozano
- Alisson Mediavilla
- Christopher Villagómez

Proyecto académico — Pontificia Universidad Católica del Ecuador.
