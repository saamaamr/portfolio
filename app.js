const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('./utils/logger');
const indexRouter = require('./routes/index');
const { errorHandler } = require('./utils/errorHandler');

dotenv.config();

// Validate required environment variables
const requiredEnvs = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  logger.warn(`Missing environment variables: ${missingEnvs.join(', ')}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security & Performance Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://www.googletagmanager.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  })
);
app.use(compression()); // Gzip compression
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Limit payload size
app.use(express.json({ limit: '10kb' }));

// Static files with caching
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache for 1 day
    etag: false,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// Routes
app.use('/', indexRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('index');
});

// Global error handler (must be last)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Portfolio server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    logger.error(`Server error: ${err.message}`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;