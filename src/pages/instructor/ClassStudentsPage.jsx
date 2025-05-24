import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiUsers, FiPlus, FiSearch, FiX, FiArrowLeft } from "react-icons/fi";

const ClassStudentsPage = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    // Fetch class and students data
    const fetchData = async () => {
      // Simulated API calls
      const mockClass = {
        id: classId,
        name: "Advanced Programming",
        code: "CS401",
        currentStudents: 24,
        maxStudents: 30,
      };

      const mockStudents = [
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
      ];

      setClassInfo(mockClass);
      setStudents(mockStudents);
    };
    fetchData();
  }, [classId]);

  const removeStudent = (studentId) => {
    setStudents(students.filter((student) => student.id !== studentId));
  };

  const toggleStatus = (studentId) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: student.status === "active" ? "inactive" : "active",
            }
          : student
      )
    );
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div>
            <h2 className="text-lg font-semibold">
              {classInfo.name} ({classInfo.code})
            </h2>
            <p className="text-sm text-gray-500">
              {classInfo.currentStudents} of {classInfo.maxStudents} students
            </p>
          </div>
        </div>
        <Link
          to={`/instructor/class/${classId}/students/add`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" /> Add Students
        </Link>
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
            {filteredStudents.map((student) => (
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
                      onClick={() => toggleStatus(student.id)}
                      className={`${
                        student.status === "active"
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {student.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => removeStudent(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassStudentsPage;
