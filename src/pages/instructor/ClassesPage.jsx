import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiPlus,
  FiUsers,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiArchive,
} from "react-icons/fi";
import CreateClassModal from "../../components/CreateClassModal";
import EditClassModal from "../../components/EditClassModal";
import ConfirmationModal from "../../components/ConfirmationModal"; // New component

import {
  allClassroomSpecificInstructor,
  hideClassroom
  
} from "../../utils/authService";

import { toast } from "react-toastify";

const ClassesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false); // New state
  const [classData, setClassData] = useState(null);
  const [Classes, setClasses] = useState([]);
  const [classToArchive, setClassToArchive] = useState(null); // New state
  const instructorId = localStorage.getItem("userId");
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const result = await allClassroomSpecificInstructor(instructorId);
      if (result.success) {
        setClasses(result.data.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      const response = await hideClassroom(id);
      if (response.success) {
        setClasses(Classes.filter((cls) => cls._id !== id));
        toast.success("Class archived successfully");
        setShowArchiveModal(false);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error archiving class:", error);
      toast.error("Failed to archive class");
    }
  };

  const handleClassUpdate = (updatedClass) => {
    setClasses(
      Classes.map((cls) => (cls._id === updatedClass._id ? updatedClass : cls))
    );
  };

  const openArchiveConfirmation = (cls) => {
    setClassToArchive(cls);
    setShowArchiveModal(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" /> Create Class
        </button>
      </div>

      <div className="py-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {cls.classroom_name}
                      </h3>
                      <p className="text-gray-600">{cls.subject_code}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setShowEditClassModal(true);
                          setClassData(cls);
                        }}
                        className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => openArchiveConfirmation(cls)}
                        className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                        title="Archive"
                      >
                        <FiArchive />
                      </button>
                      {/*      <button
                        onClick={() => handleDelete(cls._id)}
                        className="cursor-pointer text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button> */}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">{cls.description}</span>
                  </div>

                  <div className="flex justify-between">
                    <Link
                      to={`/instructor/class/${cls._id}`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      View Class
                    </Link>
                    <Link
                      to={`/instructor/class/${cls._id}/students`}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Manage Students
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onClassCreated={() => {
            setShowCreateModal(false);
            fetchClasses();
          }}
        />
      )}

      {showEditClassModal && classData && (
        <EditClassModal
          showEditClassModal={showEditClassModal}
          setShowEditClassModal={setShowEditClassModal}
          data={classData}
          onUpdate={handleClassUpdate}
        />
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && classToArchive && (
        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          onConfirm={() => handleArchive(classToArchive._id)}
          title="Archive Classroom"
          message={`Are you sure you want to archive "${classToArchive.classroom_name}"?`}
          confirmText="Archive"
          confirmColor="yellow"
        />
      )}
    </>
  );
};

export default ClassesPage;
