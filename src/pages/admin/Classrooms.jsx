import React, { useState, useEffect } from "react";
import {
  FiBook,
  FiUser,
  FiCalendar,
  FiSearch,
  FiPlus,
  FiArchive,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { allClassrooms } from "../../utils/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SectionRestrictionModal from "../../components/SectionRestrictionModal";
const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [classroomsPerPage] = useState(5); // Number of items per page
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const availableSections = [
    "lessons",
    "assignments",
    "grades",
    "practice",
    "students",
    "materials",
    "activities",
  ];

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

  // Add this function to handle the restriction update
  const handleRestrictionUpdate = (classroomId, updatedSections) => {
    setClassrooms((prev) =>
      prev.map((c) =>
        c._id === classroomId
          ? { ...c, restricted_sections: updatedSections }
          : c
      )
    );
  };

  // Filter classrooms based on search term
  const filteredClassrooms = classrooms.filter((classroom) => {
    const classroomName = classroom.classroom_name?.toLowerCase() || "";
    const subjectCode = classroom.subject_code?.toLowerCase() || "";
    const instructorEmail = classroom.instructor?.email?.toLowerCase() || "";
    const instructorFName = classroom.instructor?.first_name?.toLowerCase() || "";
    const instructorMName = classroom.instructor?.middle_name?.toLowerCase() || "";
    const instructorLName = classroom.instructor?.last_name?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();

    return (
      classroomName.includes(term) ||
      subjectCode.includes(term) ||
      instructorEmail.includes(term) ||
      instructorFName.includes(term) ||
      instructorMName.includes(term) ||
      instructorLName.includes(term)
    );
  });



  // Get current classrooms for pagination
  const indexOfLastClassroom = currentPage * classroomsPerPage;
  const indexOfFirstClassroom = indexOfLastClassroom - classroomsPerPage;
  const currentClassrooms = filteredClassrooms.slice(
    indexOfFirstClassroom,
    indexOfLastClassroom
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusText = (isHidden) => (isHidden ? "archived" : "active");

  // Calculate total pages
  const totalPages = Math.ceil(filteredClassrooms.length / classroomsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          View All Classrooms
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search classrooms by name, subject code, or instructor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
          <>
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
                      Instructor
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
                  {currentClassrooms.length > 0 ? (
                    currentClassrooms.map((classroom) => (
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
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {classroom.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {classroom.subject_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {classroom?.instructor || classroom?.student_instructor ? (
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                                <FiUser />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {classroom?.student_instructor?.first_name} {classroom?.student_instructor?.middle_name} {classroom?.student_instructor?.last_name}
                                  {classroom?.instructor?.first_name} {classroom?.instructor?.middle_name} {classroom?.instructor?.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {classroom?.student_instructor?.email}
                                  {classroom?.instructor?.email}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No instructor
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {classroom.classroom_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar className="mr-2" />
                            {new Date(
                              classroom.created_at
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classroom.is_hidden === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {getStatusText(classroom.is_hidden)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {/*       <Link
                            to={`/admin/classrooms/${classroom._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link> */}
                          <button
                            onClick={() => {
                              setSelectedClassroom(classroom);
                              setShowRestrictionModal(true);
                            }}
                            className="cursor-pointer text-purple-600 hover:text-purple-900"
                          >
                            Restrict
                          </button>
                          {/*  {classroom.is_hidden === 0 ? (
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <FiArchive />
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-900">
                              <FiRotateCcw />
                            </button>
                          )} */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No classrooms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredClassrooms.length > classroomsPerPage && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`cursor-pointer ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstClassroom + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          indexOfLastClassroom,
                          filteredClassrooms.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredClassrooms.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`cursor-pointer relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`cursor-pointer relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                          >
                            {number}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`cursor-pointer relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showRestrictionModal && selectedClassroom && (
        <SectionRestrictionModal
          classroom={selectedClassroom}
          onClose={() => setShowRestrictionModal(false)}
          onUpdate={(sections) =>
            handleRestrictionUpdate(selectedClassroom._id, sections)
          }
          availableSections={availableSections}
        />
      )}
    </div>
  );
};

export default Classrooms;
