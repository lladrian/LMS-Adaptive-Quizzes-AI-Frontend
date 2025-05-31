import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Are you sure you want to leave the classroom?</h2>
                <div className="flex justify-end">
                    <button 
                        className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg mr-2 hover:bg-red-600 transition duration-300"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button 
                        className="bg-gray-300 text-black font-semibold py-1 px-3 rounded-lg hover:bg-gray-400 transition duration-300"
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
