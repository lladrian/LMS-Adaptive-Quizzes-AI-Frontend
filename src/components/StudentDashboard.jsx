import {
  FaBook,
  FaClipboardList,
  FaGraduationCap,
  FaCode,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 bg-green-600 text-white">
          <h1 className="text-xl font-bold">EduCode Student</h1>
        </div>
        <nav className="mt-6">
          <NavItem icon={<FaBook />} text="Materials" active />
          <NavItem icon={<FaClipboardList />} text="Assignments" />
          <NavItem icon={<FaGraduationCap />} text="Grades" />
          <NavItem icon={<FaCode />} text="Code IDE" />
          <NavItem icon={<FiLogOut />} text="Logout" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Programming Quiz: JavaScript Basics
          </h2>
          <p className="text-gray-600">Due: May 30, 2023 • 20 points</p>
        </div>

        {/* IDE Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Code Editor */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-gray-300 px-4 py-2 flex justify-between items-center">
              <span>script.js</span>
              <div className="flex space-x-2">
                <button className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  Run
                </button>
                <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  Submit
                </button>
              </div>
            </div>
            <div className="p-4 font-mono text-sm text-gray-200">
              <pre>{`// Write a function that returns the sum of two numbers

function sum(a, b) {
  // Your code here
}

// Test cases
console.log(sum(1, 2));  // Should return 3
console.log(sum(5, 7));  // Should return 12`}</pre>
            </div>
          </div>

          {/* Output/Results */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-medium">Output & Test Results</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Test Cases</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">
                      Test 1: Failed (Expected 3, got undefined)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">
                      Test 2: Failed (Expected 12, got undefined)
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">AI Feedback</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                  It looks like your function isn't returning anything yet.
                  Remember to use the 'return' keyword to send back the result
                  of your calculation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Info */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h3 className="font-medium">Assignment Instructions</h3>
          </div>
          <div className="p-4">
            <p className="mb-4">
              Complete the function{" "}
              <code className="bg-gray-100 px-1 rounded">sum(a, b)</code> so
              that it returns the sum of the two parameters.
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Do not modify the test cases</li>
              <li>Your function must return the value, not just print it</li>
              <li>You have unlimited attempts</li>
            </ul>
            <div className="flex justify-end">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active = false }) => (
  <a
    href="#"
    className={`flex items-center px-6 py-3 ${
      active
        ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </a>
);

export default StudentDashboard;
