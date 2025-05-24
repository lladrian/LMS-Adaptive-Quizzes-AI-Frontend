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

const ClassesPage = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Advanced Programming",
      code: "CS401",
      students: 24,
      materials: 5,
    },
    {
      id: 2,
      name: "Data Structures",
      code: "CS301",
      students: 18,
      materials: 3,
    },
  ]);

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Class Management
        </h2>
        <Link
          to="/instructor/classes/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" /> Create Class
        </Link>
      </header>

      <div className="p-6">
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
                    <Link
                      to={`/instructor/classes/edit/${cls.id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-600 hover:text-red-800"
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
    </>
  );
};

export default ClassesPage;
