import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadStatusMiddleware.js";
import { uploadStatusMedia, createStatus } from "../controllers/statusController.js";

const router = express.Router();

// Upload media only
router.post(
  "/upload",
  authMiddleware,
  upload.single("media"),
  uploadStatusMedia
);

// Create status with caption
router.post("/create", authMiddleware, createStatus);

export default router;
