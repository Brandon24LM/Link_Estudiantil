/* ============================================================
   LINK ESTUDIANTIL — data.js
   Datos demo. No hay base de datos: todo vive aquí y en
   localStorage (usuarios, sesiones reservadas, tareas, etc.)
   ============================================================ */

const DATA = {

  /* ---------- Usuarios demo (también están en el README) ---------- */
  usuarios: [
    {
      id: 'u1', nombre: 'Brandon Lozano', correo: 'estudiante@link.edu', clave: '123456',
      rol: 'estudiante', codigo: '02102012012', bio: 'Estudiante de Ingeniería. Buscando reforzar Cálculo.',
      foto: 'assets/usuarios/brandon.jpg', verificado: true
    },
    {
      id: 'u2', nombre: 'Alisson Mediavilla', correo: 'tutora@link.edu', clave: '123456',
      rol: 'tutor', codigo: '02102045871', bio: 'Tutora de Inglés y Redacción. 4 años enseñando.',
      foto: 'assets/usuarios/alisson.jpg', verificado: true
    },
    {
      id: 'u3', nombre: 'Christopher Villagómez', correo: 'admin@link.edu', clave: '123456',
      rol: 'admin', codigo: '02102099001', bio: 'Coordinador de la plataforma.',
      foto: 'assets/usuarios/christopher.jpg', verificado: true
    }
  ],

  /* ---------- Materias ---------- */
  materias: [
    { id: 'm1', nombre: 'Cálculo', abrev: 'CALC', chip: 'a', tutores: 24, img: 'assets/materias/calculo.jpg' },
    { id: 'm2', nombre: 'Inglés', abrev: 'ENG', chip: 'b', tutores: 41, img: 'assets/materias/ingles.jpg' },
    { id: 'm3', nombre: 'Química', abrev: 'QUIM', chip: 'c', tutores: 18, img: 'assets/materias/quimica.jpg' },
    { id: 'm4', nombre: 'Programación', abrev: 'PROG', chip: 'd', tutores: 33, img: 'assets/materias/programacion.jpg' },
    { id: 'm5', nombre: 'Física', abrev: 'FIS', chip: 'e', tutores: 15, img: 'assets/materias/fisica.jpg' },
    { id: 'm6', nombre: 'Estadística', abrev: 'STAT', chip: 'f', tutores: 12, img: 'assets/materias/estadistica.jpg' },
    { id: 'm7', nombre: 'Redacción', abrev: 'RED', chip: 'g', tutores: 9, img: 'assets/materias/redaccion.jpg' },
    { id: 'm8', nombre: 'Base de Datos', abrev: 'BDD', chip: 'a', tutores: 21, img: 'assets/materias/bdd.jpg' }
  ],

  /* ---------- Tutores ---------- */
  tutores: [
    { id: 't1', nombre: 'Olivia Rodríguez', materia: 'Inglés', titulo: 'Clase de Inglés conversacional', precio: 8, rating: 4.9, reseñas: 128, modalidad: 'Virtual', nivel: 'Todos', verificado: true, ciudad: 'Quito', img: 'assets/tutores/olivia.jpg', bio: 'Profesora certificada TEFL. Clases dinámicas con práctica oral desde el primer día.' },
    { id: 't2', nombre: 'Mateo Salazar', materia: 'Cálculo', titulo: 'Cálculo diferencial e integral', precio: 10, rating: 4.8, reseñas: 96, modalidad: 'Presencial', nivel: 'Universidad', verificado: true, ciudad: 'Quito', img: 'assets/tutores/mateo.jpg', bio: 'Ingeniero matemático. Explico desde cero, con ejercicios tipo examen.' },
    { id: 't3', nombre: 'Sarah Gómez', materia: 'Química', titulo: 'Química general y orgánica', precio: 9, rating: 4.7, reseñas: 74, modalidad: 'Virtual', nivel: 'Colegio', verificado: true, ciudad: 'Cuenca', img: 'assets/tutores/sarah.jpg', bio: 'Enseño con laboratorios virtuales y mapas de reacciones.' },
    { id: 't4', nombre: 'Kevin Andrade', materia: 'Programación', titulo: 'Python desde cero', precio: 12, rating: 5.0, reseñas: 210, modalidad: 'Virtual', nivel: 'Todos', verificado: true, ciudad: 'Guayaquil', img: 'assets/tutores/kevin.jpg', bio: 'Desarrollador backend. Aprendes construyendo proyectos reales.' },
    { id: 't5', nombre: 'Daniela Ríos', materia: 'Física', titulo: 'Física mecánica sin sufrir', precio: 9, rating: 4.6, reseñas: 58, modalidad: 'Híbrido', nivel: 'Universidad', verificado: false, ciudad: 'Quito', img: 'assets/tutores/daniela.jpg', bio: 'Resolvemos problemas paso a paso con simulaciones.' },
    { id: 't6', nombre: 'Andrés Pineda', materia: 'Estadística', titulo: 'Estadística e inferencia', precio: 11, rating: 4.8, reseñas: 83, modalidad: 'Virtual', nivel: 'Universidad', verificado: true, ciudad: 'Ambato', img: 'assets/tutores/andres.jpg', bio: 'Trabajamos con datos reales en R y Excel.' },
    { id: 't7', nombre: 'Camila Torres', materia: 'Redacción', titulo: 'Redacción académica y tesis', precio: 7, rating: 4.9, reseñas: 61, modalidad: 'Virtual', nivel: 'Universidad', verificado: true, ciudad: 'Quito', img: 'assets/tutores/camila.jpg', bio: 'Te acompaño desde la idea hasta la entrega final.' },
    { id: 't8', nombre: 'Luis Cabrera', materia: 'Base de Datos', titulo: 'SQL y modelado de datos', precio: 13, rating: 4.7, reseñas: 45, modalidad: 'Virtual', nivel: 'Universidad', verificado: true, ciudad: 'Quito', img: 'assets/tutores/luis.jpg', bio: 'PostgreSQL, SQL Server y diseño entidad-relación.' },
    { id: 't9', nombre: 'Paula Vinueza', materia: 'Inglés', titulo: 'Preparación TOEFL', precio: 15, rating: 4.9, reseñas: 112, modalidad: 'Virtual', nivel: 'Todos', verificado: true, ciudad: 'Loja', img: 'assets/tutores/paula.jpg', bio: 'Simulacros cronometrados y estrategias por sección.' },
    { id: 't10', nombre: 'Jorge Medina', materia: 'Cálculo', titulo: 'Álgebra lineal y cálculo II', precio: 10, rating: 4.5, reseñas: 39, modalidad: 'Presencial', nivel: 'Universidad', verificado: false, ciudad: 'Quito', img: 'assets/tutores/jorge.jpg', bio: 'Enfoque geométrico para entender, no memorizar.' },
    { id: 't11', nombre: 'Nicole Paredes', materia: 'Programación', titulo: 'Desarrollo web con JavaScript', precio: 14, rating: 4.8, reseñas: 90, modalidad: 'Híbrido', nivel: 'Todos', verificado: true, ciudad: 'Quito', img: 'assets/tutores/nicole.jpg', bio: 'HTML, CSS y JS con proyectos publicados en GitHub Pages.' },
    { id: 't12', nombre: 'Iván Cueva', materia: 'Química', titulo: 'Estequiometría y balanceo', precio: 8, rating: 4.4, reseñas: 27, modalidad: 'Virtual', nivel: 'Colegio', verificado: false, ciudad: 'Manta', img: 'assets/tutores/ivan.jpg', bio: 'Trucos para resolver ejercicios en menos tiempo.' }
  ],

  /* ---------- Cursos ---------- */
  cursos: [
    { id: 'c1', titulo: 'Inglés conversacional A2-B1', tutor: 'Olivia Rodríguez', tutorId: 't1', materia: 'Inglés', lecciones: 24, horas: 12, precio: 45, rating: 4.9, img: 'assets/cursos/ingles-a2.jpg', progreso: 25, estado: 'En proceso' },
    { id: 'c2', titulo: 'Inglés para entrevistas', tutor: 'Olivia Rodríguez', tutorId: 't1', materia: 'Inglés', lecciones: 12, horas: 6, precio: 30, rating: 4.8, img: 'assets/cursos/ingles-entrevistas.jpg', progreso: 100, estado: 'Completado' },
    { id: 'c3', titulo: 'Cálculo I: límites y derivadas', tutor: 'Mateo Salazar', tutorId: 't2', materia: 'Cálculo', lecciones: 30, horas: 18, precio: 55, rating: 4.8, img: 'assets/cursos/calculo-1.jpg', progreso: 60, estado: 'En proceso' },
    { id: 'c4', titulo: 'Python desde cero', tutor: 'Kevin Andrade', tutorId: 't4', materia: 'Programación', lecciones: 40, horas: 22, precio: 60, rating: 5.0, img: 'assets/cursos/python.jpg', progreso: 0, estado: 'Sin empezar' },
    { id: 'c5', titulo: 'Química orgánica básica', tutor: 'Sarah Gómez', tutorId: 't3', materia: 'Química', lecciones: 18, horas: 10, precio: 40, rating: 4.7, img: 'assets/cursos/quimica.jpg', progreso: 0, estado: 'Sin empezar' },
    { id: 'c6', titulo: 'SQL para principiantes', tutor: 'Luis Cabrera', tutorId: 't8', materia: 'Base de Datos', lecciones: 20, horas: 11, precio: 50, rating: 4.7, img: 'assets/cursos/sql.jpg', progreso: 0, estado: 'Sin empezar' },
    { id: 'c7', titulo: 'Redacción de tesis paso a paso', tutor: 'Camila Torres', tutorId: 't7', materia: 'Redacción', lecciones: 15, horas: 8, precio: 35, rating: 4.9, img: 'assets/cursos/tesis.jpg', progreso: 0, estado: 'Sin empezar' },
    { id: 'c8', titulo: 'Estadística con datos reales', tutor: 'Andrés Pineda', tutorId: 't6', materia: 'Estadística', lecciones: 22, horas: 13, precio: 48, rating: 4.8, img: 'assets/cursos/estadistica.jpg', progreso: 0, estado: 'Sin empezar' }
  ],

  /* ---------- Lecciones de ejemplo (detalle de curso) ---------- */
  lecciones: [
    { n: 1, titulo: 'Presentaciones y saludos', min: 28, hecha: true },
    { n: 2, titulo: 'Rutina diaria: presente simple', min: 32, hecha: true },
    { n: 3, titulo: 'Hablar del pasado sin miedo', min: 35, hecha: true },
    { n: 4, titulo: 'Pedir y dar indicaciones', min: 26, hecha: false },
    { n: 5, titulo: 'Entrevista de práctica', min: 40, hecha: false },
    { n: 6, titulo: 'Vocabulario académico', min: 30, hecha: false }
  ],

  /* ---------- Mensajes ---------- */
  mensajes: [
    {
      id: 'n1', autor: 'Alisson M.', iniciales: 'AM', tiempo: 'Hace 5 min', leido: false,
      asunto: 'Recordatorio de sesión agendada',
      texto: 'Hola, recuerda que mañana a las 16:00 tenemos la tutoría de Química. Revisa el archivo adjunto antes de la clase para avanzar más rápido.',
      adjunto: { nombre: 'Quimica_tutoria.pdf', peso: 'PDF · 220 KB' }
    },
    {
      id: 'n2', autor: 'Brandon Lozano', iniciales: 'BL', tiempo: 'Hace 2 h', leido: false,
      asunto: 'Aviso de cambio de disponibilidad',
      texto: 'Buenas, necesito mover la sesión del jueves a las 18:00. ¿Te queda bien ese horario?',
      adjunto: null
    },
    {
      id: 'n3', autor: 'Christopher V.', iniciales: 'CV', tiempo: 'Ayer', leido: true,
      asunto: 'Tu cuenta fue verificada',
      texto: 'Revisamos tus documentos y tu cuenta ya está verificada. Ahora apareces con la insignia verde en los resultados de búsqueda.',
      adjunto: null
    },
    {
      id: 'n4', autor: 'Kevin Andrade', iniciales: 'KA', tiempo: 'Hace 2 días', leido: true,
      asunto: 'Material del curso de Python',
      texto: 'Subí los ejercicios de la semana 3. Cualquier duda me escribes por aquí.',
      adjunto: { nombre: 'Ejercicios_semana3.pdf', peso: 'PDF · 480 KB' }
    },
    {
      id: 'n5', autor: 'Soporte Link', iniciales: 'LE', tiempo: 'Hace 4 días', leido: true,
      asunto: 'Tu reseña fue publicada',
      texto: 'Gracias por calificar a Olivia Rodríguez. Tu reseña ya es visible para otros estudiantes.',
      adjunto: null
    }
  ],

  /* ---------- Reseñas ---------- */
  resenas: [
    { autor: 'Ana Karina R.', iniciales: 'AK', estrellas: 5, texto: '¡Muy buena clase! Me explicó los temas con ejemplos de mi propia tarea.', img: 'assets/usuarios/ana.jpg' },
    { autor: 'Diego Salas', iniciales: 'DS', estrellas: 5, texto: 'Puntual y muy paciente. Salí entendiendo el tema en una sola sesión.', img: 'assets/usuarios/diego.jpg' },
    { autor: 'María José P.', iniciales: 'MP', estrellas: 4, texto: 'Buen material de apoyo. Me hubiera gustado más ejercicios extra.', img: 'assets/usuarios/maria.jpg' }
  ],

  /* ---------- Sesiones agendadas (demo) ---------- */
  sesiones: [
    { id: 's1', curso: 'Inglés conversacional A2-B1', tutor: 'Olivia Rodríguez', fecha: '2026-08-21', hora: '16:00', modalidad: 'Virtual', estado: 'Confirmada' },
    { id: 's2', curso: 'Cálculo I: límites y derivadas', tutor: 'Mateo Salazar', fecha: '2026-08-24', hora: '10:00', modalidad: 'Presencial', estado: 'Pendiente' }
  ],

  /* ---------- Horarios disponibles ---------- */
  horarios: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],

  /* ---------- Preguntas frecuentes ---------- */
  faq: [
    { p: '¿Cómo reservo una tutoría?', r: 'Entra a Buscar tutores, abre el perfil que te interese, elige día y hora y confirma. La sesión aparece en Sesiones y en tu agenda.' },
    { p: '¿Qué significa el sello verificado?', r: 'Que el tutor subió su documento de identidad y un respaldo académico, y el equipo los revisó. Puedes filtrar la búsqueda para ver solo tutores verificados.' },
    { p: '¿Puedo cancelar una sesión?', r: 'Sí, hasta 6 horas antes desde la tarjeta de la sesión. Después de ese límite la sesión se cobra completa.' },
    { p: '¿Cómo publico mi propia tutoría?', r: 'Necesitas una cuenta con rol de tutor. Ve a Publicar tutoría, completa materia, precio por hora y horarios, y queda visible al guardar.' },
    { p: '¿Los datos se guardan en un servidor?', r: 'No. Esta es una versión de demostración: todo se guarda en el navegador con localStorage y se borra si limpias los datos del sitio.' }
  ]
};

window.DATA = DATA;
