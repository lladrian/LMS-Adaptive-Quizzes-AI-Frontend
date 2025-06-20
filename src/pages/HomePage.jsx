import React, { useState } from "react";
import {
  FaLaptopCode,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
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

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("login");
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
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });
  const [registrationStep, setRegistrationStep] = useState(1); // 1: role select, 2: complete registration

  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

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

    setLoading(true);
    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        if (result.data.data.status === "unverified") {
          setVerificationData({
            user_id: result.data.data._id,
            user_type: result.data.data.role,
            email: result.data.data.email,
            isPasswordReset: false,
          });
          setShowOtpModal(true);
          await sendOTP(result.data.data.email);
          toast.info("OTP sent to your email for verification");
        } else {
          completeLogin(result.data.data);
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmailOTP(otp, verificationData.email);

      if (result.success) {
        toast.success("Email verified successfully!");

        if (verificationData.isPasswordReset) {
          const resetResult = await recoveryOTP(
            otp,
            verificationData.email,
            newPassword
          );
          if (resetResult.success) {
            toast.success("Password reset successfully!");
            setShowOtpModal(false);
            setActiveTab("login");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
          } else {
            toast.error(resetResult.error || "Failed to reset password");
          }
        } else {
          const loginResult = await loginUser({
            email: verificationData.email,
            password: formData.password,
          });

          if (loginResult.success) {
            completeLogin(loginResult.data.data);
            setShowOtpModal(false);
          }
        }
      } else {
        toast.error(result.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (userData) => {
    toast.success(`Welcome, ${userData.first_name} ${userData.last_name}!`);

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
    } else {
      navigate("/instructor/dashboard");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registrationStep === 1) {
      setRegistrationStep(2);
      return;
    }

    // Validation checks remain the same...

    setLoading(true);
    try {
      let result;
      if (formData.role === "student") {
        result = await registerStudent(
          formData.first_name,
          formData.middle_name,
          formData.last_name,
          formData.email,
          formData.password,
          formData.student_id_number
        );
      } else {
        result = await registerInstructor(
          formData.first_name,
          formData.middle_name,
          formData.last_name,
          formData.email,
          formData.password
        );
      }

      if (result && result.data) {
        // Check if result and result.data exist
        toast.success(`Account created for ${formData.first_name}!`);

        // Use the correct response structure here
        const userData = result.data.user || result.data; // Adjust based on your actual API response

        setVerificationData({
          user_id: userData._id,
          user_type: userData.role,
          email: formData.email,
          password: formData.password,
          isPasswordReset: false,
        });

        setShowOtpModal(true);

        try {
          await sendOTP(formData.email);
          toast.info("OTP sent to your email for verification");
        } catch (error) {
          toast.error("Failed to send OTP. Please try again.");
        }
      } else {
        toast.error(result?.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await sendOTP(formData.email);
      setVerificationData({
        email: formData.email,
        isPasswordReset: true,
      });
      setShowOtpModal(true);
      setShowForgotPassword(false);
      toast.info("OTP sent to your email for password reset");
    } catch (error) {
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaLaptopCode className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setRegistrationStep(1);
                }}
                className={`cursor-pointer px-3 py-2 text-sm font-medium ${
                  activeTab === "login"
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setRegistrationStep(1);
                }}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "register"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Branding */}
              <div className="md:w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center">
                <div className="flex items-center justify-center mb-6">
                  <FaLaptopCode className="h-12 w-12" />
                  <h1 className="ml-3 text-3xl font-bold"></h1>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  {activeTab === "login"
                    ? "Welcome Back!"
                    : "Join Our Platform"}
                </h2>
                <p className="text-indigo-100 text-center">
                  {activeTab === "login"
                    ? "Sign in to access your personalized dashboard"
                    : "Start your learning or teaching journey today"}
                </p>
              </div>

              {/* Right Side - Auth Forms */}
              <div className="md:w-1/2 p-8">
                {activeTab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Sign In
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                        onClick={() => setShowForgotPassword(true)}
                        className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium flex justify-center items-center"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("register");
                          setRegistrationStep(1);
                        }}
                        className="cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {registrationStep === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Join as
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => selectRole("student")}
                            className={`cursor-pointer flex flex-col items-center p-6 border rounded-lg transition ${
                              formData.role === "student"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                          >
                            <FaUserGraduate className="h-10 w-10 text-indigo-600 mb-3" />
                            <h4 className="text-lg font-medium text-gray-900">
                              Student
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                              Join to learn and complete coding activities
                            </p>
                          </button>
                          <button
                            onClick={() => selectRole("instructor")}
                            className={`cursor-pointer flex flex-col items-center p-6 border rounded-lg transition ${
                              formData.role === "instructor"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                          >
                            <FaChalkboardTeacher className="h-10 w-10 text-indigo-600 mb-3" />
                            <h4 className="text-lg font-medium text-gray-900">
                              Instructor
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                              Create courses and manage students
                            </p>
                          </button>
                        </div>
                        <button
                          onClick={() => setRegistrationStep(2)}
                          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
                        >
                          Continue
                        </button>
                        <div className="text-center text-sm text-gray-600">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setActiveTab("login")}
                            className="cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium"
                          >
                            Sign in here
                          </button>
                        </div>
                      </div>
                    )}

                    {registrationStep === 2 && (
                      <form onSubmit={handleRegister} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {formData.role === "student"
                            ? "Student Registration"
                            : "Instructor Registration"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Middle Name
                            </label>
                            <input
                              type="text"
                              name="middle_name"
                              value={formData.middle_name}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="you@example.com"
                            required
                          />
                        </div>

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
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                        )}

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
                              setPasswordStrength(
                                checkPasswordStrength(e.target.value)
                              );
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
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
                                      width: `${
                                        (passwordStrength.score / 5) * 100
                                      }%`,
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
                              <p className="mt-1 text-xs text-gray-500">
                                Use at least 8 characters with uppercase,
                                numbers, and symbols
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                          />
                          {confirmPassword &&
                            formData.password !== confirmPassword && (
                              <p className="mt-1 text-xs text-red-600">
                                Passwords do not match
                              </p>
                            )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium flex justify-center items-center"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Registering...
                            </>
                          ) : (
                            "Register"
                          )}
                        </button>
                        <div className="text-center text-sm text-gray-600">
                          <button
                            type="button"
                            onClick={() => setRegistrationStep(1)}
                            className="cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium"
                          >
                            Back to role selection
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

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
                className="cursor-pointer text-gray-400 hover:text-gray-500"
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
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-gray-600">
                  {verificationData?.isPasswordReset ? (
                    "Enter the verification code we sent to your email and your new password."
                  ) : (
                    <>
                      We've sent a 6-digit verification code to{" "}
                      <span className="font-semibold">
                        {verificationData?.email || formData.email}
                      </span>
                      . Please enter it below to verify your account.
                    </>
                  )}
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                {verificationData?.isPasswordReset && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      {confirmPassword && newPassword !== confirmPassword && (
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
                    disabled={loading}
                    className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {verificationData?.isPasswordReset
                          ? "Resetting..."
                          : "Verifying..."}
                      </>
                    ) : verificationData?.isPasswordReset ? (
                      "Reset Password"
                    ) : (
                      "Verify Account"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                className="cursor-pointer text-gray-400 hover:text-gray-500"
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
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you a verification
                  code to reset your password.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex justify-center items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
