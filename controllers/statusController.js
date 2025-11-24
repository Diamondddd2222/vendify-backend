import fs from "fs";
import path from "path";
import Status from "../models/Status.js";
import cloudinary from "../config/cloudinary.js";
import { uploadDirStatus } from "../middlewares/uploadStatusMiddleware.js";
import User from "../models/User.js";

// -------------------------------
// 1️⃣ Upload media only
// -------------------------------
export const uploadStatusMedia = async (req, res) => {
  try {
    console.log("🔥 FILE RECEIVED:", req.file);
    console.log("🔥 USER:", req.user)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!fs.existsSync(uploadDirStatus)) {
    fs.mkdirSync(uploadDirStatus, { recursive: true });
    }
    const filePath = path.join(uploadDirStatus, req.file.filename);
    console.log("req.file:", req.file);
    console.log("File path:", filePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
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
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { storeId, mediaUrl, mediaType, caption } = req.body;

    if (!mediaUrl || !mediaType) {
      return res.status(400).json({ message: "Media URL or mediaType missing" });
    }

    // Get logged-in user
    const user = await User.findById(userId).select("brandName storeName");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Choose correct brand field
    const brandName = user.brandName || user.storeName || "Unknown Brand";

    const newStatus = await Status.create({
      userId,
      brandName,       // ⭐ save brand name
      storeId,
      mediaUrl,
      mediaType,
      caption: caption || "",
    });

    return res.status(201).json({
      message: "Status created successfully",
      status: newStatus,
    });

  } catch (error) {
    console.error("Create status error:", error);
    return res.status(500).json({
      message: "Failed to create status",
      error: error.message,
    });
  }
};


// Fetch all statuses
export const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find()
      .sort({ createdAt: -1 }) // newest first
      .populate("userId", "storeName logo brandName");

    res.status(200).json({ statuses });
  } catch (error) {
    console.error("Get statuses error:", error);
    res.status(500).json({ message: "Failed to fetch statuses", error: error.message });
  }
};

// Fetch statuses by user ID
export const getUserStatuses = async (req, res) => {
  try {
    const { userId } = req.params;
    const statuses = await Status.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("userId", "storeName logo");

    res.status(200).json({ statuses });
  } catch (error) {
    console.error("Get user statuses error:", error);
    res.status(500).json({ message: "Failed to fetch user statuses", error: error.message });
  }
};