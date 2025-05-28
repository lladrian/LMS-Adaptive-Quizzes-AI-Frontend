import React, { useState } from "react";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { deleteMaterial } from "../utils/authService";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  material,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteMaterial(material._id);
      if (response.success) {
        toast.success("Material deleted successfully");
        onDeleteSuccess();
        onClose();
      } else {
        toast.error(response.error || "Failed to delete material");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the material");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiAlertTriangle className="text-red-500 mr-2" />
              Confirm Deletion
            </h3>
            <button
              onClick={onClose}
              className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete this material?
            </p>
            <p className="font-medium mt-2">{material.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className=" cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
