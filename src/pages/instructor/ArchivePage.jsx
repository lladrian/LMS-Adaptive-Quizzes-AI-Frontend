import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiUsers,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiRotateCcw,
} from "react-icons/fi";
import EditClassModal from "../../components/EditClassModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  allClassroomSpecificInstructor,
  unHideClassroom,
} from "../../utils/authService";
import { toast } from "react-toastify";

const ArchivePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [classData, setClassData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classToUnarchive, setClassToUnarchive] = useState(null);
  const instructorId = localStorage.getItem("userId");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const result = await allClassroomSpecificInstructor(instructorId);
      console.log(result);
      if (result.success) {
       

        setClasses(result.data?.data.hidden_classrooms);
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

  const handleUnarchive = async (id) => {
    try {
      const response = await unHideClassroom(id);
      if (response.success) {
        setClasses(classes.filter((cls) => cls._id !== id));
        toast.success("Class unarchived successfully");
        setShowUnarchiveModal(false);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error unarchiving class:", error);
      toast.error("Failed to unarchive class");
    }
  };

  const handleClassUpdate = (updatedClass) => {
    setClasses(
      classes.map((cls) => (cls._id === updatedClass._id ? updatedClass : cls))
    );
  };

  const openUnarchiveConfirmation = (cls) => {
    setClassToUnarchive(cls);
    setShowUnarchiveModal(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Archived Classes</h1>
      </div>

      <div className="py-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No archived classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
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
                        onClick={() => openUnarchiveConfirmation(cls)}
                        className="cursor-pointer text-green-600 hover:text-green-800"
                        title="Restore"
                      >
                        <FiRotateCcw />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">{cls.description}</span>
                  </div>

                  <div className="w-full">
                    <Link
                      to={`/instructor/class/${cls._id}`}
                      className="block w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm text-center"
                    >
                      View Class
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditClassModal && classData && (
        <EditClassModal
          showEditClassModal={showEditClassModal}
          setShowEditClassModal={setShowEditClassModal}
          data={classData}
          onUpdate={handleClassUpdate}
        />
      )}

      {/* Unarchive Confirmation Modal */}
      {showUnarchiveModal && classToUnarchive && (
        <ConfirmationModal
          isOpen={showUnarchiveModal}
          onClose={() => setShowUnarchiveModal(false)}
          onConfirm={() => handleUnarchive(classToUnarchive._id)}
          title="Restore Classroom"
          message={`Are you sure you want to restore "${classToUnarchive.classroom_name}"?`}
          confirmText="Restore"
          confirmColor="green"
        />
      )}
    </>
  );
};

export default ArchivePage;
