import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
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

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    programming_language: "",
    grading_system: {
      midterm: { components: {} },
      final: { components: {} },
    },
  });

  const [newComponentName, setNewComponentName] = useState({
    midterm: "",
    final: "",
  });
  const [selectedComponents, setSelectedComponents] = useState({
    midterm: [],
    final: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showEditClassModal && data) {
      const normalizeGradingSystem = (gradingData) => {
        if (!gradingData) {
          return {
            midterm: { components: {} },
            final: { components: {} },
          };
        }

        const normalized = {
          midterm: gradingData.midterm || { components: {} },
          final: gradingData.final || { components: {} },
        };

        ["midterm", "final"].forEach((term) => {
          if (!normalized[term].components) {
            const { quiz, exam, activity, assignment, ...rest } =
              normalized[term];
            normalized[term] = {
              components: {
                ...(quiz !== undefined && { quiz }),
                ...(exam !== undefined && { exam }),
                ...(activity !== undefined && { activity }),
                ...(assignment !== undefined && { assignment }),
                ...rest,
              },
            };
          }
        });

        return normalized;
      };

      setFormData({
        name: data.classroom_name || "",
        code: data.subject_code || "",
        description: data.description || "",
        programming_language: data.programming_language || "",
        grading_system: normalizeGradingSystem(data.grading_system),
      });

      // Initialize selected components as empty arrays
      setSelectedComponents({
        midterm: [],
        final: [],
      });
    }
  }, [showEditClassModal, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradingChange = (e, term, componentName) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      grading_system: {
        ...prev.grading_system,
        [term]: {
          ...prev.grading_system[term],
          components: {
            ...prev.grading_system[term].components,
            [componentName]: Number(value),
          },
        },
      },
    }));
  };

  const validateGradingSystem = (term) => {
    const components = formData.grading_system[term]?.components || {};
    const total = Object.values(components).reduce(
      (sum, value) => sum + Number(value),
      0
    );
    return total === 100;
  };

  const addComponent = (term) => {
    const componentName = newComponentName[term]
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (!componentName) {
      toast.error("Please enter a component name");
      return;
    }

    setFormData((prev) => {
      const existingComponents = prev.grading_system[term]?.components || {};

      if (existingComponents[componentName]) {
        toast.error("Component already exists");
        return prev;
      }

      return {
        ...prev,
        grading_system: {
          ...prev.grading_system,
          [term]: {
            ...prev.grading_system[term],
            components: {
              ...existingComponents,
              [componentName]: 0,
            },
          },
        },
      };
    });

    setNewComponentName((prev) => ({ ...prev, [term]: "" }));
  };

  const toggleComponentSelection = (term, componentName) => {
    setSelectedComponents((prev) => {
      const currentSelection = [...prev[term]];
      const index = currentSelection.indexOf(componentName);

      if (index === -1) {
        currentSelection.push(componentName);
      } else {
        currentSelection.splice(index, 1);
      }

      return {
        ...prev,
        [term]: currentSelection,
      };
    });
  };

  const removeSelectedComponents = (term) => {
    if (selectedComponents[term].length === 0) {
      toast.error("No components selected for removal");
      return;
    }

    setFormData((prev) => {
      const components = { ...prev.grading_system[term].components };
      selectedComponents[term].forEach((component) => {
        delete components[component];
      });

      return {
        ...prev,
        grading_system: {
          ...prev.grading_system,
          [term]: {
            ...prev.grading_system[term],
            components,
          },
        },
      };
    });

    // Clear selection after removal
    setSelectedComponents((prev) => ({
      ...prev,
      [term]: [],
    }));
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
    const components = formData.grading_system[term]?.components || {};
    return Object.values(components).reduce(
      (sum, value) => sum + Number(value),
      0
    );
  };

  const renderGradingInputs = (term) => {
    const components = formData.grading_system[term]?.components || {};
    const componentEntries = Object.entries(components);

    return (
      <div className="space-y-3">
        {componentEntries.length > 0 ? (
          <div className="space-y-2">
            {componentEntries.map(([name, value]) => (
              <div key={`${term}-${name}`} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedComponents[term].includes(name)}
                  onChange={() => toggleComponentSelection(term, name)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                    {name.replace(/_/g, " ")} (%)
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleGradingChange(e, term, name)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeSelectedComponents(term)}
              className="mt-2 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
              disabled={selectedComponents[term].length === 0 || isSubmitting}
            >
              <FiTrash2 size={14} />
              Remove Selected
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No components added yet</p>
        )}

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newComponentName[term]}
            onChange={(e) =>
              setNewComponentName({
                ...newComponentName,
                [term]: e.target.value,
              })
            }
            placeholder="New component name"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => addComponent(term)}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
            disabled={isSubmitting}
          >
            <FiPlus size={16} />
            Add
          </button>
        </div>
      </div>
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
                    <div
                      className={`text-sm ${
                        calculateTermTotal("midterm") === 100
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Total: {calculateTermTotal("midterm")}%
                      {calculateTermTotal("midterm") !== 100 &&
                        " (Must total 100%)"}
                    </div>
                  </div>
                  {renderGradingInputs("midterm")}
                </div>

                {/* Final Grading */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">Final</h4>
                    <div
                      className={`text-sm ${
                        calculateTermTotal("final") === 100
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Total: {calculateTermTotal("final")}%
                      {calculateTermTotal("final") !== 100 &&
                        " (Must total 100%)"}
                    </div>
                  </div>
                  {renderGradingInputs("final")}
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
                disabled={
                  isSubmitting ||
                  calculateTermTotal("midterm") !== 100 ||
                  calculateTermTotal("final") !== 100
                }
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
