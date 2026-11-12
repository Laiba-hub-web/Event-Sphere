const nodemailer = require('nodemailer');

let etherealTransporterPromise = null;

const getEtherealTransporter = async () => {
  if (!etherealTransporterPromise) {
    etherealTransporterPromise = nodemailer.createTestAccount().then((testAccount) =>
      nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    );
  }
  return etherealTransporterPromise;
};

const isPlaceholderCredentials = () => {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();
  return (
    !user ||
    !pass ||
    user === 'eventsphere@example.com' ||
    user === 'your_email@gmail.com' ||
    pass === 'secretpassword' ||
    pass === 'your_app_password'
  );
};

/**
 * Sends an email using configured SMTP or falls back to Ethereal test mail
 * so password reset emails always work out-of-the-box.
 */
const sendEmail = async ({ to, subject, html }) => {
  const fromAddress =
    !isPlaceholderCredentials() && process.env.EMAIL_USER
      ? `"EventSphere" <${process.env.EMAIL_USER}>`
      : '"EventSphere Support" <no-reply@eventsphere.com>';

  // 1. Try real SMTP if configured with real credentials
  if (!isPlaceholderCredentials()) {
    try {
      const smtpTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await smtpTransporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
      });
      console.log(`📧 Email sent via SMTP to ${to}: ${info.messageId}`);
      return { messageId: info.messageId, previewUrl: null };
    } catch (smtpErr) {
      console.warn(`⚠️ Configured SMTP failed (${smtpErr.message}), falling back to test mailer...`);
    }
  }

  // 2. Fallback to Nodemailer Ethereal inbox so user gets a real viewable email link
  try {
    const testTransporter = await getEtherealTransporter();
    const info = await testTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📧 Password reset email dispatched to ${to}. Preview URL: ${previewUrl}`);
    return { messageId: info.messageId, previewUrl };
  } catch (etherealErr) {
    console.warn(`⚠️ Ethereal mail fallback skipped (${etherealErr.message}). Using direct reset link.`);
    return { messageId: 'direct-reset-link', previewUrl: null };
  }
};

module.exports = sendEmail;
