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
} from "react-icons/fi";
import {
  getAllInstructors,
  registerInstructor,
  updateInstructor,
  deleteInstructor,
  promoteUser,
} from "../../utils/authService";
import { toast } from "react-toastify";
const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
  const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);
  const [deleteModalInstructor, setDeleteModalInstructor] = useState(null);
  const [promoteModalAdmin, setPromoteModalAdmin] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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

  const [Instructor, setInstructor] = useState([]);

  useEffect(() => {
    fetchInstructor();
  }, [setEditInstructorData]);

  const fetchInstructor = async () => {
    setIsLoading(true);
    try {
      const result = await getAllInstructors();
      if (result.success) {
        setInstructor(result.data.data);
        console.log(Instructor);
      }
    } catch (error) {
      console.error("Error fetching Instructor:", error);
      toast.error("Failed to fetch Instructor");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInstructors = Instructor.filter(
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
        await fetchInstructor();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error adding Instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add Instructor. Please try again."
      );
    }
  };

  const handleEditInstructor = (Instructor) => {
    setEditInstructorData({
      id: Instructor._id,
      fullname: Instructor.fullname,
      email: Instructor.email,
      role: Instructor.role,
    });
    console.log(editInstructorData.id);
    setShowEditInstructorModal(true);
  };

  const handleUpdateInstructor = async (e) => {
    console.log(editInstructorData.id);
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
        await fetchInstructor();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error updating Instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update Instructor. Please try again."
      );
    }
  };

  const handleDeleteInstructor = async (InstructorId) => {
    try {
      const response = await deleteInstructor(InstructorId);

      if (response.success) {
        toast.success("Instructor deleted successfully!");
        await fetchInstructor();
      }
    } catch (error) {
      console.error("Error deleting Instructor:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete Instructor. Please try again."
      );
    }
  };

  const handlePromoteAdmin = async (instructorId) => {
    try {
      const response = await promoteUser(instructorId, "admin");

      if (response.success) {
        toast.success("Instructor promoted to admin successfully!");
        await fetchInstructor();
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
                            className="text-indigo-600 hover:text-indigo-900  cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          {instructor.role === "instructor" && (
                            <button
                              onClick={() => setPromoteModalAdmin(instructor)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                              title="Promote to Admin"
                            >
                              <FiArrowUp size={18} />
                            </button>
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
    </div>
  );
};

export default Instructors;
