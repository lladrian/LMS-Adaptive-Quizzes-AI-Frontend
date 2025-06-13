import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { updateClassroom } from "../utils/authService";
import { toast } from "react-toastify";

const EditClassModal = ({
  showEditClassModal,
  setShowEditClassModal,
  data,
  onUpdate,
}) => {
  // List of programming languages
  // const programmingLanguages = [
  //   { value: "python", label: "Python" },
  //   { value: "javascript", label: "JavaScript" },
  //   { value: "java", label: "Java" },
  //   { value: "c", label: "C" },
  //   { value: "cpp", label: "C++" },
  //   { value: "csharp", label: "C#" },
  //   { value: "php", label: "PHP" },
  //   { value: "ruby", label: "Ruby" },
  //   { value: "swift", label: "Swift" },
  //   { value: "kotlin", label: "Kotlin" },
  //   { value: "go", label: "Go" },
  //   { value: "rust", label: "Rust" },
  //   { value: "typescript", label: "TypeScript" },
  //   { value: "r", label: "R" },
  //   { value: "scala", label: "Scala" },
  //   { value: "other", label: "Other" },
  // ];

  const programmingLanguages = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    programming_language: "",
    grading_system: {
      activity: "",
      quiz: "",
      midterm: "",
      final: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showEditClassModal && data) {
      setFormData({
        name: data.classroom_name || "",
        code: data.subject_code || "",
        description: data.description || "",
        programming_language: data.programming_language || "",
        grading_system: data.grading_system || {
          activity: "",
          quiz: "",
          midterm: "",
          final: "",
        },
      });
    }
  }, [showEditClassModal, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      grading_system: {
        ...prev.grading_system,
        [name]: value,
      },
    }));
  };

  const validateGradingSystem = () => {
    const { activity, quiz, midterm, final } = formData.grading_system;
    const total =
      Number(activity) + Number(quiz) + Number(midterm) + Number(final);
    return total === 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting || !data?._id) return;

    // Validate grading system totals to 100%
    if (!validateGradingSystem()) {
      toast.error("Grading system components must total 100%");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateClassroom(
        data._id,
        formData.name,
        formData.code,
        formData.description,
        formData.programming_language,
        formData.grading_system
      );

      if (!response) {
        throw new Error("No response from server");
      }

      if (response.success) {
        toast.dismiss();
        toast.success(`Class ${formData.name} updated successfully!`);

        const updatedClass = {
          ...data,
          classroom_name: formData.name,
          description: formData.description,
          subject_code: formData.code,
          programming_language: formData.programming_language,
          grading_system: formData.grading_system,
        };

        onUpdate?.(updatedClass);
        setShowEditClassModal(false);
        return;
      }

      throw new Error(response.error || "Failed to update class");
    } catch (error) {
      console.error("Update error:", error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update class. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showEditClassModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => setShowEditClassModal(false)}
            className="p-2 mr-4 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <FiArrowLeft />
          </button>
          <h2 className="text-xl font-semibold">Edit Class</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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
                Subject Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programming Language
              </label>
              <select
                name="programming_language"
                value={formData.programming_language}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              >
                {programmingLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
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

            {/* Grading System Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Grading System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity (%)
                  </label>
                  <input
                    type="number"
                    name="activity"
                    value={formData.grading_system.activity}
                    onChange={handleGradingChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz (%)
                  </label>
                  <input
                    type="number"
                    name="quiz"
                    value={formData.grading_system.quiz}
                    onChange={handleGradingChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Midterm (%)
                  </label>
                  <input
                    type="number"
                    name="midterm"
                    value={formData.grading_system.midterm}
                    onChange={handleGradingChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final (%)
                  </label>
                  <input
                    type="number"
                    name="final"
                    value={formData.grading_system.final}
                    onChange={handleGradingChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Total:{" "}
                {Number(formData.grading_system.activity || 0) +
                  Number(formData.grading_system.quiz || 0) +
                  Number(formData.grading_system.midterm || 0) +
                  Number(formData.grading_system.final || 0)}
                %
              </div>
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
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
