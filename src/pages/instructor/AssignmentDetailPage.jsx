import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiFileText,
  FiCalendar,
  FiUsers,
  FiDownload,
  FiArrowLeft,
  FiBarChart2,
  FiMessageSquare,
  FiEdit2,
} from "react-icons/fi";

const AssignmentDetailPage = () => {
  const { classId, assignmentId } = useParams();
  
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Fetch assignment and submissions data
    const fetchData = async () => {
      // Simulated API calls
      const mockAssignment = {
        id: assignmentId,
        title: "Sorting Algorithms Assignment",
        description: "Implement and analyze various sorting algorithms",
        type: "assignment",
        points: 100,
        dueDate: "2023-06-10T23:59",
        instructions:
          "Submit your code files along with a report analyzing the time complexity of each algorithm.",
        attachments: [
          { name: "Assignment Guidelines.pdf", type: "pdf", size: "2.4 MB" },
          { name: "Sample Code.zip", type: "zip", size: "1.1 MB" },
        ],
      };

      const mockSubmissions = [
        {
          id: 1,
          student: "John Doe",
          submitted: "2023-06-08 14:30",
          status: "graded",
          grade: "85/100",
          files: ["sorting_algorithms.py", "report.pdf"],
        },
        {
          id: 2,
          student: "Jane Smith",
          submitted: "2023-06-09 10:15",
          status: "graded",
          grade: "92/100",
          files: ["assignment_code.zip"],
        },
        {
          id: 3,
          student: "Alex Johnson",
          submitted: "",
          status: "missing",
          grade: "0/100",
          files: [],
        },
      ];

      setAssignment(mockAssignment);
      setSubmissions(mockSubmissions);
    };
    fetchData();
  }, [assignmentId]);

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to={`/instructor/class/${classId}`}
            className="p-2 mr-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft />
          </Link>
          <h2 className="text-lg font-semibold">{assignment.title}</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Assignment Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
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
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-3 font-medium ${
              activeTab === "submissions"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("grades")}
            className={`px-6 py-3 font-medium ${
              activeTab === "grades"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Grades
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiCalendar className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiFileText className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{assignment.type}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiBarChart2 className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="font-medium">{assignment.points}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{assignment.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {assignment.instructions}
              </p>
            </div>

            {assignment.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                <div className="space-y-2">
                  {assignment.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            file.type === "pdf"
                              ? "bg-red-100 text-red-600"
                              : file.type === "zip"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FiFileText />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <FiDownload />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.submitted || "Not submitted"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {submission.status !== "missing" ? (
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Grade
                        </button>
                      ) : (
                        <button className="text-gray-400 cursor-not-allowed">
                          -
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
              <div className="h-64">
                {/* Placeholder for grade distribution chart */}
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <p className="text-gray-500">
                    Grade distribution chart will appear here
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Grade Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Average Grade</p>
                  <p className="text-2xl font-bold">85.6/100</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Highest Grade</p>
                  <p className="text-2xl font-bold">98/100</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Lowest Grade</p>
                  <p className="text-2xl font-bold">72/100</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Submission Rate</p>
                  <p className="text-2xl font-bold">86.7%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <FiDownload className="mr-2" /> Export Grades
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
