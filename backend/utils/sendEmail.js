const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using SMTP credentials from environment vars.
 * Compatible with Gmail (use an App Password, not your account password).
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the configured transporter.
 *
 * @param {Object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html    - HTML body content
 * @returns {Promise<Object>}      - Nodemailer send info object
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"EventSphere" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
