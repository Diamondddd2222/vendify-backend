// backend/routes/storeRoutes.js
import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { storeValidationRules, validateStore } from "../middlewares/storeValidator.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createStore } from "../controllers/storeController.js";

const router = express.Router();


router.post(
  "/create",
  authMiddleware,             // 1️⃣ verify token
  upload.single("logo"),      // 2️⃣ handle file upload
  storeValidationRules(),     // 3️⃣ validate fields
  validateStore,              // 4️⃣ send validation errors if any
  createStore                 // 5️⃣ run controller logic
);

export default router;
