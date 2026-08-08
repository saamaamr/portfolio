require('dotenv').config({ quiet: true });

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('./utils/logger');
const indexRouter = require('./routes/index');
const { errorHandler } = require('./utils/errorHandler');
const { buildPageContext, SUPPORTED_LOCALES } = require('./utils/i18n');

// Validate required environment variables
const requiredEnvs = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  logger.warn(`Missing environment variables: ${missingEnvs.join(', ')}`);
}

const app = express();
app.set('trust proxy', 1);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Security & Performance Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
        scriptSrcAttr: ["'none'"],
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
    });
  });
  next();
});

// Routes
app.use('/', indexRouter);

// 404 handler
app.use((req, res) => {
  const pathLocale = req.path.split('/').filter(Boolean)[0];
  const locale = SUPPORTED_LOCALES.some(({ code }) => code === pathLocale)
    ? pathLocale
    : 'en-US';
  const context = buildPageContext(locale, {
    metaRobots: 'noindex, nofollow',
    canonicalUrl: null,
    includeStructuredData: false,
  });
  context.pageTitle = `${context.t('notFound.title')} | Abdullah Al Mamun`;
  res.status(404).render('404', context);
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
