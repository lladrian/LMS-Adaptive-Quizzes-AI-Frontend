import React from "react";
import { Link } from "react-router-dom";
import { FiBook, FiClock, FiAward } from "react-icons/fi";

const DashboardHome = () => {
  // Sample data
  const stats = [
    { title: "Enrolled Classes", value: 3, icon: FiBook, color: "indigo" },
    { title: "Pending Assignments", value: 2, icon: FiClock, color: "yellow" },
    { title: "Average Grade", value: "88.5%", icon: FiAward, color: "green" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Algorithm Quiz", class: "CS401", due: "2023-06-10" },
    { id: 2, title: "Final Project", class: "CS301", due: "2023-06-15" },
  ];

  const recentGrades = [
    { id: 1, title: "Sorting Assignment", class: "CS401", score: "85/100" },
    { id: 2, title: "Midterm Exam", class: "CS301", score: "92/100" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </header>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  <stat.icon className="text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
            <Link
              to="/student/classes"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {assignment.class} • Due: {assignment.due}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Quiz
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Grades</h3>
            <Link
              to="/student/grades"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentGrades.map((grade) => (
              <div
                key={grade.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{grade.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{grade.class}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{grade.score}</span>
                    <span className="block text-xs text-green-600">Graded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
