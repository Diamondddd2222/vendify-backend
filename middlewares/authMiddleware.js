// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    console.log("Auth header received:", header);
    if (!header || !header.startsWith("Bearer ")){
        console.log("No token or wrong format");
        return res.status(401).json({ message: "Login or Create an accont to continue with Vendify" });
    } 

    const token = header.split(" ")[1];
    console.log("Extracted token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    // attach user info (you can fetch full user if needed)
    req.user = { id: decoded.id };
    // optionally: const user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
