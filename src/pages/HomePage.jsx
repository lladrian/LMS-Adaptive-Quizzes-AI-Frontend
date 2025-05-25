import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import { loginStudent, registerStudent } from "../utils/authService";

import { toast } from "react-toastify";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaLaptopCode className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  EduCode
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowRegister(true);
                  setActiveTab("register");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Learn to Code with{" "}
            <span className="text-indigo-600">AI-Powered</span> Education
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
            A modern classroom platform where instructors and students
            collaborate with integrated programming environment and AI-assisted
            grading.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowRegister(true);
                setActiveTab("register");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium"
            >
              Join Now
            </button>
            <button className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md text-lg font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Powerful Features for Modern Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaChalkboardTeacher className="h-8 w-8 text-indigo-600" />}
              title="Instructor Tools"
              description="Manage classes, students, and assignments with our comprehensive dashboard."
            />
            <FeatureCard
              icon={<FaUserGraduate className="h-8 w-8 text-indigo-600" />}
              title="Student Portal"
              description="Access course materials, submit assignments, and track your progress."
            />
            <FeatureCard
              icon={<FaLaptopCode className="h-8 w-8 text-indigo-600" />}
              title="Built-in IDE"
              description="Practice coding right in your browser with our integrated development environment."
            />
            <FeatureCard
              icon={<FaRobot className="h-8 w-8 text-indigo-600" />}
              title="AI Assistance"
              description="Get instant feedback on your code with our AI-powered grading system."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EduCode</h3>
              <p className="text-gray-300">
                Modern education platform for programming courses with
                AI-powered tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2023 EduCode. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <AuthModal
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => {
            setShowLogin(false);
            setShowRegister(false);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <AuthModal
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => {
            setShowLogin(false);
            setShowRegister(false);
          }}
        />
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AuthModal = ({ activeTab, setActiveTab, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
  });

  // Reset form when tab changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "student",
    });
  }, [activeTab]);

  const handleLogin = async (e) => {
    console.log("hello");
    e.preventDefault(); // Prevent default form submission
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await loginStudent({
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        toast.success(`Welcome, ${result.data.fullname}!`);
        onClose(); // Close modal after login
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await registerStudent(formData);
      if (result.success) {
        toast.success(`Account created for ${formData.name}!`);
        setActiveTab("login"); // Switch to login tab after registration
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during registration");
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
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
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
                        className={`w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
                        className={`w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create account
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
