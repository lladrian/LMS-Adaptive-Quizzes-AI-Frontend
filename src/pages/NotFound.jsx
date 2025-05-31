import React from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiHome,
  FiCompass,
  FiArrowLeft,
} from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        {/* Animated Warning Icon */}
        <div className="mx-auto mb-6 flex items-center justify-center h-16 w-16 rounded-full bg-red-50 animate-pulse">
          <FiAlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        {/* Error Text */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Primary Action Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full mb-6 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Return Home
        </Link>

        {/* Secondary Options */}
    {/*     <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Try one of these instead:
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiHome className="text-indigo-600 mb-1 text-xl" />
              <span className="text-sm text-gray-600">Home</span>
            </Link>
            <Link
              to="/explore"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiCompass className="text-indigo-600 mb-1 text-xl" />
              <span className="text-sm text-gray-600">Explore</span>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotFound;
