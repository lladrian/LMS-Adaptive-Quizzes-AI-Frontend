import { useState } from "react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import AuthModal from "../components/AuthModal";

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

export default LandingPage;
