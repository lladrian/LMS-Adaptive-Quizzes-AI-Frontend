import React, { useState } from "react";
import { FiArrowLeft, FiUsers } from "react-icons/fi";
import { addClassroom } from "../utils/authService";
import { toast } from "react-toastify";

const CreateClassModal = ({ onClose, onClassCreated }) => {
  const instructorId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    instructor: instructorId,
    classroom_name: "",
    subject_code: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateClassCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate random classroom code
      const classroom_code = generateClassCode();

      // Combine form data with generated code
      const classData = {
        ...formData,
        classroom_code,
      };

      const response = await addClassroom(
        classData.classroom_name,
        classData.subject_code,
        classData.instructor,
        classData.classroom_code,
        classData.description
      );

      if (response.success) {
        toast.success(
          `Class "${classData.classroom_name}" created successfully!`
        );
        onClassCreated(response.data);
        onClose();
      } else {
        toast.error(response.error || "Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create class. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <div className="flex items-center mb-6">
          <button
            onClick={onClose}
            className="p-2 mr-4 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <FiArrowLeft />
          </button>
          <h2 className="text-xl font-semibold">Create New Class</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                name="classroom_name"
                value={formData.classroom_name}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                name="subject_code"
                value={formData.subject_code}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
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
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
