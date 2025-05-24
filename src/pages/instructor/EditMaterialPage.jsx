import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiFileText, FiX, FiArrowLeft } from 'react-icons/fi';

const EditMaterialPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    filePreview: null,
    fileType: '',
    class: ''
  });

  useEffect(() => {
    // Fetch material data
    const fetchMaterial = async () => {
      // Simulated API call
      const mockMaterial = {
        id: id,
        title: 'Algorithm Complexity Lecture',
        description: 'Lecture notes on algorithm complexity analysis',
        class: 'CS401',
        file: {
          name: 'algorithm_complexity.pdf',
          type: 'pdf',
          size: '2.4 MB'
        }
      };
      
      setFormData({
        title: mockMaterial.title,
        description: mockMaterial.description,
        class: mockMaterial.class,
        file: mockMaterial.file,
        filePreview: '/placeholder-file-icon.png',
        fileType: mockMaterial.file.type
      });
    };
    fetchMaterial();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[1] || file.name.split('.').pop();
      setFormData(prev => ({
        ...prev,
        file,
        fileType,
        filePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      filePreview: null,
      fileType: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Material updated:', formData);
    navigate('/instructor/materials');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-4 rounded-lg hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-xl font-semibold">Edit Material</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a class</option>
              <option value="CS401">CS401 - Advanced Programming</option>
              <option value="CS301">CS301 - Data Structures</option>
              <option value="MATH101">MATH101 - Calculus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            {formData.file ? (
              <div className="mt-1 flex items-center justify-between p-3 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    formData.fileType.match(/(pdf|doc|docx)/) 
                      ? 'bg-red-100 text-red-600' 
                      : formData.fileType.match(/(ppt|pptx)/) 
                        ? 'bg-orange-100 text-orange-600' 
                        : formData.fileType.match(/(jpg|jpeg|png|gif)/) 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FiFileText />
                  </div>
                  <div>
                    <p className="font-medium">{formData.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {typeof formData.file === 'object' 
                        ? `${formData.fileType.toUpperCase()} • ${(formData.file.size / 1024 / 1024).toFixed(2)} MB`
                        : formData.file.size}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PPT, DOCX, JPG up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterialPage;