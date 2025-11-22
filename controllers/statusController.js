import fs from "fs";
import path from "path";
import Status from "../models/Status.js";
import cloudinary from "../config/cloudinary.js";
import { uploadDirStatus } from "../middlewares/uploadStatusMiddleware.js";

// -------------------------------
// 1️⃣ Upload media only
// -------------------------------
export const uploadStatusMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = path.join(uploadDirStatus, req.file.filename);

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "vendify/statuses",
      resource_type: "auto",
    });

    // Remove file from disk
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    // Send media info to frontend
    return res.status(200).json({
      message: "Media uploaded",
      mediaUrl: result.secure_url,
      mediaType: result.resource_type,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


// -------------------------------
// 2️⃣ Create status record in DB
// -------------------------------
export const createStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { storeId, mediaUrl, mediaType, caption } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mediaUrl) return res.status(400).json({ message: "Media URL missing" });

    const newStatus = await Status.create({
      user: userId,
      storeId,
      mediaUrl,
      mediaType,
      caption: caption || "",
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Status created successfully",
      status: newStatus,
    });

  } catch (error) {
    console.error("Create status error:", error);
    return res.status(500).json({ message: "Failed to create status", error: error.message });
  }
};
