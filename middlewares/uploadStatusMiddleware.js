// middleware/uploadMiddleware.js
// -----------------------------------------------------------------------------
// Handles all file upload logic using Multer.
// Defines how and where files are stored, what file types are allowed,
// and exports a configured `upload` instance.
// -----------------------------------------------------------------------------

import multer from "multer";
import path from "path";
import fs from "fs"; 


// ---------------------- Storage Configuration ----------------------
// Define the upload directory
export const uploadDirStatus = "uploadsStatus";

// ✅ Ensure that the uploads folder exists when the server starts
if (!fs.existsSync(uploadDirStatus)) {
  fs.mkdirSync(uploadDirStatus, { recursive: true });
  console.log(`📁 Created missing directory: ${uploadDirStatus}`);
}

const storage = multer.diskStorage({
  // Destination: defines where to store uploaded files.
  destination: (req, file, cb) => {
    cb(null, uploadDirStatus); // Folder is guaranteed to exist now.
  },

  // Filename: defines the name format for each saved file.
  filename: (req, file, cb) => {
    // Example filename: 1699455543921-123456789.png
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // `path.extname()` extracts the file extension (.jpg, .png, etc.)
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/mpeg"];
  if (imageTypes.includes(file.mimetype) || videoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed."), false);
  }
};

// Global limit set to max video size (20MB). We'll check images smaller later.
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

export default upload;
