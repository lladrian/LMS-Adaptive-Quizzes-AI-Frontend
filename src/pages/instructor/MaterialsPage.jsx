import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Algebra Basics",
      type: "PDF",
      date: "2023-05-15",
      downloads: 24,
    },
    {
      id: 2,
      title: "Chemistry Lab",
      type: "Video",
      date: "2023-05-10",
      downloads: 18,
    },
  ]);

  const handleDelete = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <div
          key={material.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                {material.title}
              </h3>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-800">
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-3">
                {material.type}
              </span>
              <span>Uploaded: {material.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {material.downloads} downloads
              </span>
              <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <FiDownload className="mr-1" /> Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialsPage;
