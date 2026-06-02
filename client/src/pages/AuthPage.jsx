import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  signupUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
} from "../services/authService";

export default function AuthPage() {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [isLogin, setIsLogin] = useState(true);

  const [showOTP, setShowOTP] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);

  const [resetMode, setResetMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    let interval;

    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showOTP, timer]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SIGNUP
  // =========================

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signupUser(formData);

      localStorage.setItem("email", formData.email);

      setShowOTP(true);

      setTimer(60);

      toast.success("OTP Sent Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY SIGNUP OTP
  // =========================

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await verifyOTP({
        email: localStorage.getItem("email"),
        otp,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Account Created Successfully");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async () => {
    if (!formData.email) {
      return toast.error("Enter your email first");
    }

    try {
      setLoading(true);

      await forgotPassword({
        email: formData.email,
      });

      localStorage.setItem("resetEmail", formData.email);

      setForgotMode(true);

      setShowOTP(true);

      setTimer(60);

      toast.success("Reset OTP Sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY FORGOT OTP
  // =========================

  const handleVerifyForgotOTP = async () => {
    try {
      setLoading(true);

      await verifyForgotOTP({
        email: localStorage.getItem("resetEmail"),
        otp,
      });

      setResetMode(true);

      setShowOTP(false);

      toast.success("OTP Verified");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async () => {
    if (newPassword.length !== 6) {
      return toast.error("PIN must be 6 digits");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("PIN does not match");
    }

    try {
      setLoading(true);

      await resetPassword({
        email: localStorage.getItem("resetEmail"),
        password: newPassword,
      });

      toast.success("Password Updated Successfully");

      setResetMode(false);

      setForgotMode(false);

      setShowOTP(false);

      setIsLogin(true);

      setOtp("");

      setNewPassword("");

      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOTP = async () => {
    try {
      if (forgotMode) {
        await forgotPassword({
          email: localStorage.getItem("resetEmail"),
        });
      } else {
        await signupUser(formData);
      }

      setTimer(60);

      toast.success("OTP Resent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      {/* OUTER CARD */}
      <div className="w-full max-w-sm rounded-[40px] p-[2px] bg-gradient-to-t from-blue-300 via-orange-300 to-purple-300 shadow-2xl">
        {/* INNER CARD */}
        <div className="bg-white rounded-[38px] text-black px-8 py-10 min-h-[620px] flex flex-col justify-center">
          {/* ========================= */}
          {/* RESET PASSWORD UI */}
          {/* ========================= */}

          {resetMode ? (
            <>
              <h1 className="text-3xl font-bold text-black">Reset Your PIN</h1>

              <p className="text-gray-500 text-sm mt-2 mb-8">
                Create a new 6-digit PIN for your account.
              </p>

              <div className="space-y-4">
                {/* NEW PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    New password
                  </label>

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter new password"
                    className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Confirm password
                  </label>

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Confirm password"
                    className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full h-10 mt-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </div>
            </>
          ) : showOTP ? (
            /* ========================= */
            /* OTP UI */
            /* ========================= */

            <>
              <h1 className="text-3xl font-bold text-black">
                {forgotMode ? "Verify Your Identity" : "Verify Your Email"}
              </h1>

              <p className="text-gray-500 text-sm mt-2 mb-8">
                {forgotMode
                  ? "Enter the OTP sent to your email to reset your password."
                  : "Enter the verification code sent to your email."}
              </p>

              {/* OTP BOX */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="------"
                    className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none text-center tracking-[8px] text-lg font-semibold focus:border-indigo-500"
                  />
                </div>

                {/* RESEND */}
                <div className="flex justify-end">
                  <button
                    disabled={timer > 0}
                    onClick={handleResendOTP}
                    className="text-sm text-indigo-600 font-medium hover:underline disabled:text-gray-400"
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                </div>

                {/* BUTTON */}
                <button
                  onClick={forgotMode ? handleVerifyForgotOTP : handleVerifyOTP}
                  disabled={loading}
                  className="w-full h-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                {/* BACK */}
                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setForgotMode(false);
                  }}
                  className="w-full text-sm text-gray-500 hover:text-black mt-3"
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            /* ========================= */
            /* LOGIN / SIGNUP */
            /* ========================= */

            <>
              <h1 className="text-3xl font-bold text-black">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-gray-500 text-sm mt-2 mb-8">
                {isLogin
                  ? "Login to continue using your AI workspace."
                  : "Create your account to continue."}
              </p>

              <form
                onSubmit={isLogin ? handleLogin : handleSignup}
                className="space-y-4"
              >
                {/* NAME */}
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      onChange={handleChange}
                      className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Password / PIN
                  </label>

                  <input
                    type="password"
                    name="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter password"
                    onChange={handleChange}
                    className="w-full h-10 px-4 rounded-2xl border border-gray-300 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* FORGOT */}
                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* BUTTON */}
                <button
                  disabled={loading}
                  className="w-full h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>{isLogin ? "Login" : "Create Account"}</>
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-6 mt-2 mb-2">
                <div className="flex-1 h-[1px] bg-gray-200"></div>

                <span className="text-sm text-gray-400">or continue with</span>

                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>

              {/* GOOGLE */}
              <button
                onClick={() =>
                  window.open("http://localhost:5000/api/auth/google", "_self")
                }
                className="w-full h-10 rounded-2xl border border-gray-300 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-100 transition-all"
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>

              {/* TOGGLE */}
              <p className="text-center text-sm text-gray-500 mt-8">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 font-semibold hover:underline"
                >
                  {isLogin ? "Signup" : "Login"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
