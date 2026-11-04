const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique QR code string using UUID v4.
 * This value is stored on the Registration document and can be encoded
 * into an actual QR image on the frontend using a library like qrcode.react.
 *
 * @returns {string} A unique UUID string
 */
const generateQRCode = () => uuidv4();

module.exports = generateQRCode;
