const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  registerUser,
  loginUser,
  refreshToken
} = require("../controllers/authController");

// Routes for authentication
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser); // Login a user
router.post("/refresh", refreshToken); 

module.exports = router;
