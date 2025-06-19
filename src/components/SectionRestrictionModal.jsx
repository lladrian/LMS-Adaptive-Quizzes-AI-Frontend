import React, { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { restrictSections } from "../utils/authService";
import { toast } from "react-toastify";

const SectionRestrictionModal = ({
  classroom,
  onClose,
  onUpdate,
  availableSections = [
    "lessons",
    "assignments",
    "grades",
    "practice",
    "students",
    "materials",
    "activities",
  ],
}) => {
  const [selectedSections, setSelectedSections] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with current restricted sections when component mounts
  useEffect(() => {
    if (classroom && classroom.restricted_sections) {
      // Only keep sections that are in availableSections
      const validRestrictedSections = classroom.restricted_sections.filter(
        (section) => availableSections.includes(section)
      );
      setSelectedSections([...validRestrictedSections]);
    }
  }, [classroom, availableSections]);

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSubmit = async () => {
    if (!classroom) return;

    setIsSubmitting(true);
    try {
      const result = await restrictSections(classroom._id, selectedSections);
      if (result.success) {
        toast.success("Sections restriction updated successfully");
        onUpdate(selectedSections);
        onClose();
      } else {
        toast.error(result.error || "Failed to update restrictions");
      }
    } catch (error) {
      console.error("Error updating restrictions:", error);
      toast.error("An error occurred while updating restrictions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Restrict Sections for {classroom?.classroom_name}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Select the sections you want to restrict for this classroom.
            Students won't be able to access restricted sections.
          </p>

          {availableSections.map((section) => (
            <div
              key={section}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedSections.includes(section)
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => toggleSection(section)}
            >
              <span className="capitalize font-medium text-gray-800">
                {section}
              </span>
              {selectedSections.includes(section) ? (
                <FiCheck className="text-red-500" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`cursor-pointer px-4 py-2 rounded-md text-white transition-colors ${
              isSubmitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionRestrictionModal;
