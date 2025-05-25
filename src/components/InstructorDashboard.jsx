import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUpload,
  FiBook,
  FiPlus,
  FiLogOut,
  FiBarChart2,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
  FiAward,
  FiClock,
  FiDownload,
  FiMail,
} from "react-icons/fi";

const InstructorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced data structure
  const dashboardData = {
    stats: [
      {
        title: "Total Students",
        value: 142,
        change: "+12%",
        icon: FiUsers,
        color: "text-indigo-600",
        trend: "up",
      },
      {
        title: "Active Classes",
        value: 8,
        change: "+2",
        icon: FiBook,
        color: "text-green-600",
        trend: "up",
      },
      {
        title: "Materials Shared",
        value: 47,
        change: "+5",
        icon: FiUpload,
        color: "text-blue-600",
        trend: "up",
      },
      {
        title: "Pending Grading",
        value: 23,
        change: "-8",
        icon: FiAlertCircle,
        color: "text-yellow-600",
        trend: "down",
      },
      {
        title: "Avg. Class Rating",
        value: 4.8,
        change: "+0.2",
        icon: FiAward,
        color: "text-purple-600",
        trend: "up",
      },
    ],
    recentActivities: [
      {
        id: 1,
        action: "Uploaded new material",
        course: "Math 101",
        time: "2 hours ago",
        icon: FiUpload,
        type: "material",
      },
      {
        id: 2,
        action: "Added new student",
        course: "Science 202",
        time: "5 hours ago",
        icon: FiUsers,
        type: "student",
      },
      {
        id: 3,
        action: "Created new assignment",
        course: "History 301",
        time: "1 day ago",
        icon: FiBook,
        type: "assignment",
      },
      {
        id: 4,
        action: "Graded submissions",
        course: "English 102",
        time: "2 days ago",
        icon: FiBarChart2,
        type: "grading",
      },
      {
        id: 5,
        action: "Replied to student query",
        course: "CS401",
        time: "3 days ago",
        icon: FiMessageSquare,
        type: "communication",
      },
    ],
    performanceMetrics: {
      studentEngagement: 78,
      assignmentCompletion: 92,
      avgGrades: 85.6,
    },
    quickLinks: [
      {
        title: "Course Analytics",
        icon: FiAward,
        path: "/instructor/analytics",
      },
      {
        title: "Student Reports",
        icon: FiUsers,
        path: "/instructor/reports",
      },
      {
        title: "Resource Library",
        icon: FiDownload,
        path: "/instructor/resources",
      },
    ],
  };

  const quickActions = [
    {
      icon: FiPlus,
      label: "Add Student",
      action: () => navigate("/instructor/students/new"),
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: FiUpload,
      label: "Upload Material",
      action: () => navigate("/instructor/materials/upload"),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FiBook,
      label: "Create Class",
      action: () => navigate("/instructor/classes/new"),
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Welcome back, Gerald</h1>

      {/* Dashboard Content */}
      {location.pathname === "/instructor/dashboard" && (
        <div className="space-y-6">
          {/* Dashboard Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "overview"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "performance"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab("quick-access")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "quick-access"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Quick Access
              </button>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                    {dashboardData.stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-semibold mt-1">
                              {stat.value}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`text-xs ${
                                  stat.trend === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {stat.change}
                              </span>
                              <svg
                                className={`w-4 h-4 ml-1 ${
                                  stat.trend === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {stat.trend === "up" ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                )}
                              </svg>
                            </div>
                          </div>
                          <div
                            className={`p-2 rounded-lg ${stat.color
                              .replace("text", "bg")
                              .replace("600", "100")}`}
                          >
                            <stat.icon className={`text-xl ${stat.color}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activities */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold flex items-center">
                        <FiBarChart2 className="mr-2 text-indigo-600" />
                        Recent Activities
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {dashboardData.recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start">
                            <div
                              className={`p-2 rounded-lg mr-3 ${
                                activity.type === "material"
                                  ? "bg-indigo-100 text-indigo-600"
                                  : activity.type === "student"
                                  ? "bg-green-100 text-green-600"
                                  : activity.type === "assignment"
                                  ? "bg-blue-100 text-blue-600"
                                  : activity.type === "grading"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              <activity.icon />
                            </div>
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-500">
                                {activity.course} • {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "performance" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Engagement */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Student Engagement</h4>
                        <span className="text-sm text-gray-500">
                          Last 30 days
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-indigo-600 h-4 rounded-full"
                            style={{
                              width: `${dashboardData.performanceMetrics.studentEngagement}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-3 font-medium">
                          {dashboardData.performanceMetrics.studentEngagement}%
                        </span>
                      </div>
                    </div>

                    {/* Assignment Completion */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Assignment Completion</h4>
                        <span className="text-sm text-gray-500">
                          Current Term
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-green-600 h-4 rounded-full"
                            style={{
                              width: `${dashboardData.performanceMetrics.assignmentCompletion}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-3 font-medium">
                          {
                            dashboardData.performanceMetrics
                              .assignmentCompletion
                          }
                          %
                        </span>
                      </div>
                    </div>

                    {/* Average Grades */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Average Grades</h4>
                        <span className="text-sm text-gray-500">
                          Current Term
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center">
                          <div
                            className="radial-progress text-indigo-600"
                            style={{
                              "--value":
                                dashboardData.performanceMetrics.avgGrades,
                              "--size": "8rem",
                            }}
                          >
                            {dashboardData.performanceMetrics.avgGrades}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quick-access" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg hover:shadow-md transition-all ${action.color}`}
                      >
                        <action.icon className="text-2xl mb-2" />
                        <span className="text-sm text-center font-medium">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mt-8">Quick Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dashboardData.quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.path}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center"
                      >
                        <div
                          className={`p-3 rounded-lg mr-3 ${
                            link.icon === FiBarChart2
                              ? "bg-indigo-100 text-indigo-600"
                              : link.icon === FiAward
                              ? "bg-yellow-100 text-yellow-600"
                              : link.icon === FiUsers
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <link.icon className="text-xl" />
                        </div>
                        <span className="font-medium">{link.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
