import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiCode,
  FiAward,
  FiLogOut,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const StudentLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const studentFullname = localStorage.getItem("fullname");
  const navItems = [
    { path: "/student/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/student/classes", icon: FiBook, label: "My Classes" },
    { path: "/student/settings", icon: FiSettings, label: "Settings" },
    // { path: "/student/grades", icon: FiAward, label: "Grades" },
  ];

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("role");
    localStorage.removeItem("fullname");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("status");
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`relative bg-white shadow-md transition-all duration-300 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header and Navigation */}
        <div>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-indigo-600">
                Student Portal
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

        {/* Logout Button at Bottom */}
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

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {(() => {
                const segments = location.pathname.split("/").filter(Boolean);
                const last = segments[segments.length - 1];
                const secondLast = segments[segments.length - 2];

                const isLikelyId =
                  /^[0-9a-fA-F]{8,}$/.test(last) || !isNaN(last);

                const label = isLikelyId ? secondLast : last;

                return label
                  ?.replace(/-/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase());
              })()}
            </h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Link
                  to="settings"
                  className="flex items-center hover:bg-gray-100 p-1 rounded transition"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {studentFullname?.charAt(0).toUpperCase()}
                  </div>
                  {sidebarOpen && (
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {studentFullname}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
