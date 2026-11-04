const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Disk storage configuration ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Build a unique filename: fieldname-timestamp-random.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ─── File filter: images only ─────────────────────────────────────────────────
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed.'
      ),
      false
    );
  }
};

// ─── Base multer instance ─────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/**
 * Upload a single file from the given form field.
 * @param {string} fieldName - The name of the form field.
 */
const uploadSingle = (fieldName) => upload.single(fieldName);

/**
 * Upload multiple files from the given form field.
 * @param {string} fieldName - The name of the form field.
 * @param {number} maxCount  - Maximum number of files allowed.
 */
const uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
