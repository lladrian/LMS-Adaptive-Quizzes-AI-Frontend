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
  const programmingLanguages = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];

  const gradingComponents = [
    { id: "quiz", label: "Quiz" },
    { id: "exam", label: "Exam" },
    { id: "activity", label: "Activity" },
    { id: "assignment", label: "Assignment" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    programming_language: "",
    grading_system: {
      midterm: {
        components: ["quiz", "exam", "activity", "assignment"],
        weights: {
          quiz: 15,
          exam: 50,
          activity: 20,
          assignment: 15,
        },
      },
      final: {
        components: ["quiz", "exam", "activity", "assignment"],
        weights: {
          quiz: 20,
          exam: 60,
          activity: 10,
          assignment: 10,
        },
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showEditClassModal && data) {
      // Convert old format to new format if needed
      const gradingSystem = data.grading_system || {
        midterm: {
          quiz: 15,
          exam: 50,
          activity: 20,
          assignment: 15,
        },
        final: {
          quiz: 20,
          exam: 60,
          activity: 10,
          assignment: 10,
        },
      };

      // Check if grading system is in old format (without components array)
      const isOldFormat = !gradingSystem.midterm.components;

      const convertedGradingSystem = isOldFormat
        ? {
            midterm: {
              components: ["quiz", "exam", "activity", "assignment"],
              weights: gradingSystem.midterm,
            },
            final: {
              components: ["quiz", "exam", "activity", "assignment"],
              weights: gradingSystem.final,
            },
          }
        : gradingSystem;

      setFormData({
        name: data.classroom_name || "",
        code: data.subject_code || "",
        description: data.description || "",
        programming_language: data.programming_language || "",
        grading_system: convertedGradingSystem,
      });
    }
  }, [showEditClassModal, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradingChange = (e) => {
    const { name, value } = e.target;
    const [term, field] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      grading_system: {
        ...prev.grading_system,
        [term]: {
          ...prev.grading_system[term],
          weights: {
            ...prev.grading_system[term].weights,
            [field]: Number(value),
          },
        },
      },
    }));
  };

  const toggleGradingComponent = (term, component) => {
    setFormData((prev) => {
      const currentComponents = prev.grading_system[term].components;
      const newComponents = currentComponents.includes(component)
        ? currentComponents.filter((c) => c !== component)
        : [...currentComponents, component];

      return {
        ...prev,
        grading_system: {
          ...prev.grading_system,
          [term]: {
            ...prev.grading_system[term],
            components: newComponents,
          },
        },
      };
    });
  };

  const validateGradingSystem = (term) => {
    const { components, weights } = formData.grading_system[term];
    const total = components.reduce(
      (sum, component) => sum + (weights[component] || 0),
      0
    );
    return total === 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting || !data?._id) return;

    if (!validateGradingSystem("midterm")) {
      toast.error("Midterm grading components must total 100%");
      return;
    }

    if (!validateGradingSystem("final")) {
      toast.error("Final grading components must total 100%");
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

      if (!response) throw new Error("No response from server");

      if (response.success) {
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
      } else {
        throw new Error(response.error || "Failed to update class");
      }
    } catch (error) {
      console.error("Update error:", error);
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

  const calculateTermTotal = (term) => {
    const { components, weights } = formData.grading_system[term];
    return components.reduce(
      (sum, component) => sum + (weights[component] || 0),
      0
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center">
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
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Programming Language
                </label>
                <select
                  name="programming_language"
                  value={formData.programming_language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Grading System Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Grading System
                </h3>

                {/* Midterm Grading */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">
                      Midterm
                    </h4>
                    <div className="flex space-x-2">
                      {gradingComponents.map((component) => (
                        <label
                          key={`midterm-${component.id}`}
                          className="flex items-center space-x-1 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.grading_system.midterm.components.includes(
                              component.id
                            )}
                            onChange={() =>
                              toggleGradingComponent("midterm", component.id)
                            }
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            disabled={isSubmitting}
                          />
                          <span>{component.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {gradingComponents.map(
                      (component) =>
                        formData.grading_system.midterm.components.includes(
                          component.id
                        ) && (
                          <div key={`midterm-input-${component.id}`}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {component.label} (%)
                            </label>
                            <input
                              type="number"
                              name={`midterm.${component.id}`}
                              value={
                                formData.grading_system.midterm.weights[
                                  component.id
                                ] || 0
                              }
                              onChange={handleGradingChange}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                              min="0"
                              max="100"
                              disabled={isSubmitting}
                            />
                          </div>
                        )
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Total: {calculateTermTotal("midterm")}%
                  </div>
                </div>

                {/* Final Grading */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">Final</h4>
                    <div className="flex space-x-2">
                      {gradingComponents.map((component) => (
                        <label
                          key={`final-${component.id}`}
                          className="flex items-center space-x-1 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.grading_system.final.components.includes(
                              component.id
                            )}
                            onChange={() =>
                              toggleGradingComponent("final", component.id)
                            }
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            disabled={isSubmitting}
                          />
                          <span>{component.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {gradingComponents.map(
                      (component) =>
                        formData.grading_system.final.components.includes(
                          component.id
                        ) && (
                          <div key={`final-input-${component.id}`}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {component.label} (%)
                            </label>
                            <input
                              type="number"
                              name={`final.${component.id}`}
                              value={
                                formData.grading_system.final.weights[
                                  component.id
                                ] || 0
                              }
                              onChange={handleGradingChange}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                              min="0"
                              max="100"
                              disabled={isSubmitting}
                            />
                          </div>
                        )
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Total: {calculateTermTotal("final")}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditClassModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClassModal;
