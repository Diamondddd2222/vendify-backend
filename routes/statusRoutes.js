import multer from "multer"; // add this
import express from "express";
import { upload } from '../middlewares/uploadStatusMiddleware.js'
import authMiddleware from "../middlewares/authMiddleware.js";
import {uploadStatusMedia, createStatus} from "../controllers/statusController.js";

const router = express.Router();

router.post ('/upload', authMiddleware, upload.single("media"), async (req, res) =>{
    try {
         if (!req.file) return res.status(400).json({ message: "No file uploaded." });
    } catch (error) {
         console.error("Status upload error:", err);
         return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
    next()
}, uploadStatusMedia )

router.post('/create', createStatus );

export default router;