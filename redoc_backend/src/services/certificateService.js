const crypto = require('crypto');
const prisma = require('../config/prisma');

const generateCertificate = async (userId, courseId) => {
  // Check enrollment is completed
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });

  if (!enrollment || enrollment.status !== 'COMPLETED') {
    return { error: 'Debes completar el curso para obtener el certificado' };
  }

  // Check if certificate already exists
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });

  if (existing) {
    return prisma.certificate.findUnique({
      where: { id: existing.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });
  }

  const uniqueCode = `CERT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

  return prisma.certificate.create({
    data: { uniqueCode, userId, courseId: parseInt(courseId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
  });
};

const getMyCertificates = async (userId) => {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: { id: true, title: true, thumbnailUrl: true },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });
};

const verifyCertificate = async (code) => {
  return prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });
};

module.exports = { generateCertificate, getMyCertificates, verifyCertificate };
