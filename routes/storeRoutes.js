// backend/routes/storeRoutes.js
import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createStore } from "../controllers/storeController.js";

const router = express.Router();

// multer temp storage (will upload to Cloudinary then remove)
const upload = multer({ dest: "uploads/" });

router.post("/create", authMiddleware, upload.single("logo"), createStore);

export default router;
