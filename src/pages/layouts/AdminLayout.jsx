// components/layout/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiSettings,
  FiLogOut,
  FiLock,
  FiBell,
} from "react-icons/fi";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const { user, logout } = useAuth();

  const navItems = [
    { path: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/admin/instructors", icon: FiUsers, label: "Instructors" },
    { path: "/admin/classrooms", icon: FiBook, label: "Classrooms" },
    { path: "/admin/admins", icon: FiLock, label: "Admins" },
    { path: "/admin/settings", icon: FiSettings, label: "Settings" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md transition-all duration-300 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Top Header with Toggle */}
        <div>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-indigo-600">
                Admin Portal
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {sidebarOpen ? (
                <HiOutlineChevronLeft className="w-6 h-6" />
              ) : (
                <HiOutlineChevronRight className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
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
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center text-gray-600 hover:text-red-500 w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <FiLogOut />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {location.pathname
                .split("/")
                .pop()
                .replace(/-/g, " ")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <FiBell className="text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                  G
                </div>
                {sidebarOpen && (
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Gerald
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
