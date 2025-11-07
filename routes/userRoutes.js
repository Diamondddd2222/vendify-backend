import express from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userControllers.js";
import { validateRegister, validateLogin } from "../middlewares/validationMiddleware.js";

const router = express.Router();
// ✅ Get all users (public route for now)
router.get("/", getAllUsers);
router.post("/register", validateRegister,  registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
