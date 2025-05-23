import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SidebarLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">EduCode Admin</h1>
        </div>
        <nav className="mt-6">
          <NavItem
            icon={<FaChalkboardTeacher />}
            text="Instructors"
            to="/admin"
          />
          <NavItem icon={<FaUserGraduate />} text="Students" to="#" />
          <NavItem icon={<FaBook />} text="Courses" to="#" />
          <NavItem icon={<FaClipboardList />} text="Assignments" to="#" />
          <NavItem icon={<FaCog />} text="Settings" to="#" />
          <NavItem icon={<FiLogOut />} text="Logout" to="#" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-6 py-3 ${
        isActive
          ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

export default SidebarLayout;
