// pages/Student/Students.jsx
import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getAllStudents,
  registerStudent,
  updateStudent,
  deleteStudent,
  promoteUser,
} from "../../utils/authService";
import { toast } from "react-toastify";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [deleteModalStudent, setDeleteModalStudent] = useState(null);
  const [promoteModalStudent, setPromoteModalStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [totalStudents, setTotalStudents] = useState(0);

  const [newStudent, setNewStudent] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    student_id_number: "",
    role: "Student",
  });

  const [editStudentData, setEditStudentData] = useState({
    id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    student_id_number: "",
    role: "Student",
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const result = await getAllStudents(currentPage, studentsPerPage);
      if (result.success) {
        setStudents(result.data.data);
        setTotalStudents(result.data.total || result.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const first_name = student.first_name?.toLowerCase() || "";
    const middle_name = student.middle_name?.toLowerCase() || "";
    const last_name = student.last_name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const idNumber = student.student_id_number?.toString().toLowerCase() || "";

    return (
      first_name.includes(searchTerm.toLowerCase()) ||
      middle_name.includes(searchTerm.toLowerCase()) ||
      last_name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      idNumber.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await registerStudent(
        newStudent.first_name,
        newStudent.middle_name,
        newStudent.last_name,
        newStudent.email,
        newStudent.password,
        newStudent.student_id_number
      );

      if (response.success) {
        toast.success(
          `Student ${newStudent.first_name} ${newStudent.middle_name} ${newStudent.last_name} added successfully!`
        );
        setShowAddStudentModal(false);
        setNewStudent({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          password: "",
          student_id_number: "",
          role: "Student",
        });
        await fetchStudents();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add student. Please try again."
      );
    }
  };

  const handleEditStudent = (student) => {
    setEditStudentData({
      id: student._id,
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      email: student.email,
      student_id_number: student.student_id_number,
      role: student.role,
    });
    setShowEditStudentModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await updateStudent(
        editStudentData.id,
        editStudentData.email,
        editStudentData.first_name,
        editStudentData.middle_name,
        editStudentData.last_name,
        editStudentData.student_id_number
      );

      if (response.success) {
        toast.success(
          `Student ${editStudentData.first_name} ${editStudentData.middle_name} ${editStudentData.last_name} updated successfully!`
        );
        setShowEditStudentModal(false);
        await fetchStudents();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update student. Please try again."
      );
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await deleteStudent(studentId);

      if (response.success) {
        toast.success("Student deleted successfully!");
        await fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete student. Please try again."
      );
    }
  };

  const handlePromoteStudent = async (studentId) => {
    try {
      const response = await promoteUser(studentId, "instructor");

      if (response.success) {
        toast.success("Student promoted to instructor successfully!");
        await fetchStudents();
      } else {
        toast.error(response.error || "Failed to promote student");
      }
    } catch (error) {
      console.error("Error promoting student:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to promote student. Please try again."
      );
    } finally {
      setPromoteModalStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Students Management
        </h1>
        <button
          onClick={() => setShowAddStudentModal(true)}
          className="cursor-pointer flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading students...
          </div>
        ) : (
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
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CREATED
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No matching students found"
                        : "No students available"}
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
                            <FiUser />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.middle_name}{" "}
                              {student.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMail className="mr-2" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.student_id_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.role === "Instructor"
                              ? "bg-green-100 text-green-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {student.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-2" />
                          {new Date(student.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          {student.role === "student" && (
                            <button
                              onClick={() => setPromoteModalStudent(student)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                              title="Promote to Instructor"
                            >
                              <FiArrowUp size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteModalStudent(student)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStudents.length > studentsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstStudent + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastStudent, filteredStudents.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {getPageNumbers().map((number, index) => (
                  <React.Fragment key={index}>
                    {number === "..." ? (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add New Student
              </h2>
              <form onSubmit={handleAddStudent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.first_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.middle_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        middle_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.last_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.student_id_number}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        student_id_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newStudent.password}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Edit Student
              </h2>
              <form onSubmit={handleUpdateStudent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStudentData.first_name}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStudentData.middle_name}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        middle_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStudentData.last_name}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStudentData.email}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editStudentData.student_id_number}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        student_id_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditStudentModal(false)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Delete Student Account
                </h3>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  <p>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {deleteModalStudent.first_name}{" "}
                      {deleteModalStudent.middle_name}{" "}
                      {deleteModalStudent.last_name}
                    </span>
                    ?
                  </p>
                  <p className="mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalStudent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteStudent(deleteModalStudent._id);
                    setDeleteModalStudent(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promote Confirmation Modal */}
      {promoteModalStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <FiArrowUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Promote Student to Instructor
                </h3>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  <p>
                    Are you sure you want to promote{" "}
                    <span className="font-semibold">
                      {promoteModalStudent.first_name}{" "}
                      {promoteModalStudent.middle_name}{" "}
                      {promoteModalStudent.last_name}
                    </span>{" "}
                    to Instructor?
                  </p>
                  <p className="mt-1">
                    This will give them instructor-level access.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPromoteModalStudent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePromoteStudent(promoteModalStudent._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Promote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
