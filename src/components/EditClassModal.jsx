import React, { useState, useEffect } from "react";
import { FiUsers, FiArrowLeft } from "react-icons/fi";
import { updateClassroom } from "../utils/authService";
import { toast } from "react-toastify";

const EditClassModal = ({
  showEditClassModal,
  setShowEditClassModal,
  data,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showEditClassModal && data) {
      setFormData({
        name: data.classroom_name,
        code: data.classroom_code,
        description: data.description,
      });
    }
  }, [showEditClassModal, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Make sure to prevent default form submission
    e.stopPropagation(); // Stop event bubbling

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    try {
      const response = await updateClassroom(
        data._id,
        formData.name,
        formData.code,
        formData.description
      );

      if (response.success) {
        toast.success(`Class ${formData.name} updated successfully!`);

        const updatedClass = {
          ...data,
          classroom_name: formData.name,
          classroom_code: formData.code,
          description: formData.description,
        };

        if (onUpdate) {
          onUpdate(updatedClass);
        }

        setShowEditClassModal(false);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update class. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setShowEditClassModal(false)}
            className="p-2 mr-4 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <FiArrowLeft />
          </button>
          <h2 className="text-xl font-semibold">Edit Class</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEditClassModal(false)}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {/*   <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button> */}
            <button
              type="submit" // Make sure this is explicitly set
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassModal;
