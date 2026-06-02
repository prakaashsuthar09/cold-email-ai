import axios from "axios";

const API = "http://localhost:5000/api/auth";

// SIGNUP
export const signupUser = (data) =>
  axios.post(`${API}/signup`, data);

// VERIFY SIGNUP OTP
export const verifyOTP = (data) =>
  axios.post(`${API}/verify-otp`, data);

// LOGIN
export const loginUser = (data) =>
  axios.post(`${API}/login`, data);

// FORGOT PASSWORD
export const forgotPassword = (data) =>
  axios.post(`${API}/forgot-password`, data);

// VERIFY FORGOT OTP
export const verifyForgotOTP = (data) =>
  axios.post(`${API}/verify-forgot-otp`, data);

// RESET PASSWORD
export const resetPassword = (data) =>
  axios.post(`${API}/reset-password`, data);