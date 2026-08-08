const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { escapeHtml } = require('../utils/validation');

let cachedTransporter;

const getTransportOptions = (env = process.env) => {
  const port = Number(env.SMTP_PORT || 587);
  return {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 4000,
    rateLimit: 14,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  };
};

const getTransporter = (env = process.env) => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    const error = new Error('SMTP credentials are not configured.');
    error.code = 'SMTP_ERROR';
    throw error;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport(getTransportOptions(env));
  }
  return cachedTransporter;
};

const defaultSleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const sendWithRetry = async (
  transporter,
  mailOptions,
  { maxAttempts = 3, baseDelayMs = 1000, sleep = defaultSleep } = {}
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      logger.warn(`Email send failed; retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
      await sleep(delay);
    }
  }
  throw new Error('Email delivery failed.');
};

const createAutoReply = ({ name, email, message }, env) => {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return {
    from: `"Abdullah Al Mamun" <${env.SMTP_USER}>`,
    to: email,
    subject: `Thank You for Reaching Out, ${safeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #172033;">
        <h1 style="color: #3157c8; font-size: 24px;">Thank you for reaching out</h1>
        <p>Dear ${safeName},</p>
        <p>I have received your message and will respond within 24–48 hours.</p>
        <div style="background: #f4f6fa; border-left: 4px solid #3157c8; padding: 16px; margin: 24px 0;">
          <strong>Your message</strong><br>${safeMessage}
        </div>
        <p>Best regards,<br><strong>Abdullah Al Mamun</strong></p>
      </div>
    `,
  };
};

const createNotification = ({ name, email, message }, env) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return {
    from: `"Portfolio Contact" <${env.SMTP_USER}>`,
    to: env.CONTACT_EMAIL || env.SMTP_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${safeName}`,
    html: `
      <h2>New portfolio contact</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  };
};

const sendContactEmail = async (
  payload,
  { transporter, sleep = defaultSleep, env = process.env } = {}
) => {
  const mailer = transporter || getTransporter(env);
  const retryOptions = { sleep };
  const notification = createNotification(payload, env);
  const autoReply = createAutoReply(payload, env);

  try {
    await Promise.all([
      sendWithRetry(mailer, notification, retryOptions),
      sendWithRetry(mailer, autoReply, retryOptions).catch((error) => {
        logger.warn(`Auto-reply failed: ${error.message}`);
      }),
    ]);
    logger.info('Contact form notification delivered');
  } catch (error) {
    logger.error(`Email service error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTransportOptions,
  sendWithRetry,
  sendContactEmail,
};
