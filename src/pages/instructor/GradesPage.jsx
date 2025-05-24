import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiBarChart2, FiDownload, FiFilter, FiSearch } from "react-icons/fi";

const GradesPage = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState("all");

  const classes = [
    { id: 1, name: "Advanced Programming", code: "CS401" },
    { id: 2, name: "Data Structures", code: "CS301" },
  ];

  const assignments = [
    { id: 1, title: "Sorting Quiz", class: "CS401" },
    { id: 2, title: "Midterm Exam", class: "CS401" },
    { id: 3, title: "Linked Lists", class: "CS301" },
  ];

  const students = [
    {
      id: 1,
      name: "John Doe",
      assignments: [
        { id: 1, score: "85/100", status: "graded" },
        { id: 2, score: "88/100", status: "graded" },
        { id: 3, score: "92/100", status: "graded" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      assignments: [
        { id: 1, score: "78/100", status: "graded" },
        { id: 2, score: "82/100", status: "graded" },
        { id: 3, score: "95/100", status: "graded" },
      ],
    },
  ];

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Grades Management
        </h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <FiDownload className="mr-2" /> Export Grades
        </button>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Assignments</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center w-full justify-center">
                <FiFilter className="mr-2" /> Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  {assignments
                    .filter(
                      (a) =>
                        selectedClass === "all" ||
                        a.class ===
                          classes.find((c) => c.id === parseInt(selectedClass))
                            ?.code
                    )
                    .filter(
                      (a) =>
                        selectedAssignment === "all" ||
                        a.id === parseInt(selectedAssignment)
                    )
                    .map((assignment) => (
                      <th
                        key={assignment.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {assignment.title}
                      </th>
                    ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    {assignments
                      .filter(
                        (a) =>
                          selectedClass === "all" ||
                          a.class ===
                            classes.find(
                              (c) => c.id === parseInt(selectedClass)
                            )?.code
                      )
                      .filter(
                        (a) =>
                          selectedAssignment === "all" ||
                          a.id === parseInt(selectedAssignment)
                      )
                      .map((assignment) => (
                        <td
                          key={assignment.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {student.assignments.find(
                            (a) => a.id === assignment.id
                          )?.score || "-"}
                        </td>
                      ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      85.6%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradesPage;
