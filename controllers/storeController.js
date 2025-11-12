// backend/controllers/storeController.js
import fs from "fs";
import Store from "../models/Store.js";
import cloudinary from "../config/cloudinary.js";

export const createStore = async (req, res) => {
  try {
    const { name, description, category, email, phone } = req.body;

    // Always use the logged-in user's ID from authMiddleware
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!name || !category)
      return res.status(400).json({ message: "Name and category are required" });

    // Check if email is already used
    const emailExists = await Store.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already in use for another store" });

    // Generate storeLink (slug)
    const baseSlug = name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    let storeLink = baseSlug;

    // Ensure unique storeLink
    const existing = await Store.findOne({ storeLink });
    if (existing) {
      storeLink = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Upload logo if provided
    let logoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "vendify/stores",
        use_filename: true,
        unique_filename: false,
      });
      logoUrl = result.secure_url || result.url;

      // Remove temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove temp file:", err);
      });
    }

    // Create the store document linked to this user
    const store = await Store.create({
      userId,       // <-- attached to logged-in user
      name,
      category,
      description,
      email,
      phone,
      logoUrl,
      storeLink,
    });

    // Return store info and public store URL
    res.status(201).json({
      message: "Store created successfully",
      store,
      storeLink,
    });
  } catch (error) {
    console.error("Error creating store:", error);

    // Cleanup temp file if exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};


// GET /api/store/my-store
export const getUserStore = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const store = await Store.findOne({ userId});
    if (!store) {
      return res.status(404).json({ message: "Please create a store to enjoy Vendify" });
    }

    res.status(200).json({ store });
  } catch (error) {
    console.error("Error fetching user store:", error);
    res.status(500).json({ message: "Failed to fetch store info", error: error.message });
  }
};

// GET /api/stores/reqstores
export const getAllStores =  async (req, res) => {
  try {
    const allStores = await Store.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ success: true, allStores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

