const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const {
  signupUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();


// SIGNUP
router.post("/signup", signupUser);

// VERIFY SIGNUP OTP
router.post("/verify-otp", verifyOTP);

// LOGIN
router.post("/login", loginUser);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// VERIFY FORGOT OTP
router.post("/verify-forgot-otp", verifyForgotOTP);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),

  (req, res) => {

    const token = generateToken(
      req.user._id
    );

    res.redirect(
      `http://localhost:5173/dashboard?token=${token}`
    );
  }
);

router.get(
  "/me",

  (req, res) => {

    if (!req.user) {

      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.json(req.user);
  }
);

module.exports = router;