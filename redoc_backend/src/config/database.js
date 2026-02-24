const prisma = require('./prisma');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL conectado exitosamente via Prisma');
  } catch (error) {
    logger.error('Error conectando a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
