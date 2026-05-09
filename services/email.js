const nodemailer = require('nodemailer');

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('[WARNING] SMTP credentials not configured. Email service will not work.');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendAutoReply = async ({ name, email, message }) => {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const mailOptions = {
    from: `"Abdullah Al Mamun" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Thank You for Reaching Out, ${safeName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #8B5CF6; margin: 0; font-size: 24px;">Thank You!</h1>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${safeName},</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thank you for reaching out to me. I have received your message and appreciate your interest.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          I will review your inquiry and get back to you within <strong>48–72 hours</strong>. Please feel free to reply directly to this email if you have any additional information to share.
        </p>
        <div style="background: #F8FAFC; border-left: 4px solid #8B5CF6; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748B; font-weight: 600;">Your message:</p>
          <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.5;">${safeMessage}</p>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #8B5CF6;">Abdullah Al Mamun</strong></p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
        <p style="font-size: 12px; color: #94A3B8; text-align: center;">This email was sent automatically. Please do not reply to this address.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendContactEmail = async ({ name, email, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const notification = transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${safeName}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
      <hr>
      <p><em>Sent from your portfolio website</em></p>
    `,
  });

  const autoReply = sendAutoReply({ name, email, message }).catch((err) => {
    console.error(`[${new Date().toISOString()}] Auto-reply failed:`, err.message);
  });

  await Promise.all([notification, autoReply]);
};

module.exports = { sendContactEmail };