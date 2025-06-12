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

  const [newInstructor, setNewInstructor] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "Instructor",
  });

  const [editInstructorData, setEditInstructorData] = useState({
    id: "",
    fullname: "",
    email: "",
    role: "Instructor",
  });

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setIsLoading(true);
    try {
      const result = await getAllInstructors();
      if (result.success) {
        setInstructors(result.data.data);
        // Check original roles for each instructor
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
          roles[instructor._id] = response.data.data; // "student" or "instructor"
        }
      }
    }
    setOriginalRoles(roles);
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await registerInstructor(
        newInstructor.fullname,
        newInstructor.email,
        newInstructor.password
      );

      if (response.success) {
        toast.success(
          `Instructor ${newInstructor.fullname} added successfully!`
        );
        setShowAddInstructorModal(false);
        setNewInstructor({
          fullname: "",
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
      fullname: instructor.fullname,
      email: instructor.email,
      role: instructor.role,
    });
    setShowEditInstructorModal(true);
  };

  const handleUpdateInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInstructor(editInstructorData.id, {
        fullname: editInstructorData.fullname,
        email: editInstructorData.email,
        role: editInstructorData.role,
      });

      if (response.success) {
        toast.success(
          `Instructor ${editInstructorData.fullname} updated successfully!`
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading admins...</div>
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
                {filteredInstructors.length === 0 ? (
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
                  filteredInstructors.map((instructor) => (
                    <tr key={instructor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
                            <FiUser />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {instructor.fullname}
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newInstructor.fullname}
                    onChange={(e) =>
                      setNewInstructor({
                        ...newInstructor,
                        fullname: e.target.value,
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editInstructorData.fullname}
                    onChange={(e) =>
                      setEditInstructorData({
                        ...editInstructorData,
                        fullname: e.target.value,
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
                      {deleteModalInstructor.fullname}
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
                      {promoteModalAdmin.fullname}
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
                      {demoteModalInstructor.fullname}
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
