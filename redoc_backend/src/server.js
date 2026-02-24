const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');

const start = async () => {
  // Conectar a la base de datos
  await connectDB();

  // Levantar servidor
  app.listen(config.port, () => {
    logger.info(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    logger.info(`📚 API disponible en http://localhost:${config.port}/api/v1`);
    logger.info(`🌍 Entorno: ${config.nodeEnv}`);
  });
};

start().catch((err) => {
  logger.error('Error iniciando servidor:', err);
  process.exit(1);
});