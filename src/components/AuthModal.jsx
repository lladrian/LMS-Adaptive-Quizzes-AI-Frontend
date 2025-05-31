import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  loginUser,
  registerInstructor,
  registerStudent,
} from "../utils/authService";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ activeTab, setActiveTab, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
  });
  const navigate = useNavigate();
  // Reset form when tab changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "student",
    });
  }, [activeTab]);

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingLogin(true); // Start loading

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        toast.success(`Welcome, ${result.data.data.fullname}!`);
        onClose(); // Close modal after login

        localStorage.setItem("userId", result.data.data._id);
        localStorage.setItem("role", result.data.data.role);
        localStorage.setItem("fullname", result.data.data.fullname);
        
        
        if (result.data.data.role === "student") {
          navigate("/student/dashboard");
        } else if (result.data.data.role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoadingLogin(false); // End loading
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingRegister(true); // Start loading

    try {
      if (formData.role === "student") {
        const result = await registerStudent(
          formData.name,
          formData.email,
          formData.password
        );
        if (result.success) {
          toast.success(`Account created for ${formData.name}!`);
          setActiveTab("login");
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await registerInstructor(
          formData.name,
          formData.email,
          formData.password
        );
        if (result.success) {
          toast.success(`Account created for ${formData.name}!`);
          setActiveTab("login");
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoadingRegister(false); // Stop loading in both success/failure
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
            <form onSubmit={handleRegister}>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Create a new account
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="register-email"
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
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I am a
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, role: "student" })
                        }
                        className={`cursor-pointer w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          formData.role === "student"
                            ? "bg-indigo-600 text-white border-transparent"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        Student
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, role: "instructor" })
                        }
                        className={`cursor-pointer w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          formData.role === "instructor"
                            ? "bg-indigo-600 text-white border-transparent"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        Instructor
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loadingRegister}
                    className={`cursor-pointer w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loadingRegister
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loadingRegister ? (
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
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
