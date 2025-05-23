// src/pages/AdminDashboard.jsx
import React from "react";
import AdminLayout from "../pages/layouts/AdminLayout";
import {
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineCheckCircle,
} from "react-icons/ai";

function StatCard({ title, value, icon: Icon, iconColor }) {
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${iconColor} text-white`}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function RecentActivityTable() {
  const data = [
    { id: 1, action: "Added new instructor John Doe", date: "2025-05-15" },
    { id: 2, action: "Edited instructor Jane Smith", date: "2025-05-14" },
    { id: 3, action: "Deleted instructor Mark Twain", date: "2025-05-12" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-5 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Activities
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 px-4 text-gray-600 font-medium">Activity</th>
            <th className="py-2 px-4 text-gray-600 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, action, date }) => (
            <tr
              key={id}
              className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-800">{action}</td>
              <td className="py-3 px-4 text-gray-600">{date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Instructors"
          value="24"
          icon={AiOutlineUser}
          iconColor="bg-indigo-600"
        />
        <StatCard
          title="Courses"
          value="12"
          icon={AiOutlineFileText}
          iconColor="bg-green-600"
        />
        <StatCard
          title="Completed Exams"
          value="120"
          icon={AiOutlineCheckCircle}
          iconColor="bg-yellow-500"
        />
      </div>

      {/* Recent Activities Table */}
      <RecentActivityTable />
    </AdminLayout>
  );
}
