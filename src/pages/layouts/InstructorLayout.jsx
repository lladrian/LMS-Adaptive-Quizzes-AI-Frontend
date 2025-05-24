import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const InstructorLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/instructor/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/instructor/classes", icon: FiBook, label: "Classes" },
    { path: "/instructor/materials", icon: FiFileText, label: "Materials" },
    { path: "/instructor/grades", icon: FiBarChart2, label: "Grades" },
    { path: "/instructor/settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-indigo-600">
              Instructor Portal
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
                location.pathname.startsWith(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="text-lg" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="flex items-center text-gray-600 hover:text-red-500 w-full p-2 rounded-lg hover:bg-gray-100">
            <FiLogOut />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorLayout;
