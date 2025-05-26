import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiBook,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiPlus,
  FiDownload,
  FiEdit2,
} from "react-icons/fi";
import UploadMaterialModal from "../../components/UploadMaterialModal";
import EditClassModal from "../../components/EditClassModal";

import { updateClassroom, specificClassroom } from "../../utils/authService";
import { toast } from "react-toastify";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [classData, setClassData] = useState(null);

  // Sample data
  /*  const classData = {
    id: classId,
    name: "Advanced Programming",
    code: "CS401",
    description:
      "Advanced concepts in programming including algorithms, data structures and system design",
    students: 24,
    materials: 5,
    assignments: 3,
  };
 */

  const students = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active" },
  ];

  const materials = [
    {
      id: 1,
      title: "Algorithm Complexity",
      type: "lecture",
      date: "2023-05-01",
    },
    {
      id: 2,
      title: "Data Structures Review",
      type: "slides",
      date: "2023-05-08",
    },
  ];

  const assignments = [
    {
      id: 1,
      title: "Sorting Algorithms",
      type: "quiz",
      due: "2023-05-10",
      submissions: 18,
      graded: 15,
    },
    {
      id: 2,
      title: "Final Project",
      type: "project",
      due: "2023-06-01",
      submissions: 10,
      graded: 2,
    },
  ];

  const [ClassroomData, setClassroomData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const result = await specificClassroom(classId);
      if (result.success) {
        setClassroomData(result.data.data);
        console.log(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching Instructor:", error);
      toast.error("Failed to fetch Instructor");
    } finally {
      setIsLoading(false);
    }
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);

  const [refreshMaterials, setRefreshMaterials] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshMaterials((prev) => !prev); // Toggle to trigger refresh
  };

  const handleClassUpdate = useCallback((updatedClass) => {
    setClassroomData((prev) => ({
      ...prev,
      classroom: {
        ...prev.classroom,
        ...updatedClass,
      },
    }));
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {ClassroomData.classroom?.classroom_name} (
            {ClassroomData.classroom?.subject_code})
          </h1>
          <p class="mt-1">
            Class code: {ClassroomData.classroom?.classroom_code}
          </p>
        </div>

        <button
          /*         onClick={() => setShowEditClassModal(true)} */
          onClick={() => {
            setShowEditClassModal(true);
            setClassData(ClassroomData.classroom);
          }}
          className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <FiEdit2 className="mr-2" /> Edit Class
        </button>
      </div>
      <div className="py-4">
        {/* Class Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium ${
                activeTab === "overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 font-medium ${
                activeTab === "students"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className={`px-6 py-3 font-medium ${
                activeTab === "materials"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-6 py-3 font-medium ${
                activeTab === "assignments"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Assignments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Class Information</h3>
              <p className="text-gray-700 mb-4">
                {ClassroomData.classroom?.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiUsers className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData.students?.length <= 1
                        ? `${ClassroomData.students?.length} Student`
                        : `${ClassroomData.students?.length} Students`}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData.materials?.length <= 1
                        ? `${ClassroomData.materials?.length} Material`
                        : `${ClassroomData.materials?.length} Materials`}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiBarChart2 className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {(() => {
                        const total =
                          (ClassroomData.quizzes?.length || 0) +
                          (ClassroomData.exams?.length || 0);
                        return `${total} ${
                          total <= 1 ? "Assignment" : "Assignments"
                        }`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Students</h3>
              <Link
                to={`/instructor/class/${classId}/students/add`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="mr-2" /> Add Students
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ClassroomData.students?.length > 0 ? (
                    ClassroomData.students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.fullname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              bg-green-100 text-green-800
            `}
                          >
                            active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/instructor/students/edit/${student.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No students in this classroom
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Materials</h3>
              {/*            <Link
                to={`/instructor/class/${classId}/materials/upload`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="mr-2" /> Upload Material
              </Link> */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="mr-2" /> Upload Material
              </button>
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
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                          {material.type}
                        </span>
                        <span>Posted: {material.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <FiDownload />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <FiEdit2 />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showUploadModal && (
              <UploadMaterialModal
                classId={classId}
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Assignments</h3>
              <div className="flex space-x-3">
                <Link
                  to={`/instructor/class/${classId}/assignments/create`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                >
                  <FiPlus className="mr-2" /> New Assignment
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                          {assignment.type}
                        </span>
                        <span>Due: {assignment.due}</span>
                        <span className="mx-2">•</span>
                        <span>{assignment.submissions} submissions</span>
                        <span className="mx-2">•</span>
                        <span>{assignment.graded} graded</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/instructor/class/${classId}/assignment/${assignment.id}`}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </>
  );
};

export default ClassDetailPage;
