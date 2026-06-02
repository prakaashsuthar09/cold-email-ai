const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");
const sendOtp = require("../utils/sendOtp");
const generateToken = require("../utils/generateToken");


// SIGNUP
const signupUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!/^\d{6}$/.test(password)) {

      return res.status(400).json({
        message: "Password must be 6 digit numeric",
      });
    }

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = generateOTP();

    await User.create({

      name,

      email,

      password: hashedPassword,

      otp,

      otpExpires:
        Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(
      email,
      "OTP Verification",
      `Your OTP is ${otp}`
    );

    res.status(201).json({
      message: "OTP sent successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// VERIFY OTP
const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {

      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.isVerified = true;

    user.otp = "";

    await user.save();

    res.json({

      token: generateToken(user._id),

      user: {

        id: user._id,

        name: user.name,

        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({

      token: generateToken(user._id),

      user: {

        id: user._id,

        name: user.name,

        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "Reset Password OTP",
      `Your OTP is ${otp}`
    );

    res.json({
      message: "OTP sent",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// VERIFY FORGOT OTP
const verifyForgotOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {

      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    res.json({
      message: "OTP verified",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!/^\d{6}$/.test(password)) {

      return res.status(400).json({
        message: "Password must be 6 digit numeric",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.otp = "";

    await user.save();

    res.json({
      message:
        "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {

  signupUser,

  verifyOTP,

  loginUser,

  forgotPassword,

  verifyForgotOTP,

  resetPassword,
};