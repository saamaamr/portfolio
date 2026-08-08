require('dotenv').config({ quiet: true });

const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Portfolio server running on http://localhost:${port}`);
});

server.on('error', (error) => {
  logger.error(`Server error: ${error.message}`);
  process.exitCode = 1;
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
  });
});
