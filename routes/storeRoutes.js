// backend/routes/storeRoutes.js
import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import { createStore } from "../controllers/storeController.js";

const router = express.Router();


router.post("/create", authMiddleware, createStore);

export default router;
