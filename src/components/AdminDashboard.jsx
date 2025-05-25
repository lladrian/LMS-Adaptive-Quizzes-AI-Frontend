// pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FiUsers, FiBook, FiUserPlus, FiTrendingUp } from "react-icons/fi";
import { getAllInstructors, getAllAdmins } from "../utils/authService";
import { toast } from "react-toastify";
import { startOfWeek } from "date-fns";


const AdminDashboard = () => {
  const isSuperAdmin = true;

  const [Instructors, setInstructors] = useState([]);
  const [Admins, setAdmins] = useState([]);
  const [Students, setStudents] = useState([]); // Not used currently
  const [isLoading, setIsLoading] = useState(false);
  const [instructorStats, setInstructorStats] = useState({
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
        calculateInstructorGrowth(instructors);
      }

      if (adminResult.success) {
        setAdmins(adminResult.data.data);
        console.log("Admins fetched:", adminResult.data);
      }
    } catch (error) {
      console.error("Error fetching Instructors or Admins:", error);
      toast.error("Failed to fetch Instructors or Admins");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateInstructorGrowth = (data) => {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);
    const startOfLastWeek = startOfWeek(endOfLastWeek, { weekStartsOn: 1 });

    let thisWeekCount = 0;
    let lastWeekCount = 0;

    data.forEach((item) => {
      const createdDate = new Date(item.created_at);
      if (createdDate >= startOfThisWeek && createdDate <= now) {
        thisWeekCount++;
      } else if (createdDate >= startOfLastWeek && createdDate <= endOfLastWeek) {
        lastWeekCount++;
      }
    });

    const change =
      lastWeekCount === 0
        ? thisWeekCount * 100
        : ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;

    setInstructorStats({
      change: `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`,
      trend: change >= 0 ? "up" : "down",
    });
  };



  const stats = [
    {
      title: "Total Instructors",
      value: Instructors.length.toString(),
      icon: FiUsers,
      change: "+3%", // Placeholder
      trend: "up",
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
      change: "+1",
      trend: "up",
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
              {stat.change} from last month
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
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-4">
                {String.fromCharCode(65 + item)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  New instructor registered
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
