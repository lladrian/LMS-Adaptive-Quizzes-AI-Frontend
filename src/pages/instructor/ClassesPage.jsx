import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiPlus,
  FiUsers,
  FiFileText,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import CreateClassModal from "../../components/CreateClassModal";
import EditClassModal from "../../components/EditClassModal";

const ClassesPage = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Advanced Programming",
      code: "CS401",
      description: "Advanced concepts in programming",
      students: 24,
      materials: 5,
      maxStudents: 30,
      status: "active",
    },
    {
      id: 2,
      name: "Data Structures",
      code: "CS301",
      description: "Fundamentals of data structures",
      students: 18,
      materials: 3,
      maxStudents: 25,
      status: "active",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showEditClassModal, setShowEditClassModal] = useState(false);

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {cls.name}
                    </h3>
                    <p className="text-gray-600">{cls.code}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowEditClassModal(true)}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-4 mb-4">
                  <span className="flex items-center">
                    <FiUsers className="mr-1" /> {cls.students} students
                  </span>
                  <span className="flex items-center">
                    <FiFileText className="mr-1" /> {cls.materials} materials
                  </span>
                </div>

                <div className="flex justify-between">
                  <Link
                    to={`/instructor/class/${cls.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    View Class
                  </Link>
                  <Link
                    to={`/instructor/class/${cls.id}/students`}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Manage Students
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateClassModal onClose={() => setShowCreateModal(false)} />
      )}
      {showEditClassModal && (
        /*  <EditClassModal
          classData={editingClass}
          onClose={() => setEditingClass(null)}
          onSave={handleUpdateClass}
 */

        <EditClassModal
          showEditClassModal={showEditClassModal}
          setShowEditClassModal={setShowEditClassModal}
          classId="123" // pass the class ID as needed
        />
      )}
    </>
  );
};

export default ClassesPage;
