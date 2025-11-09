// middleware/uploadMiddleware.js
// -----------------------------------------------------------------------------
// This file handles all file upload logic using Multer.
// It defines how and where files are stored, what file types are allowed,
// and returns a configured `upload` instance you can use in routes.
// -----------------------------------------------------------------------------

import multer from "multer";
import path from "path";

// ---------------------- Storage Configuration ----------------------
// The `storage` option tells Multer *where* to save files and *how* to name them.
// Here we save uploaded files into an "uploads" folder with unique names.

const storage = multer.diskStorage({
  // Destination: defines where to store uploaded files.
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure the folder exists before running the server.
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

  // If file type is valid → accept it
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Otherwise, reject and send an error
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
