// pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FiUsers, FiBook, FiUserPlus, FiTrendingUp } from "react-icons/fi";
import { getAllInstructors, getAllAdmins } from "../utils/authService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [Instructors, setInstructors] = useState([]);
  const [Admins, setAdmins] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Stats for growth changes
  const [instructorStats, setInstructorStats] = useState({
    change: "0%",
    trend: "neutral",
  });

  const [adminStats, setAdminStats] = useState({
    change: "0%",
    trend: "neutral",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [instructorResult, adminResult] = await Promise.all([
        getAllInstructors(),
        getAllAdmins(),
      ]);

      if (instructorResult.success) {
        const instructors = instructorResult.data.data;
        setInstructors(instructors);
        setInstructorStats(calculateGrowth(instructors, "created_at"));
      }

      if (adminResult.success) {
        const admins = adminResult.data.data;
        setAdmins(admins);
        setAdminStats(calculateGrowth(admins, "created_at"));
      }

      // Prepare recent activity
      prepareRecentActivity(instructorResult.data.data, adminResult.data.data);
    } catch (error) {
      console.error("Error fetching Instructors or Admins:", error);
      toast.error("Failed to fetch Instructors or Admins");
    } finally {
      setIsLoading(false);
    }
  };

  const prepareRecentActivity = (instructors, admins) => {
    // Combine instructors and admins with their roles
    const allUsers = [
      ...instructors.map(user => ({ ...user, role: 'Instructor' })),
      ...admins.map(user => ({ ...user, role: 'Admin' }))
    ];
    
    // Sort by creation date (newest first)
    const sortedUsers = allUsers.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    // Take the 4 most recent
    const recent = sortedUsers.slice(0, 4);
    
    setRecentActivity(recent);
  };

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
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  const stats = [
    {
      title: "Total Instructors",
      value: Instructors.length.toString(),
      icon: FiUsers,
      change: instructorStats.change,
      trend: instructorStats.trend,
    },
    {
      title: "Active Classrooms",
      value: "56", // Static for now
      icon: FiBook,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Admins",
      value: Admins.length.toString(),
      icon: FiUserPlus,
      change: adminStats.change,
      trend: adminStats.trend,
    },
    {
      title: "Student Engagement",
      value: "78%",
      icon: FiTrendingUp,
      change: "+8%",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Welcome back, Gerald</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change} from this month
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-4">
                {activity.fullname ? activity.fullname.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  New {activity.role} registered: {activity.fullname || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;