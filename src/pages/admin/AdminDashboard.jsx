// pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiBook,
  FiUserPlus,
  FiTrendingUp,
  FiXCircle,
  FiCheckCircle,
  FiBookOpen,
  FiShield,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getAllInstructors,
  getAllAdmins,
  allClassrooms,
  getAllMaterials,
} from "../../utils/authService";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";

const AdminDashboard = () => {
  const [instructors, setInstructors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [hiddenClassrooms, setHiddenClassrooms] = useState([]);
  const [unhiddenClassrooms, setUnhiddenClassrooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

   const fName = localStorage.getItem("first_name");
   const mName = localStorage.getItem("middle_name");
   const lName = localStorage.getItem("last_name");

  // Pagination states
  const [materialPage, setMaterialPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 5;

  // Stats states
  const [instructorStats, setInstructorStats] = useState({
    change: "0%",
    trend: "neutral",
  });
  const [adminStats, setAdminStats] = useState({
    change: "0%",
    trend: "neutral",
  });
  const [materialStats, setMaterialStats] = useState({
    change: "0%",
    trend: "neutral",
  });
  const [classroomStats, setClassroomStats] = useState({
    change: "0%",
    trend: "neutral",
  });
  const [activeClassroomStats, setActiveClassroomStats] = useState({
    change: "0%",
    trend: "neutral",
  });
  const [inactiveClassroomStats, setInactiveClassroomStats] = useState({
    change: "0%",
    trend: "neutral",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchInstructors(),
        fetchAdmins(),
        fetchClassrooms(),
        fetchMaterials(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstructors = async () => {
    const result = await getAllInstructors();
    if (result.success) {
      setInstructors(result.data.data);
      setInstructorStats(calculateGrowth(result.data.data, "created_at"));
    }
  };

  const fetchAdmins = async () => {
    const result = await getAllAdmins();
    if (result.success) {
      setAdmins(result.data.data);
      setAdminStats(calculateGrowth(result.data.data, "created_at"));
    }
  };

  const fetchClassrooms = async () => {
    const result = await allClassrooms();
    const all = result.data.data || [];
    setClassrooms(all);

    const hidden = all.filter((item) => item.is_hidden === 1);
    const unhidden = all.filter((item) => item.is_hidden === 0);

    setHiddenClassrooms(hidden);
    setUnhiddenClassrooms(unhidden);

    // Calculate growth stats for all classroom types
    setClassroomStats(calculateGrowth(all, "created_at"));
    setActiveClassroomStats(calculateGrowth(unhidden, "created_at"));
    setInactiveClassroomStats(calculateGrowth(hidden, "created_at"));
  };

  const fetchMaterials = async () => {
    const result = await getAllMaterials();
    if (result.success) {
      setMaterials(result.data.data || []);
      setMaterialStats(calculateGrowth(result.data.data, "created_at"));
    }
  };

  const prepareRecentActivity = () => {
    const allUsers = [
      ...instructors.map((user) => ({ ...user, role: "Instructor" })),
      ...admins.map((user) => ({ ...user, role: "Admin" })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setRecentActivity(allUsers);
  };

  useEffect(() => {
    if (instructors.length > 0 || admins.length > 0) {
      prepareRecentActivity();
    }
  }, [instructors, admins]);

  // Calculate paginated materials
  const paginatedMaterials = () => {
    const startIndex = (materialPage - 1) * itemsPerPage;
    return materials.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate paginated activities
  const paginatedActivities = () => {
    const startIndex = (activityPage - 1) * itemsPerPage;
    return recentActivity.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate total pages
  const totalMaterialPages = Math.ceil(materials.length / itemsPerPage);
  const totalActivityPages = Math.ceil(recentActivity.length / itemsPerPage);

  const calculateGrowth = (data, dateField = "created_at") => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    let thisMonthCount = 0;
    let lastMonthCount = 0;

    data.forEach((item) => {
      const createdDate = new Date(item[dateField]);
      if (createdDate >= startOfThisMonth && createdDate <= now) {
        thisMonthCount++;
      } else if (
        createdDate >= startOfLastMonth &&
        createdDate <= endOfLastMonth
      ) {
        lastMonthCount++;
      }
    });

    if (lastMonthCount === 0 && thisMonthCount > 0) {
      return { change: `New ${thisMonthCount}`, trend: "up" };
    } else if (lastMonthCount === 0 && thisMonthCount === 0) {
      return { change: "0%", trend: "neutral" };
    } else {
      const change = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
      return {
        change: `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`,
        trend: change >= 0 ? "up" : "down",
      };
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;

    return `${Math.floor(seconds)}s ago`;
  };

  const stats = [
    {
      title: "Instructors",
      value: instructors.length,
      icon: FiUsers,
      change: instructorStats.change,
      trend: instructorStats.trend,
    },
    {
      title: "Classrooms",
      value: classrooms.length,
      icon: FiBookOpen,
      change: classroomStats.change,
      trend: classroomStats.trend,
    },
    {
      title: "Active Classrooms",
      value: unhiddenClassrooms.length,
      icon: FiCheckCircle,
      change: activeClassroomStats.change,
      trend: activeClassroomStats.trend,
    },
    {
      title: "Inactive Classrooms",
      value: hiddenClassrooms.length,
      icon: FiXCircle,
      change: inactiveClassroomStats.change,
      trend: inactiveClassroomStats.trend,
    },
    {
      title: "Admins",
      value: admins.length,
      icon: FiShield,
      change: adminStats.change,
      trend: adminStats.trend,
    },
    {
      title: "Materials",
      value: materials.length,
      icon: FiFileText,
      change: materialStats.change,
      trend: materialStats.trend,
    },
  ];

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          <FiChevronLeft className="mr-1" /> Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          Next <FiChevronRight className="ml-1" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, {fName} 
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <stat.icon className="text-lg" />
              </div>
            </div>
            <p
              className={`mt-3 text-sm font-medium ${
                stat.trend === "up"
                  ? "text-green-600"
                  : stat.trend === "down"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {stat.change}{" "}
              {stat.trend === "up"
                ? "increase"
                : stat.trend === "down"
                ? "decrease"
                : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity with Pagination */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity ({recentActivity.length})
          </h2>
        </div>
        <div className="space-y-4">
          {paginatedActivities().map((activity, index) => (
            <div
              key={index}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-4">
                {activity.first_name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  New {activity.role} registered:{" "}
                  {activity.first_name} {activity.middle_name} {activity.last_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {totalActivityPages > 1 && (
          <Pagination
            currentPage={activityPage}
            totalPages={totalActivityPages}
            onPageChange={(page) => setActivityPage(page)}
          />
        )}
      </div>

      {/* Materials Table with Pagination */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            All Learning Materials ({materials.length})
          </h2>
        </div>

        {materials.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classroom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMaterials().map((material) => (
                    <tr key={material._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {material.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.classroom?.classroom_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {material.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimeAgo(material.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.material ? (
                          <a
                            href={`${BASE_URL}/uploads/${material.material}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View File
                          </a>
                        ) : (
                          "No file"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalMaterialPages > 1 && (
              <Pagination
                currentPage={materialPage}
                totalPages={totalMaterialPages}
                onPageChange={(page) => setMaterialPage(page)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No materials found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
