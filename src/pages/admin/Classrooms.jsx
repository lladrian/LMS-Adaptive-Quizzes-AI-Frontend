import React, { useState, useEffect } from "react";
import {
  FiBook,
  FiUser,
  FiCalendar,
  FiSearch,
  FiPlus,
  FiArchive,
  FiRotateCcw,
} from "react-icons/fi";
import { allClassrooms } from "../../utils/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const result = await allClassrooms();
      if (result.success) {
        setClassrooms(result.data.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      toast.error("Failed to fetch classrooms");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.classroom_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classroom.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusText = (isHidden) => (isHidden ? "archived" : "active");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
         View All Classrooms 
        </h1>
      {/*   <Link
          to="/admin/classrooms/create"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add Classroom
        </Link> */}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search classrooms by name or subject code..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Classrooms Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classroom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classroom Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClassrooms.map((classroom) => (
                  <tr key={classroom._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
                          <FiBook />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {classroom.classroom_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Instructor ID: {classroom.instructor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classroom.subject_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {classroom.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classroom.classroom_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-2" />
                        {new Date(classroom.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          classroom.is_hidden === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getStatusText(classroom.is_hidden)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/classrooms/${classroom._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      {classroom.is_hidden === 0 ? (
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <FiArchive />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-900">
                          <FiRotateCcw />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classrooms;
