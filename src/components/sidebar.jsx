// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from "react-icons/ai";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: AiOutlineHome },
  {
    name: "Manage Instructors",
    path: "/admin/instructors",
    icon: AiOutlineTeam,
  },
  { name: "Settings", path: "/admin/settings", icon: AiOutlineSetting },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    // Put your logout logic here, e.g., clearing auth tokens
    alert("Logged out!");
    navigate("/login"); // redirect to login page or homepage
  }

  return (
    <div
      className={`h-screen bg-white text-gray-800 flex flex-col transition-all duration-300 shadow-lg ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand */}
      <div
        className={`flex items-center justify-between px-4 py-5 border-b border-gray-200 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-wide select-none text-indigo-600">
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          {collapsed ? (
            <AiOutlineDoubleRight size={20} className="text-gray-500" />
          ) : (
            <AiOutlineDoubleLeft size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-grow mt-4 px-2">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-1 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`
            }
            onMouseEnter={() => setActiveHover(name)}
            onMouseLeave={() => setActiveHover(null)}
            end
          >
            <div className="relative">
              <Icon
                size={22}
                className={
                  activeHover === name || collapsed
                    ? "text-indigo-500"
                    : "text-gray-500"
                }
              />
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {name}
                </div>
              )}
            </div>
            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pb-4 px-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 mx-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-gray-600 ${
            collapsed ? "justify-center" : ""
          }`}
          onMouseEnter={() => setActiveHover("logout")}
          onMouseLeave={() => setActiveHover(null)}
        >
          <AiOutlineLogout
            size={22}
            className={
              activeHover === "logout" || collapsed
                ? "text-indigo-500"
                : "text-gray-500"
            }
          />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-400 select-none">
            &copy; {new Date().getFullYear()} YourCompany
          </div>
        )}
      </div>
    </div>
  );
}
