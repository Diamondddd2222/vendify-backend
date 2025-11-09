import { body, validationResult } from "express-validator";
import fs from "fs";

// Validation rules for creating a store
export const storeValidationRules = () => [
  body("name").notEmpty().withMessage("Store name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid"),
  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?\d{7,15}$/).withMessage("Phone number is invalid"),
];

// Middleware to check validation results
export const validateStore = (req, res, next) => {
  const errors = validationResult(req);

  // Check for uploaded logo
  if (!req.file) {
    errors.errors.push({ param: "logo", msg: "Store logo is required" });
  }

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]; // get the first error only

    // Format it like your frontend expects
    const extractedError = {
      [firstError.param]: firstError.msg,
    };

    // Delete uploaded file if validation fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        // ignore unlink errors
      }
    }

    return res.status(400).json({ errors: extractedError });
  }

  next();
};
