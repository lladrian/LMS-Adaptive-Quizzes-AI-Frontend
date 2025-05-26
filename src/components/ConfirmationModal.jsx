import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "indigo",
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    red: "bg-red-600 hover:bg-red-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer px-4 py-2 text-white rounded-lg ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
