import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadStatusMiddleware.js";
import { uploadStatusMedia, createStatus, getAllStatuses, getUserStatuses, } from "../controllers/statusController.js";

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

// Get all statuses
router.get("/all", authMiddleware, getAllStatuses);

// Get statuses by user
router.get("/user/:userId", authMiddleware, getUserStatuses);

export default router;
