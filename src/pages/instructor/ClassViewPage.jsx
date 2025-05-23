import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiBook,
  FiUpload,
  FiUsers,
  FiBarChart2,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const ClassViewPage = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState("lessons");
  const [expandedSection, setExpandedSection] = useState(null);

  // Sample data - in a real app, this would come from an API
  const classData = {
    id: classId,
    name: "Advanced Programming",
    code: "CS401",
    description:
      "Advanced concepts in programming including algorithms, data structures and system design",
    students: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        joined: "2023-01-15",
        status: "active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        joined: "2023-01-15",
        status: "active",
      },
      {
        id: 3,
        name: "Alex Johnson",
        email: "alex@example.com",
        joined: "2023-01-20",
        status: "inactive",
      },
    ],
    lessons: [
      {
        id: 1,
        title: "Algorithm Complexity",
        type: "lecture",
        date: "2023-05-01",
        downloads: 24,
      },
      {
        id: 2,
        title: "Data Structures Review",
        type: "slides",
        date: "2023-05-08",
        downloads: 18,
      },
      {
        id: 3,
        title: "System Design Principles",
        type: "video",
        date: "2023-05-15",
        downloads: 32,
      },
    ],
    assignments: [
      {
        id: 1,
        title: "Sorting Algorithms",
        type: "quiz",
        due: "2023-05-10",
        submissions: 18,
        graded: 15,
      },
      {
        id: 2,
        title: "Final Project",
        type: "exam",
        due: "2023-06-01",
        submissions: 10,
        graded: 2,
      },
    ],
    announcements: [
      {
        id: 1,
        title: "Office Hours Change",
        date: "2023-05-12",
        content:
          "My office hours this week will be on Wednesday instead of Tuesday.",
      },
      {
        id: 2,
        title: "Assignment Extension",
        date: "2023-05-05",
        content:
          "The deadline for the sorting algorithms assignment has been extended by 3 days.",
      },
    ],
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const removeStudent = (studentId) => {
    // In a real app, this would call an API
    console.log(`Removing student ${studentId} from class`);
  };

  const toggleStudentStatus = (studentId) => {
    // In a real app, this would call an API
    console.log(`Toggling status for student ${studentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {classData.name}
            </h1>
            <p className="text-gray-600">
              {classData.code} • {classData.students.length} students
            </p>
            <p className="mt-2 text-gray-700">{classData.description}</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
              <FiEdit2 className="mr-2" /> Edit Class
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <FiMessageSquare className="mr-2" /> New Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-6 py-3 font-medium ${
              activeTab === "lessons"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-6 py-3 font-medium ${
              activeTab === "assignments"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-6 py-3 font-medium ${
              activeTab === "students"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-6 py-3 font-medium ${
              activeTab === "announcements"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Announcements
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Lessons Tab */}
          {activeTab === "lessons" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lesson Materials</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <FiUpload className="mr-2" /> Upload Lesson
                </button>
              </div>

              <div className="space-y-3">
                {classData.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                            {lesson.type}
                          </span>
                          <span>Posted: {lesson.date}</span>
                          <span className="mx-2">•</span>
                          <span>{lesson.downloads} downloads</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <FiDownload />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <FiEdit2 />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assignments & Exams</h2>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                    <FiPlus className="mr-2" /> New Quiz
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <FiPlus className="mr-2" /> New Exam
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {classData.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        toggleSection(`assignment-${assignment.id}`)
                      }
                    >
                      <div>
                        <h3 className="font-medium flex items-center">
                          {assignment.title}
                          <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs capitalize">
                            {assignment.type}
                          </span>
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiClock className="mr-1" />
                          <span>Due: {assignment.due}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-green-600">
                            {assignment.graded} graded
                          </span>
                          <span className="mx-2 text-gray-300">/</span>
                          <span>{assignment.submissions} submissions</span>
                        </div>
                        {expandedSection === `assignment-${assignment.id}` ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {expandedSection === `assignment-${assignment.id}` && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Submissions</h4>
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            Download All
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Submitted
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Score
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {classData.students
                                .filter((s) => s.status === "active")
                                .map((student) => (
                                  <tr key={student.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {student.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      2023-05-08
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Submitted
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      85/100
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                        Grade
                                      </button>
                                      <button className="text-gray-600 hover:text-gray-900">
                                        <FiDownload />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <FiBarChart2 className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Average score: 78.5/100
                            </span>
                          </div>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                            View Statistics
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Class Students</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <FiPlus className="mr-2" /> Add Students
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Export List
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classData.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.joined}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                student.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => toggleStudentStatus(student.id)}
                                className={`p-1 rounded-full ${
                                  student.status === "active"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                title={
                                  student.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {student.status === "active" ? (
                                  <FiXCircle />
                                ) : (
                                  <FiCheckCircle />
                                )}
                              </button>
                              <button
                                onClick={() => removeStudent(student.id)}
                                className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-1 rounded-full"
                                title="Remove from class"
                              >
                                <FiTrash2 />
                              </button>
                              <button
                                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded-full"
                                title="Message student"
                              >
                                <FiMessageSquare />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Class Announcements</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <FiPlus className="mr-2" /> New Announcement
                </button>
              </div>

              <div className="space-y-4">
                {classData.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Posted: {announcement.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-800">
                            <FiEdit2 />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassViewPage;
