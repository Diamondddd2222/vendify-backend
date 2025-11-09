// backend/controllers/storeController.js
import fs from "fs";
import Store from "../models/Store.js";
import cloudinary from "../config/cloudinary.js";

export const createStore = async (req, res) => {
  try {
    const { name, description, category, email, phone } = req.body;
    const userId = req.user?.id || req.body.userId; // authMiddleware should set req.user

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!name || !category) return res.status(400).json({ message: "Name and category are required" });

    // format storeLink (slug) and ensure uniqueness
    const baseSlug = name.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    let storeLink = `${baseSlug}`;
    
    // ensure unique by appending short id if collision
    const existing = await Store.findOne({ storeLink });
    if (existing) {
      storeLink = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Upload logo to Cloudinary (if provided)
    let logoUrl = "";
    if (req.file) {
      // upload the temporary file path to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "vendify/stores",
        use_filename: true,
        unique_filename: false,
      });
      logoUrl = result.secure_url || result.url;

      // remove temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove temp file:", err);
      });
    }

    // create store document
    const store = await Store.create({
      userId,
      name,
      category,
      description,
      email,
      phone,
      logoUrl,
      storeLink,
    });

    // return store and the public store URL
    res.status(201).json({
      message: "Store created successfully",
      store,
      storeLink,
    });
  } catch (error) {
    console.error("Error creating store:", error);
    // if multer left a file, try to remove it
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};
