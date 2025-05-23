import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";

const ClassesPage = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "Math 101", students: 24, materials: 5 },
    { id: 2, name: "Science 202", students: 18, materials: 3 },
  ]);

  const handleDelete = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <div
          key={cls.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {cls.name}
            </h3>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <FiUsers className="mr-1" /> {cls.students} students
              </span>
              <span>{cls.materials} materials</span>
            </div>
            <div className="flex justify-between">
              <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                <a href="/instructor/classes/1">View Class</a>
              </button>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassesPage;
