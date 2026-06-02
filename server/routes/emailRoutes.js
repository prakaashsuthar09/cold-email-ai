const express = require("express");

const router = express.Router();

const {
  generateAIEmail,
  getEmailHistory,
} = require(
  "../controllers/emailController"
);

const protect = require(
  "../middleware/authMiddleware"
);

// GENERATE EMAIL
router.post(
  "/generate",
  protect,
  generateAIEmail
);

// HISTORY
router.get(
  "/history",
  protect,
  getEmailHistory
);


module.exports = router;