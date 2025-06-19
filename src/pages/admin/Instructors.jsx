// pages/Instructor/Instructors.jsx
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
  FiArrowDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getAllInstructors,
  registerInstructor,
  updateInstructor,
  deleteInstructor,
  promoteUser,
  checkPromotedUser,
} from "../../utils/authService";
import { toast } from "react-toastify";

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
  const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);
  const [deleteModalInstructor, setDeleteModalInstructor] = useState(null);
  const [promoteModalAdmin, setPromoteModalAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoteModalInstructor, setDemoteModalInstructor] = useState(null);
  const [originalRoles, setOriginalRoles] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [instructorsPerPage] = useState(5);
  const [totalInstructors, setTotalInstructors] = useState(0);

  const [newInstructor, setNewInstructor] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "Instructor",
  });

  const [editInstructorData, setEditInstructorData] = useState({
    id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    role: "Instructor",
  });

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchInstructors();
  }, [currentPage]);

  const fetchInstructors = async () => {
    setIsLoading(true);
    try {
      const result = await getAllInstructors(currentPage, instructorsPerPage);
      if (result.success) {
        setInstructors(result.data.data);
        setTotalInstructors(result.data.total || result.data.data.length);
        checkOriginalRoles(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Failed to fetch instructors");
    } finally {
      setIsLoading(false);
    }
  };

  const checkOriginalRoles = async (instructorsList) => {
    const roles = {};
    for (const instructor of instructorsList) {
      if (instructor.role === "instructor") {
        const response = await checkPromotedUser(instructor._id);
        if (response.success && response.data) {
          roles[instructor._id] = response.data.data;
        }
      }
    }
    setOriginalRoles(roles);
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor?.first_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      instructor?.middle_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      instructor?.last_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      instructor?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await registerInstructor(
        newInstructor.first_name,
        newInstructor.middle_name,
        newInstructor.last_name,
        newInstructor.email,
        newInstructor.password
      );

      if (response.success) {
        toast.success(
          `Instructor ${newInstructor.first_name} added successfully!`
        );
        setShowAddInstructorModal(false);
        setNewInstructor({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          password: "",
          role: "Instructor",
        });
        await fetchInstructors();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error adding instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add instructor. Please try again."
      );
    }
  };

  const handleEditInstructor = (instructor) => {
    setEditInstructorData({
      id: instructor._id,
      first_name: instructor.first_name,
      middle_name: instructor.middle_name,
      last_name: instructor.last_name,
      email: instructor.email,
      role: instructor.role,
    });
    setShowEditInstructorModal(true);
  };

  const handleUpdateInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInstructor(editInstructorData.id, {
        first_name: editInstructorData.first_name,
        middle_name: editInstructorData.middle_name,
        last_name: editInstructorData.last_name,
        email: editInstructorData.email,
      });

      if (response.success) {
        toast.success(
          `Instructor ${editInstructorData.first_name} updated successfully!`
        );
        setShowEditInstructorModal(false);
        await fetchInstructors();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update instructor. Please try again."
      );
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    try {
      const response = await deleteInstructor(instructorId);

      if (response.success) {
        toast.success("Instructor deleted successfully!");
        await fetchInstructors();
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete instructor. Please try again."
      );
    }
  };

  const handlePromoteAdmin = async (instructorId) => {
    try {
      const response = await promoteUser(instructorId, "admin");

      if (response.success) {
        toast.success("Instructor promoted to admin successfully!");
        await fetchInstructors();
      } else {
        toast.error(response.data || "Failed to promote admin");
      }
    } catch (error) {
      console.error("Error promoting admin:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to promote admin. Please try again."
      );
    } finally {
      setPromoteModalAdmin(null);
    }
  };

  const handleDemoteInstructor = async (instructorId) => {
    try {
      const originalRole = originalRoles[instructorId];
      if (!originalRole) {
        toast.error("Cannot determine original role for this user");
        return;
      }

      const response = await promoteUser(instructorId, originalRole);

      if (response.success) {
        toast.success(`Instructor demoted to ${originalRole} successfully!`);
        await fetchInstructors();
      } else {
        toast.error(response.data || "Failed to demote instructor");
      }
    } catch (error) {
      console.error("Error demoting instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to demote instructor. Please try again."
      );
    } finally {
      setDemoteModalInstructor(null);
    }
  };

  // Pagination logic
  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Instructors Management
        </h1>
        <button
          onClick={() => setShowAddInstructorModal(true)}
          className="cursor-pointer flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add Instructor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search instructors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading instructors...
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
                {currentInstructors.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No matching instructors found"
                        : "No instructors available"}
                    </td>
                  </tr>
                ) : (
                  currentInstructors.map((instructor) => (
                    <tr key={instructor._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
                            <FiUser />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {instructor.first_name} {instructor.middle_name}{" "}
                              {instructor.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMail className="mr-2" />
                          {instructor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800`}
                        >
                          {instructor.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-2" />
                          {new Date(instructor.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditInstructor(instructor)}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>

                          {instructor.role === "instructor" && (
                            <>
                              {originalRoles[instructor._id] === "student" ? (
                                <button
                                  onClick={() =>
                                    setDemoteModalInstructor(instructor)
                                  }
                                  className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                                  title="Demote to Student"
                                >
                                  <FiArrowDown size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setPromoteModalAdmin(instructor)
                                  }
                                  className="text-green-600 hover:text-green-900 cursor-pointer"
                                  title="Promote to Admin"
                                >
                                  <FiArrowUp size={18} />
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => setDeleteModalInstructor(instructor)}
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
      {filteredInstructors.length > instructorsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {indexOfFirstInstructor + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastInstructor, filteredInstructors.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredInstructors.length}
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

      {/* Add Instructor Modal */}
      {showAddInstructorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add New Instructor
              </h2>
              <form onSubmit={handleAddInstructor}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newInstructor.first_name}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
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
                    value={newInstructor.middle_name}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
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
                    value={newInstructor.last_name}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
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
                    value={newInstructor.email}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        email: e.target.value,
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
                    value={newInstructor.password}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newInstructor.role}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddInstructorModal(false)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Instructor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      {showEditInstructorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Edit Instructor
              </h2>
              <form onSubmit={handleUpdateInstructor}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editInstructorData.first_name}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
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
                    value={editInstructorData.middle_name}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
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
                    value={editInstructorData.last_name}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
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
                    value={editInstructorData.email}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editInstructorData.role}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditInstructorModal(false)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Update Instructor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Delete Instructor Account
                </h3>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  <p>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {deleteModalInstructor.first_name}
                    </span>
                    ?
                  </p>
                  <p className="mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalInstructor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteInstructor(deleteModalInstructor._id);
                    setDeleteModalInstructor(null);
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
      {promoteModalAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <FiArrowUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Promote User to Admin
                </h3>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  <p>
                    Are you sure you want to promote{" "}
                    <span className="font-semibold">
                      {promoteModalAdmin.first_name}
                    </span>{" "}
                    to Admin?
                  </p>
                  <p className="mt-1">
                    This will give them administrator-level access.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPromoteModalAdmin(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePromoteAdmin(promoteModalAdmin._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Promote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demote Confirmation Modal */}
      {demoteModalInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <FiArrowDown className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Demote Instructor to Student
                </h3>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  <p>
                    Are you sure you want to demote{" "}
                    <span className="font-semibold">
                      {demoteModalInstructor.first_name}
                    </span>{" "}
                    back to Student?
                  </p>
                  <p className="mt-1">
                    This will remove their instructor privileges.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDemoteModalInstructor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDemoteInstructor(demoteModalInstructor._id)
                  }
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  Demote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;
