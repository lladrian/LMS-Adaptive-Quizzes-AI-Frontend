import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiUpload,
  FiBook,
  FiBarChart2,
  FiCalendar,
  FiMessageSquare,
  FiAward,
  FiDownload,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { classroomOverviewSpecificInstructor } from "../utils/authService";

const InstructorDashboard = () => {
  const instructorId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [previousStats, setPreviousStats] = useState(null);

  // Load previous stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(`instructorStats_${instructorId}`);
    if (savedStats) {
      setPreviousStats(JSON.parse(savedStats));
    }
  }, [instructorId]);

  // Fetch classroom data
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const result = await classroomOverviewSpecificInstructor(instructorId);
        if (result.success) {
          // Merge classroom data with materials and students
          const mergedClassrooms = result.data?.data.map((item) => ({
            ...item.classroom,
            materials: item.materials || [],
            students: item.students || [],
          }));
          setClassrooms(mergedClassrooms || []);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to fetch classes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [instructorId]);

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalStudents = classrooms.reduce((total, classroom) => {
      return total + (classroom.students?.length || 0);
    }, 0);

    const activeClasses = classrooms.filter(
      (classroom) => classroom.is_hidden === 0
    ).length;

    const totalMaterials = classrooms.reduce((total, classroom) => {
      return total + (classroom.materials?.length || 0);
    }, 0);

    // Calculate changes from previous month
    const calculateChange = (currentValue, previousValue) => {
      if (!previousStats || previousValue === undefined) return "+0";
      const change = currentValue - previousValue;
      return `${change >= 0 ? "+" : ""}${change}`;
    };

    // Save current stats for next comparison
    const stats = {
      totalStudents,
      activeClasses,
      totalMaterials,
      month: currentMonth,
      year: currentYear,
    };
    localStorage.setItem(
      `instructorStats_${instructorId}`,
      JSON.stringify(stats)
    );

    return [
      {
        title: "Total Students",
        value: totalStudents,
        change: calculateChange(totalStudents, previousStats?.totalStudents),
        icon: FiUsers,
        color: "text-indigo-600",
        trend:
          totalStudents >= (previousStats?.totalStudents || 0) ? "up" : "down",
      },
      {
        title: "Active Classes",
        value: activeClasses,
        change: calculateChange(activeClasses, previousStats?.activeClasses),
        icon: FiBook,
        color: "text-green-600",
        trend:
          activeClasses >= (previousStats?.activeClasses || 0) ? "up" : "down",
      },
      {
        title: "Materials Shared",
        value: totalMaterials,
        change: calculateChange(totalMaterials, previousStats?.totalMaterials),
        icon: FiUpload,
        color: "text-blue-600",
        trend:
          totalMaterials >= (previousStats?.totalMaterials || 0)
            ? "up"
            : "down",
      },
    ];
  };

  // Generate recent activities
  const getRecentActivities = () => {
    const activities = [];

    classrooms.forEach((classroom) => {
      // Classroom creation activity
      activities.push({
        id: `${classroom._id}-created`,
        action: "Created new classroom",
        course: classroom.classroom_name,
        time: new Date(classroom.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        icon: FiBook,
        type: "classroom",
      });

      // Materials activities
      classroom.materials?.forEach((material) => {
        activities.push({
          id: material._id,
          action: "Uploaded new material",
          course: classroom.classroom_name,
          time: new Date(material.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          icon: FiUpload,
          type: "material",
        });
      });

      // Student activities
      classroom.students?.forEach((student) => {
        activities.push({
          id: student._id,
          action: "Student joined",
          course: classroom.classroom_name,
          time: new Date(student.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          icon: FiUsers,
          type: "student",
        });
      });
    });

    // Sort by date (newest first) and limit to 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getDashboardStats().map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs ${
                          stat.change.startsWith("+")
                            ? "text-green-500"
                            : stat.change === "+0"
                            ? "text-gray-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
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
              {getRecentActivities().length > 0 ? (
                getRecentActivities().map((activity) => (
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
                            : "bg-blue-100 text-blue-600"
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
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent activities found
                </div>
              )}
            </div>
          </div>

          {/* Classrooms List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center">
                <FiBook className="mr-2 text-indigo-600" />
                Your Classrooms
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                  <div
                    key={classroom._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {classroom.classroom_name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {classroom.description || "No description"}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="flex items-center text-sm text-gray-500">
                            <FiUsers className="mr-1" />
                            {classroom.students?.length || 0} students
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <FiUpload className="mr-1" />
                            {classroom.materials?.length || 0} materials
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(classroom.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No classrooms found
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
