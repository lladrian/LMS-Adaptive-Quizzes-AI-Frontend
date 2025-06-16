import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  loginUser,
  registerInstructor,
  registerStudent,
  sendOTP,
  verifyEmailOTP,
  recoveryOTP,
} from "../utils/authService";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ activeTab, setActiveTab, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    student_id_number: 0,
    first_name: "",
    middle_name: "",
    last_name: "",
    role: "student",
  });
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Reset form when tab changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      student_id_number: 0,
      role: "student",
    });
  }, [activeTab]);

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";

    // Check length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Check complexity
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determine message
    if (score >= 5) message = "Strong password";
    else if (score >= 3) message = "Medium password";
    else if (password.length > 0) message = "Weak password";

    return { score, message };
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingLogin(true);

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        // Check user status
        if (result.data.data.status === "unverified") {
          // Show OTP verification modal
          setVerificationData({
            user_id: result.data.data._id,
            user_type: result.data.data.role,
            email: result.data.data.email,
            isPasswordReset: false,
          });
          setShowOtpModal(true);
          // Send OTP automatically
          await sendOTP(result.data.data.email);
          toast.info("OTP sent to your email for verification");
        } else {
          // User is verified, proceed with login
          completeLogin(result.data.data);
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoadingOtp(true);

    try {
      const result = await verifyEmailOTP(otp, verificationData.email);

      if (result.success) {
        toast.success("Email verified successfully!");
        // Get user data again or use the existing data to complete login
        const loginResult = await loginUser({
          email: verificationData.email,
          password: formData.password,
        });

        if (loginResult.success) {
          completeLogin(loginResult.data.data);
          setShowOtpModal(false);
        } else {
          toast.error("Failed to complete login after verification");
        }
      } else {
        toast.error(result.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    setVerificationData({
      email: formData.email,
      isPasswordReset: true,
    });

    setLoadingForgotPassword(true);

    try {
      await sendOTP(formData.email);

      setShowOtpModal(true);
      setShowForgotPassword(false);
      toast.info("OTP sent to your email for password reset");
    } catch (error) {
      toast.error("An error occurred while processing your request");
    } finally {
      setLoadingForgotPassword(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoadingOtp(true);

    try {
      const result = await recoveryOTP(
        otp,
        verificationData.email,
        newPassword
      );
      console.log(result);

      if (result.success) {
        toast.success("Password reset successfully!");
        setShowOtpModal(false);
        setActiveTab("login");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred during password reset");
    } finally {
      setLoadingOtp(false);
    }
  };

  const completeLogin = (userData) => {
    toast.success(`Welcome, ${userData.first_name} ${userData.last_name}!`);
    onClose();

    localStorage.setItem("userId", userData._id);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("fullname", userData.fullname);
    localStorage.setItem("first_name", userData.first_name);
    localStorage.setItem("middle_name", userData.middle_name);
    localStorage.setItem("last_name", userData.last_name);
    localStorage.setItem("student_id_number", userData.student_id_number || 0);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("status", userData.status);

    if (userData.role === "student") {
      navigate("/student/dashboard");
    } else if (userData.role === "instructor") {
      navigate("/instructor/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !formData.first_name ||
      !formData.middle_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password");
      return;
    }

    if (formData.role === "student" && !formData.student_id_number) {
      toast.error("Please enter your student ID number");
      return;
    }

    setLoadingRegister(true);
    try {
      if (formData.role === "student") {
        const result = await registerStudent(
          formData.first_name,
          formData.middle_name,
          formData.last_name,
          formData.email,
          formData.password,
          formData.student_id_number
        );
        if (result.success) {
          toast.success(`Account created for ${formData.first_name}!`);
          setActiveTab("login");
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await registerInstructor(
          formData.first_name,
          formData.middle_name,
          formData.last_name,
          formData.email,
          formData.password
        );
        if (result.success) {
          toast.success(`Account created for ${formData.first_name}!`);
          setActiveTab("login");
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoadingRegister(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[80vh]">
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-2 px-1 ${
                activeTab === "login"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`pb-2 px-1 ${
                activeTab === "register"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin}>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Sign in to your account
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setActiveTab("login");
                    }}
                    className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loadingLogin}
                    className={`cursor-pointer w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loadingLogin
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loadingLogin ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="max-h-[80vh] overflow-y-auto w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <form onSubmit={handleRegister}>
                <h3 className="text-xl font-semibold text-indigo-700 mb-6">
                  Create a New Account
                </h3>

                <div className="space-y-5">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                      placeholder="Middle Name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Student ID (conditional) */}
                  {formData.role === "student" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID Number
                      </label>
                      <input
                        type="number"
                        name="student_id_number"
                        value={formData.student_id_number}
                        onChange={handleChange}
                        placeholder="Enter your student ID"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        setPasswordStrength(checkPasswordStrength(e.target.value));
                      }}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                passwordStrength.score >= 5
                                  ? "bg-green-500"
                                  : passwordStrength.score >= 3
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${(passwordStrength.score / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength.score >= 5
                                ? "text-green-600"
                                : passwordStrength.score >= 3
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {passwordStrength.message}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Use at least 8 characters with uppercase, numbers, and symbols.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {confirmPassword && formData.password !== confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      {["student", "instructor"].map((roleOption) => (
                        <button
                          key={roleOption}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, role: roleOption })
                          }
                          className={`py-2 px-4 rounded-md text-sm font-medium border focus:outline-none transition ${
                            formData.role === roleOption
                              ? "bg-indigo-600 text-white border-transparent"
                              : "bg-white border-gray-300 text-gray-700"
                          }`}
                        >
                          {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={loadingRegister}
                      className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-sm font-semibold text-white shadow ${
                        loadingRegister
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {loadingRegister ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Registering account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleForgotPassword}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter your email address and we'll send you a verification
                    code to reset your password.
                  </p>
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="forgot-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loadingForgotPassword}
                      className={`cursor-pointer w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loadingForgotPassword
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {loadingForgotPassword
                        ? "Sending..."
                        : "Send Verification Code"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {verificationData?.isPasswordReset
                  ? "Reset Password"
                  : "Verify Your Email"}
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form
                onSubmit={
                  verificationData?.isPasswordReset
                    ? handlePasswordReset
                    : handleVerifyOtp
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {verificationData?.isPasswordReset ? (
                      "Enter the verification code we sent to your email and your new password."
                    ) : (
                      <>
                        We've sent a 6-digit verification code to{" "}
                        <span className="font-semibold">
                          {verificationData?.email || formData.email}
                        </span>
                        . Please enter it below.
                      </>
                    )}
                  </p>

                  <div>
                    <label
                      htmlFor="otp-code"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="otp-code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>

                  {verificationData?.isPasswordReset && (
                    <>
                      <div>
                        <label
                          htmlFor="new-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="••••••••"
                          required
                          minLength={8}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="••••••••"
                          required
                          minLength={8}
                        />
                        {confirmPassword &&
                          formData.password !== confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">
                              Passwords do not match
                            </p>
                          )}
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await sendOTP(verificationData.email);
                          toast.info("New OTP sent to your email");
                        } catch (error) {
                          toast.error("Failed to resend OTP");
                        }
                      }}
                      className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Resend OTP
                    </button>
                    <button
                      type="submit"
                      disabled={loadingOtp}
                      className={`cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loadingOtp
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {loadingOtp
                        ? verificationData?.isPasswordReset
                          ? "Resetting..."
                          : "Verifying..."
                        : verificationData?.isPasswordReset
                        ? "Reset Password"
                        : "Verify"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
