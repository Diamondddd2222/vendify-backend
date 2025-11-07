import express from "express";
import { registerUser, loginUser } from "../controllers/userControllers.js";
import { validateRegister, validateLogin } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateRegister,  registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
