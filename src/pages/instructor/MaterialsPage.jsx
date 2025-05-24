import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiPlus,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Algorithm Complexity",
      type: "PDF",
      class: "CS401",
      date: "2023-05-01",
      downloads: 24,
    },
    {
      id: 2,
      title: "Data Structures Review",
      type: "Slides",
      class: "CS301",
      date: "2023-05-08",
      downloads: 18,
    },
  ]);

  const handleDelete = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Lesson Materials
        </h2>
        <Link
          to="/instructor/materials/upload"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" /> Upload Material
        </Link>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Classes</option>
              <option>CS401</option>
              <option>CS301</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{material.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2">
                        {material.type}
                      </span>
                      <span>{material.class}</span>
                      <span className="mx-2">•</span>
                      <span>Posted: {material.date}</span>
                      <span className="mx-2">•</span>
                      <span>{material.downloads} downloads</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <FiDownload />
                    </button>
                    <Link
                      to={`/instructor/materials/edit/${material.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialsPage;
