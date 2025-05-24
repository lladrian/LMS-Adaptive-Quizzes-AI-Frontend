import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiX,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";

const AddStudentsToClassPage = () => {
  const { classId } = useParams();
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    // Fetch class and all students data
    const fetchData = async () => {
      // Simulated API calls
      const mockClass = {
        id: classId,
        name: "Advanced Programming",
        code: "CS401",
      };

      const mockStudents = [
        { id: 1, name: "Michael Brown", email: "michael@example.com" },
        { id: 2, name: "Sarah Wilson", email: "sarah@example.com" },
        { id: 3, name: "David Lee", email: "david@example.com" },
        { id: 4, name: "Emily Chen", email: "emily@example.com" },
      ];

      setClassInfo(mockClass);
      setAllStudents(mockStudents);
    };
    fetchData();
  }, [classId]);

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Students added:", selectedStudents);
    // Navigate back to class students page
    window.location.href = `/instructor/class/${classId}/students`;
  };

  const filteredStudents = allStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to={`/instructor/class/${classId}/students`}
            className="p-2 mr-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft />
          </Link>
          <h2 className="text-lg font-semibold">
            Add Students to {classInfo.name}
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={selectedStudents.length === 0}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
            selectedStudents.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FiPlus className="mr-2" /> Add Selected ({selectedStudents.length})
        </button>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={`hover:bg-gray-50 ${
                  selectedStudents.includes(student.id) ? "bg-indigo-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStudentSelection(student.id)}
                    className={`p-1 rounded-full ${
                      selectedStudents.includes(student.id)
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 text-transparent"
                    }`}
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddStudentsToClassPage;
