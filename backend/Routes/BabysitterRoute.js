const express = require("express");
const {
  getBabysitters,
  getBabysitterById,
  updateAvailability,
  getBabysitterReviews,
} = require("../Controllers/BabysitterController");
const { signIn, signUp, logout } = require("../Controllers/auth");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Change these routes to match your frontend
router.post("/auth/login", signIn);  // Changed from /signin
router.post("/auth/signup", signUp); // Changed from /signup
router.post("/auth/logout", authMiddleware, logout);

router.get("/", getBabysitters);
router.get("/:id", getBabysitterById);
router.get("/:id/reviews", getBabysitterReviews);

router.put("/availability", authMiddleware, updateAvailability);

module.exports = router;
