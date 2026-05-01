const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const { body } = require("express-validator");

// ===================== REGISTER =====================
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  register
);

// ===================== LOGIN =====================
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
  ],
  login
);

module.exports = router;