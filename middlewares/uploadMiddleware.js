// middleware/uploadMiddleware.js
// -----------------------------------------------------------------------------
// Handles all file upload logic using Multer.
// Defines how and where files are stored, what file types are allowed,
// and exports a configured `upload` instance.
// -----------------------------------------------------------------------------

import multer from "multer";
import path from "path";
import fs from "fs"; // ✅ You forgot this import!

// ---------------------- Storage Configuration ----------------------
// Define the upload directory
const uploadDir = "uploads";

// ✅ Ensure that the uploads folder exists when the server starts
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Created missing directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
  // Destination: defines where to store uploaded files.
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Folder is guaranteed to exist now.
  },

  // Filename: defines the name format for each saved file.
  filename: (req, file, cb) => {
    // Example filename: 1699455543921-123456789.png
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // `path.extname()` extracts the file extension (.jpg, .png, etc.)
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ---------------------- File Type Filtering ----------------------
// This function decides whether to accept or reject an uploaded file.
// Only certain image MIME types are allowed.

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, jpg, gif)."));
  }
};

// ---------------------- Multer Setup ----------------------
// Create and export a Multer instance configured with our settings.

export const upload = multer({
  storage,       // Use our custom storage logic
  fileFilter,    // Apply file type filtering
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: max file size = 5MB
});
