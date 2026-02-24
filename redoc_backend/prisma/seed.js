const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.download.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const hashedAdmin = await bcrypt.hash('Admin123!', 10);
  const hashedTeacher = await bcrypt.hash('Teacher123!', 10);
  const hashedStudent = await bcrypt.hash('Student123!', 10);

  const admin = await prisma.user.create({
    data: { name: 'Administrador', email: 'admin@redoc.com', password: hashedAdmin, role: 'ADMIN' },
  });
  const teacher = await prisma.user.create({
    data: { name: 'Prof. María García', email: 'teacher@redoc.com', password: hashedTeacher, role: 'TEACHER', bio: 'Profesora de programación con 10 años de experiencia' },
  });
  const student = await prisma.user.create({
    data: { name: 'Carlos Martínez', email: 'student@redoc.com', password: hashedStudent, role: 'STUDENT' },
  });
  const teacher2 = await prisma.user.create({
    data: { name: 'Prof. Luis Rodríguez', email: 'luis@redoc.com', password: hashedTeacher, role: 'TEACHER', bio: 'Especialista en redes y sistemas operativos' },
  });

  console.log('Users created');

  // --- Categories ---
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Programación', slug: 'programacion', description: 'Lenguajes y frameworks de programación', icon: 'code', color: '#3B82F6' } }),
    prisma.category.create({ data: { name: 'Redes', slug: 'redes', description: 'Networking y telecomunicaciones', icon: 'wifi', color: '#10B981' } }),
    prisma.category.create({ data: { name: 'Bases de Datos', slug: 'bases-de-datos', description: 'Gestión y administración de bases de datos', icon: 'database', color: '#F59E0B' } }),
    prisma.category.create({ data: { name: 'Matemáticas', slug: 'matematicas', description: 'Álgebra, cálculo, estadística', icon: 'calculator', color: '#EF4444' } }),
    prisma.category.create({ data: { name: 'Ciencias', slug: 'ciencias', description: 'Física, química, biología', icon: 'flask', color: '#8B5CF6' } }),
    prisma.category.create({ data: { name: 'Idiomas', slug: 'idiomas', description: 'Aprendizaje de idiomas', icon: 'globe', color: '#EC4899' } }),
    prisma.category.create({ data: { name: 'Diseño', slug: 'diseno', description: 'Diseño gráfico, UI/UX', icon: 'palette', color: '#F97316' } }),
    prisma.category.create({ data: { name: 'Sistemas Operativos', slug: 'sistemas-operativos', description: 'Linux, Windows, administración de sistemas', icon: 'terminal', color: '#6366F1' } }),
  ]);

  console.log('Categories created');

  // --- Subcategories ---
  const subcategories = {};

  // Programación
  subcategories.javascript = await prisma.subcategory.create({ data: { name: 'JavaScript', slug: 'javascript', categoryId: categories[0].id } });
  subcategories.python = await prisma.subcategory.create({ data: { name: 'Python', slug: 'python', categoryId: categories[0].id } });
  subcategories.react = await prisma.subcategory.create({ data: { name: 'React', slug: 'react', categoryId: categories[0].id } });
  subcategories.nodejs = await prisma.subcategory.create({ data: { name: 'Node.js', slug: 'nodejs', categoryId: categories[0].id } });
  subcategories.java = await prisma.subcategory.create({ data: { name: 'Java', slug: 'java', categoryId: categories[0].id } });

  // Redes
  subcategories.tcp = await prisma.subcategory.create({ data: { name: 'TCP/IP', slug: 'tcp-ip', categoryId: categories[1].id } });
  subcategories.seguridad = await prisma.subcategory.create({ data: { name: 'Seguridad', slug: 'seguridad', categoryId: categories[1].id } });

  // Bases de Datos
  subcategories.sql = await prisma.subcategory.create({ data: { name: 'SQL', slug: 'sql', categoryId: categories[2].id } });
  subcategories.nosql = await prisma.subcategory.create({ data: { name: 'NoSQL', slug: 'nosql', categoryId: categories[2].id } });
  subcategories.postgresql = await prisma.subcategory.create({ data: { name: 'PostgreSQL', slug: 'postgresql', categoryId: categories[2].id } });

  // Matemáticas
  subcategories.algebra = await prisma.subcategory.create({ data: { name: 'Álgebra', slug: 'algebra', categoryId: categories[3].id } });
  subcategories.calculo = await prisma.subcategory.create({ data: { name: 'Cálculo', slug: 'calculo', categoryId: categories[3].id } });

  // Ciencias
  subcategories.fisica = await prisma.subcategory.create({ data: { name: 'Física', slug: 'fisica', categoryId: categories[4].id } });

  // Idiomas
  subcategories.ingles = await prisma.subcategory.create({ data: { name: 'Inglés', slug: 'ingles', categoryId: categories[5].id } });

  // Diseño
  subcategories.uiux = await prisma.subcategory.create({ data: { name: 'UI/UX', slug: 'ui-ux', categoryId: categories[6].id } });

  // Sistemas Operativos
  subcategories.linux = await prisma.subcategory.create({ data: { name: 'Linux', slug: 'linux', categoryId: categories[7].id } });

  console.log('Subcategories created');

  // --- Courses ---
  const course1 = await prisma.course.create({
    data: {
      title: 'JavaScript Moderno: De Cero a Experto',
      description: 'Aprende JavaScript desde los fundamentos hasta las técnicas más avanzadas. Incluye ES6+, programación asíncrona, y patrones de diseño.',
      shortDescription: 'Domina JavaScript moderno con este curso completo',
      teacherId: teacher.id,
      categoryId: categories[0].id,
      subcategoryId: subcategories.javascript.id,
      difficulty: 'BEGINNER',
      status: 'PUBLISHED',
      tags: ['javascript', 'es6', 'web', 'frontend'],
      totalDuration: 1200,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'React 19: Desarrollo de Aplicaciones Web',
      description: 'Construye aplicaciones web modernas con React 19. Hooks, Context API, React Router, y más.',
      shortDescription: 'Crea apps web profesionales con React 19',
      teacherId: teacher.id,
      categoryId: categories[0].id,
      subcategoryId: subcategories.react.id,
      difficulty: 'INTERMEDIATE',
      status: 'PUBLISHED',
      tags: ['react', 'frontend', 'spa', 'hooks'],
      totalDuration: 1800,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'PostgreSQL: Administración y Optimización',
      description: 'Aprende a administrar y optimizar bases de datos PostgreSQL. Desde instalación hasta tuning avanzado.',
      shortDescription: 'Domina PostgreSQL como un profesional',
      teacherId: teacher2.id,
      categoryId: categories[2].id,
      subcategoryId: subcategories.postgresql.id,
      difficulty: 'INTERMEDIATE',
      status: 'PUBLISHED',
      tags: ['postgresql', 'sql', 'database', 'backend'],
      totalDuration: 900,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'Redes: Fundamentos de TCP/IP',
      description: 'Comprende el modelo TCP/IP, protocolos de red, y configuración básica.',
      shortDescription: 'Fundamentos esenciales de networking',
      teacherId: teacher2.id,
      categoryId: categories[1].id,
      subcategoryId: subcategories.tcp.id,
      difficulty: 'BEGINNER',
      status: 'PUBLISHED',
      tags: ['redes', 'tcp', 'networking'],
      totalDuration: 600,
    },
  });

  console.log('Courses created');

  // --- Modules & Lessons ---
  // Course 1 modules
  const mod1_1 = await prisma.module.create({
    data: { title: 'Fundamentos de JavaScript', description: 'Variables, tipos de datos y operadores', order: 1, courseId: course1.id },
  });
  const mod1_2 = await prisma.module.create({
    data: { title: 'Funciones y Scope', description: 'Functions, closures, y scope chain', order: 2, courseId: course1.id },
  });
  const mod1_3 = await prisma.module.create({
    data: { title: 'ES6+ Features', description: 'Arrow functions, destructuring, modules', order: 3, courseId: course1.id },
  });

  // Course 1 lessons
  const lesson1_1 = await prisma.lesson.create({ data: { title: 'Introducción a JavaScript', description: 'Historia y configuración del entorno', content: 'JavaScript es un lenguaje de programación...', duration: 15, order: 1, isFree: true, moduleId: mod1_1.id } });
  const lesson1_2 = await prisma.lesson.create({ data: { title: 'Variables y Tipos de Datos', description: 'let, const, var y tipos primitivos', content: 'En JavaScript tenemos tres formas de declarar variables...', duration: 20, order: 2, moduleId: mod1_1.id } });
  const lesson1_3 = await prisma.lesson.create({ data: { title: 'Operadores', description: 'Aritméticos, lógicos y de comparación', content: 'Los operadores en JavaScript...', duration: 18, order: 3, moduleId: mod1_1.id } });
  const lesson1_4 = await prisma.lesson.create({ data: { title: 'Declaración de Funciones', description: 'Function declarations vs expressions', duration: 22, order: 1, moduleId: mod1_2.id } });
  const lesson1_5 = await prisma.lesson.create({ data: { title: 'Closures', description: 'Entendiendo closures en JavaScript', duration: 25, order: 2, moduleId: mod1_2.id } });
  await prisma.lesson.create({ data: { title: 'Arrow Functions', description: 'Sintaxis y diferencias con funciones regulares', duration: 15, order: 1, moduleId: mod1_3.id } });
  await prisma.lesson.create({ data: { title: 'Destructuring', description: 'Arrays y objetos', duration: 20, order: 2, moduleId: mod1_3.id } });

  // Course 2 modules
  const mod2_1 = await prisma.module.create({
    data: { title: 'Introducción a React', description: 'JSX, componentes y props', order: 1, courseId: course2.id },
  });
  const mod2_2 = await prisma.module.create({
    data: { title: 'Hooks', description: 'useState, useEffect, custom hooks', order: 2, courseId: course2.id },
  });

  await prisma.lesson.create({ data: { title: '¿Qué es React?', description: 'Introducción al framework', duration: 12, order: 1, isFree: true, moduleId: mod2_1.id } });
  await prisma.lesson.create({ data: { title: 'JSX y Componentes', description: 'Crear componentes funcionales', duration: 25, order: 2, moduleId: mod2_1.id } });
  await prisma.lesson.create({ data: { title: 'useState', description: 'Manejo de estado local', duration: 20, order: 1, moduleId: mod2_2.id } });
  await prisma.lesson.create({ data: { title: 'useEffect', description: 'Efectos secundarios', duration: 22, order: 2, moduleId: mod2_2.id } });

  // Course 3 modules
  const mod3_1 = await prisma.module.create({
    data: { title: 'Instalación y Configuración', order: 1, courseId: course3.id },
  });
  await prisma.lesson.create({ data: { title: 'Instalación de PostgreSQL', duration: 15, order: 1, isFree: true, moduleId: mod3_1.id } });
  await prisma.lesson.create({ data: { title: 'Configuración inicial', duration: 18, order: 2, moduleId: mod3_1.id } });

  // Course 4 modules
  const mod4_1 = await prisma.module.create({
    data: { title: 'Modelo OSI y TCP/IP', order: 1, courseId: course4.id },
  });
  await prisma.lesson.create({ data: { title: 'Modelo OSI', duration: 20, order: 1, isFree: true, moduleId: mod4_1.id } });
  await prisma.lesson.create({ data: { title: 'Protocolo TCP', duration: 25, order: 2, moduleId: mod4_1.id } });

  console.log('Modules & lessons created');

  // --- Resources ---
  const resources = await Promise.all([
    prisma.resource.create({ data: { title: 'Guía JavaScript ES6+', description: 'Referencia completa de ES6 y posteriores', fileUrl: 'https://example.com/js-es6-guide.pdf', fileType: 'PDF', fileSize: 2500000, mimeType: 'application/pdf', downloadCount: 45, teacherId: teacher.id, subcategoryId: subcategories.javascript.id } }),
    prisma.resource.create({ data: { title: 'Tutorial React Hooks', description: 'Video tutorial sobre React Hooks', fileUrl: 'https://example.com/react-hooks.mp4', fileType: 'VIDEO', fileSize: 150000000, mimeType: 'video/mp4', downloadCount: 32, teacherId: teacher.id, subcategoryId: subcategories.react.id } }),
    prisma.resource.create({ data: { title: 'Node.js Cheatsheet', description: 'Referencia rápida de Node.js y Express', fileUrl: 'https://example.com/nodejs-cheatsheet.pdf', fileType: 'PDF', fileSize: 1200000, mimeType: 'application/pdf', downloadCount: 28, teacherId: teacher.id, subcategoryId: subcategories.nodejs.id } }),
    prisma.resource.create({ data: { title: 'SQL Fundamentos', description: 'Documento con los fundamentos de SQL', fileUrl: 'https://example.com/sql-basics.pdf', fileType: 'PDF', fileSize: 3200000, mimeType: 'application/pdf', downloadCount: 56, teacherId: teacher2.id, subcategoryId: subcategories.sql.id } }),
    prisma.resource.create({ data: { title: 'PostgreSQL Avanzado', description: 'Guía avanzada de PostgreSQL', fileUrl: 'https://example.com/pg-advanced.pdf', fileType: 'PDF', fileSize: 4100000, mimeType: 'application/pdf', downloadCount: 22, teacherId: teacher2.id, subcategoryId: subcategories.postgresql.id } }),
    prisma.resource.create({ data: { title: 'Python para Principiantes', description: 'Introducción a Python 3', fileUrl: 'https://example.com/python-intro.pdf', fileType: 'PDF', fileSize: 2800000, mimeType: 'application/pdf', downloadCount: 67, teacherId: teacher.id, subcategoryId: subcategories.python.id } }),
    prisma.resource.create({ data: { title: 'Diseño UI/UX Principios', description: 'Principios fundamentales de diseño', fileUrl: 'https://example.com/uiux-principles.pdf', fileType: 'PDF', fileSize: 5600000, mimeType: 'application/pdf', downloadCount: 41, teacherId: teacher.id, subcategoryId: subcategories.uiux.id } }),
    prisma.resource.create({ data: { title: 'Linux Terminal Basics', description: 'Comandos esenciales de Linux', fileUrl: 'https://example.com/linux-terminal.pdf', fileType: 'PDF', fileSize: 1800000, mimeType: 'application/pdf', downloadCount: 38, teacherId: teacher2.id, subcategoryId: subcategories.linux.id } }),
    prisma.resource.create({ data: { title: 'Redes - Modelo OSI', description: 'Explicación detallada del modelo OSI', fileUrl: 'https://example.com/osi-model.pdf', fileType: 'PDF', fileSize: 2100000, mimeType: 'application/pdf', downloadCount: 19, teacherId: teacher2.id, subcategoryId: subcategories.tcp.id } }),
    prisma.resource.create({ data: { title: 'Java OOP Tutorial', description: 'Programación orientada a objetos en Java', fileUrl: 'https://example.com/java-oop.mp4', fileType: 'VIDEO', fileSize: 200000000, mimeType: 'video/mp4', downloadCount: 25, teacherId: teacher.id, subcategoryId: subcategories.java.id } }),
    prisma.resource.create({ data: { title: 'Álgebra Lineal Resumen', description: 'Resumen de álgebra lineal', fileUrl: 'https://example.com/algebra-linear.pdf', fileType: 'PDF', fileSize: 1500000, mimeType: 'application/pdf', downloadCount: 15, teacherId: teacher2.id, subcategoryId: subcategories.algebra.id } }),
    prisma.resource.create({ data: { title: 'Cálculo Diferencial', description: 'Apuntes de cálculo diferencial', fileUrl: 'https://example.com/calculo.pdf', fileType: 'DOCUMENT', fileSize: 3400000, mimeType: 'application/pdf', downloadCount: 33, teacherId: teacher2.id, subcategoryId: subcategories.calculo.id } }),
  ]);

  console.log('Resources created');

  // --- Enrollments ---
  const enrollment1 = await prisma.enrollment.create({
    data: { userId: student.id, courseId: course1.id, progress: 42.8 },
  });
  await prisma.enrollment.create({
    data: { userId: student.id, courseId: course2.id, progress: 0 },
  });
  await prisma.enrollment.create({
    data: { userId: student.id, courseId: course4.id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
  });

  console.log('Enrollments created');

  // --- Lesson Progress ---
  await prisma.lessonProgress.create({ data: { userId: student.id, lessonId: lesson1_1.id, completed: true, completedAt: new Date() } });
  await prisma.lessonProgress.create({ data: { userId: student.id, lessonId: lesson1_2.id, completed: true, completedAt: new Date() } });
  await prisma.lessonProgress.create({ data: { userId: student.id, lessonId: lesson1_3.id, completed: true, completedAt: new Date() } });

  console.log('Lesson progress created');

  // --- Reviews ---
  await prisma.review.create({ data: { rating: 5, comment: '¡Excelente curso! Muy bien explicado.', userId: student.id, courseId: course1.id } });
  await prisma.review.create({ data: { rating: 4, comment: 'Buen curso de redes, muy completo.', userId: student.id, courseId: course4.id } });

  console.log('Reviews created');

  // --- Favorites ---
  await prisma.favorite.create({ data: { userId: student.id, resourceId: resources[0].id } });
  await prisma.favorite.create({ data: { userId: student.id, resourceId: resources[1].id } });
  await prisma.favorite.create({ data: { userId: student.id, resourceId: resources[5].id } });

  console.log('Favorites created');

  // --- Downloads ---
  await prisma.download.create({ data: { userId: student.id, resourceId: resources[0].id } });
  await prisma.download.create({ data: { userId: student.id, resourceId: resources[3].id } });
  await prisma.download.create({ data: { userId: student.id, resourceId: resources[5].id } });

  console.log('Downloads created');

  // --- Certificate for completed course ---
  await prisma.certificate.create({
    data: { uniqueCode: 'CERT-ABC123DEF456', userId: student.id, courseId: course4.id },
  });

  console.log('Certificate created');

  // --- Notifications ---
  await prisma.notification.create({
    data: { userId: student.id, title: 'Bienvenido a Redoc Academy', message: 'Tu cuenta ha sido creada exitosamente. ¡Explora nuestros cursos!', type: 'welcome' },
  });
  await prisma.notification.create({
    data: { userId: student.id, title: 'Nuevo curso disponible', message: 'React 19: Desarrollo de Aplicaciones Web ya está disponible', type: 'course', link: `/courses/${course2.id}` },
  });

  console.log('Notifications created');

  // --- Messages ---
  await prisma.message.create({
    data: { subject: 'Bienvenido al curso', content: '¡Hola Carlos! Bienvenido al curso de JavaScript. Si tienes alguna duda, no dudes en escribirme.', senderId: teacher.id, receiverId: student.id },
  });

  console.log('Messages created');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
