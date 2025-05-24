import React, { useState } from "react";
import { FiUpload, FiFileText, FiX, FiPlus } from "react-icons/fi";

const UploadMaterialModal = ({ classId, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    filePreview: null,
    fileType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }

      const validTypes = [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "txt",
      ];
      const fileType = file.name.split(".").pop().toLowerCase();

      if (!validTypes.includes(fileType)) {
        setError("Unsupported file type");
        return;
      }

      setError(null);
      const fileTypeForDisplay = fileType === "jpeg" ? "jpg" : fileType;
      setFormData((prev) => ({
        ...prev,
        file,
        fileType: fileTypeForDisplay,
        filePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeFile = () => {
    if (formData.filePreview) {
      URL.revokeObjectURL(formData.filePreview);
    }
    setFormData((prev) => ({
      ...prev,
      file: null,
      filePreview: null,
      fileType: "",
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Material uploaded:", formData);
      onUploadSuccess();
      onClose();
    } catch (err) {
      setError("Failed to upload material. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIconColor = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "bg-red-100 text-red-600";
      case "ppt":
      case "pptx":
        return "bg-orange-100 text-orange-600";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-600";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Upload Class Material
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                placeholder="Enter material title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of the material"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File *
              </label>
              {formData.file ? (
                <div className="mt-1 flex items-center justify-between p-3 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg mr-3 ${getFileIconColor(
                        formData.fileType
                      )}`}
                    >
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {formData.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formData.fileType.toUpperCase()} •{" "}
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Remove file"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          required
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PPT, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              )}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={!formData.file || isSubmitting}
              >
                {isSubmitting ? (
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
                    Uploading...
                  </>
                ) : (
                  "Upload Material"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterialModal;
