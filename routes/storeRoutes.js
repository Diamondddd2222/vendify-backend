// backend/routes/storeRoutes.js
import multer from "multer"; // add this
import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { storeValidationRules, validateStore } from "../middlewares/storeValidator.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// import {  } from "../controllers/storeController.js";
import { getUserStore, createStore, getAllStores} from "../controllers/storeController.js";

const router = express.Router();


// router.post(
//   "/create",
//   authMiddleware,             
//   upload.single("logo"),    
//   storeValidationRules(),     
//   validateStore,              
//   createStore                 
// );

router.post(
  "/create",
  authMiddleware,             
   (req, res, next) => {
    // Wrap multer to handle errors directly
    upload.single("logo")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large. Max size is 10MB." });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next(); // proceed to validation & controller
    });
  },    
  storeValidationRules(),     
  validateStore,              
  createStore                 
);

router.get("/reqstores", getAllStores); 


router.get("/", authMiddleware, (req, res, next) => {
  console.log("Hit /my-store route", req.user);
  next();
},
  getUserStore);

export default router;
