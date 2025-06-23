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
  FiEdit3,
  FiClipboard,
  FiFile,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
} from "react-icons/fi";
import UploadMaterialModal from "../../components/UploadMaterialModal";
import EditClassModal from "../../components/EditClassModal";
import { BASE_URL } from "../../utils/config";
import {
  specificClassroom,
  specificMaterial,
  deleteActivity,
  removeStudentClassroom,
  getAllStudentGradeSpecificClassroom,
  getAllActivitiesSpecificStudentSpecificClassroom,
  updateActivity,
  restrictSections,
} from "../../utils/authService";
import { toast } from "react-toastify";
import CreateAssignmentModal from "../../components/CreateAssignmentModal";
import EditMaterialModal from "../../components/EditMaterialModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActivityDeletionModal from "../../components/ActivityDeletionModal";
import AddStudentsModal from "../../components/AddStudentsModal";
import EditActivityModal from "../../components/EditActivityModal";
import SectionRestrictionModal from "../../components/SectionRestrictionModal";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [classData, setClassData] = useState(null);

  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [showActivityDeletionModal, setShowActivityDeletionModal] =
    useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [ClassroomData, setClassroomData] = useState({
    classroom: {
      classroom_code: "",
      classroom_name: "",
      description: "",
      grading_system: {
        final: { components: {} },
        midterm: { components: {} },
      },
      instructor: {},
      is_hidden: 0,
      programming_language: "",
      restricted_sections: [],
      subject_code: "",
      _id: "",
    },
    main_activity: [],
    materials: [],
    students: [],
    midtermActivities: [],
    finalActivities: [],
  });

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [restrictedSections, setRestrictedSections] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentActivities, setSelectedStudentActivities] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenActivities, setIsModalOpenActivities] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");

  // Activity filtering state
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [gradingBreakdownFilter, setGradingBreakdownFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState({
    students: 1,
    materials: 1,
    activities: 1,
  });
  const itemsPerPage = 5;

  // Calculate pagination for students
  const studentStartIndex = (currentPage.students - 1) * itemsPerPage;
  const studentEndIndex = studentStartIndex + itemsPerPage;
  const currentStudents =
    studentData?.slice(studentStartIndex, studentEndIndex) || [];
  const totalStudentPages = Math.ceil(
    (studentData?.length || 0) / itemsPerPage
  );

  // Calculate pagination for materials
  const materialStartIndex = (currentPage.materials - 1) * itemsPerPage;
  const materialEndIndex = materialStartIndex + itemsPerPage;
  const currentMaterials =
    ClassroomData.materials?.slice(materialStartIndex, materialEndIndex) || [];
  const totalMaterialPages = Math.ceil(
    (ClassroomData.materials?.length || 0) / itemsPerPage
  );

  // Available sections for instructors
  const availableSections = ["lessons", "assignments", "grades", "practice"];

  // Check if a section is restricted
  const isSectionRestricted = (section) => {
    return ClassroomData.classroom?.restricted_sections?.includes(section);
  };

  const calculateActivityPoints = (activity) => {
    if (activity.points !== undefined && activity.points !== null) {
      return activity.points;
    }

    if (Array.isArray(activity.question)) {
      return activity.question.reduce((total, q) => {
        return total + (Number(q.points) || 0);
      }, 0);
    }

    return 0;
  };

  // Combine and sort all activities including assignments
  const getActivitiesByTerm = (term) => {
    const activities = ClassroomData[`${term}Activities`] || [];

    return activities.map((a) => ({
      ...a,
      activityType: a.activity_type,
      term,
    }));
  };

  const midtermActivities = getActivitiesByTerm("midterm");

  const finalActivities = getActivitiesByTerm("final");

  // Get all activities with their types
  const allActivities = [...midtermActivities, ...finalActivities].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Filter activities based on selected filters
  const filteredActivities = allActivities.filter((activity) => {
    const typeMatch =
      activityTypeFilter === "all" ||
      activity.activityType === activityTypeFilter;

    const gradingMatch =
      gradingBreakdownFilter === "all" ||
      activity.grading_breakdown === gradingBreakdownFilter;

    return typeMatch && gradingMatch;
  });

  const uniqueActivityTypes = [
    ...new Set(allActivities.map((a) => a.activityType).filter(Boolean)),
  ];

  // Calculate pagination for activities
  const activityStartIndex = (currentPage.activities - 1) * itemsPerPage;
  const activityEndIndex = activityStartIndex + itemsPerPage;
  const currentActivitiesPaginated = filteredActivities.slice(
    activityStartIndex,
    activityEndIndex
  );
  const totalActivityPages = Math.ceil(
    filteredActivities.length / itemsPerPage
  );

  // Get unique grading breakdowns for filter options
  const uniqueGradingBreakdowns = [
    ...new Set(allActivities.map((a) => a.grading_breakdown).filter(Boolean)),
  ];

  // Pagination handlers
  const handlePageChange = (tab, page) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: Math.max(
        1,
        Math.min(
          page,
          tab === "students"
            ? totalStudentPages
            : tab === "materials"
            ? totalMaterialPages
            : totalActivityPages
        )
      ),
    }));
  };

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await specificClassroom(classId);
      console.log(result); // keep this to verify

      // ✅ Corrected path
      const data = result?.data?.data;

      if (result.success && data) {
        setClassroomData({
          classroom: data.classroom,
          main_activity: data.main_activity || [],
          materials: data.materials || [],
          students: data.students || [],
          midtermActivities: data.midtermActivities || [],
          finalActivities: data.finalActivities || [],
        });

        setRestrictedSections(data.classroom?.restricted_sections || []);
      }
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast.error("Failed to fetch classroom data");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    allStudentData();
  }, []);

  const allStudentActivities = async (student_id) => {
    try {
      const result = await getAllActivitiesSpecificStudentSpecificClassroom(
        classId,
        student_id
      );
      setSelectedStudentActivities(result.data.data);
      console.log("allStudentActivities");
      console.log(result);
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("An error occurred while removing student");
    }
  };

  const allStudentData = async () => {
    try {
      const result = await getAllStudentGradeSpecificClassroom(classId);

      setStudentData(result.data.data);
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("An error occurred while removing student");
    }
  };

  const handleRestrictSections = async (sections) => {
    try {
      const response = await restrictSections(classId, sections);
      if (response.success) {
        setClassroomData((prev) => ({
          ...prev,
          classroom: {
            ...prev.classroom,
            restricted_sections: sections,
          },
        }));
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to update section restrictions");
    } finally {
      setShowRestrictModal(false);
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showRemoveStudentModal, setShowRemoveStudentModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  const handleRemoveClick = (student) => {
    setStudentToRemove(student);
    setShowRemoveStudentModal(true);
  };

  const confirmRemoveStudent = async () => {
    if (studentToRemove) {
      try {
        const result = await removeStudentClassroom(
          classId,
          studentToRemove._id
        );

        if (result.success) {
          toast.success("Student removed successfully");
          setClassroomData((prev) => ({
            ...prev,
            students: prev.students.filter(
              (s) => s._id !== studentToRemove._id
            ),
          }));
        } else {
          toast.error(result.error || "Failed to remove student");
        }
      } catch (error) {
        console.error("Error removing student:", error);
        toast.error("An error occurred while removing student");
      } finally {
        setShowRemoveStudentModal(false);
        setStudentToRemove(null);
        handleUploadSuccess();
        closeModalActivities();
        closeModal();
      }
    }
  };

  const handleDeleteActivity = async (activityId, activityType) => {
    try {
      const result = await deleteActivity(activityId, activityType);

      if (result.success) {
        toast.success("Activity deleted successfully");
        fetchClasses(); // Refresh the data after deletion
      } else {
        toast.error(result.error || "Failed to delete activity");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const handleActivityCreated = (newActivity) => {
    if (!newActivity) {
      console.error("No activity data received");
      return;
    }

    toast.success(`New ${newActivity.type} created successfully!`);
    fetchClasses(); // Refresh the data after creation
  };

  const handleUploadSuccess = () => {
    fetchClasses();
    allStudentData();
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

  const handleDownload = async (materialId) => {
    try {
      const result = await specificMaterial(materialId);

      if (result.success) {
        const filePath = result.data.data?.material;
        const fileUrl = `${BASE_URL}/uploads/${filePath}`;
        window.open(fileUrl, "_blank");
      } else {
        toast.error(result.error || "Failed to download file");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("An error occurred while downloading");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ClassroomData?.classroom.classroom_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewClick = (student) => {
    console.log("student");
    console.log(student);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleViewClickActivities = (student) => {
    allStudentActivities(student.student._id);
    setIsModalOpenActivities(true);
  };

  const closeModalActivities = () => {
    setIsModalOpenActivities(false);
    setSelectedStudentActivities(null);
  };

  const getFilteredActivities = () => {
    if (!selectedStudentActivities) return [];
    if (activityFilter === "answered")
      return selectedStudentActivities.answered_activities;
    if (activityFilter === "unanswered")
      return selectedStudentActivities.unanswered_activities;
    return selectedStudentActivities.all_activities;
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {ClassroomData.classroom?.classroom_name} (
            {ClassroomData.classroom?.subject_code})
          </h1>
          <p className="mt-1">
            Classroom Code:{" "}
            <button
              onClick={handleCopy}
              className="text-sm hover:bg-gray-400 hover:text-white px-2 py-1 rounded"
            >
              {copied ? `Copied` : `${ClassroomData.classroom?.classroom_code}`}
            </button>
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowEditClassModal(true);
              setClassData(ClassroomData.classroom);
            }}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <FiEdit2 className="mr-2" /> Edit Class
          </button>
          <button
            onClick={() => {
              setRestrictedSections(
                ClassroomData.classroom?.restricted_sections || []
              );
              setShowRestrictModal(true);
            }}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <FiLock className="mr-2" /> Restrict Sections
          </button>
        </div>
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
                activeTab === "students" && !isSectionRestricted("students")
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              disabled={isSectionRestricted("students")}
            >
              Students
              {isSectionRestricted("students") && (
                <FiLock className="ml-2 inline text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className={`px-6 py-3 font-medium ${
                activeTab === "materials" && !isSectionRestricted("materials")
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              disabled={isSectionRestricted("materials")}
            >
              Materials
              {isSectionRestricted("materials") && (
                <FiLock className="ml-2 inline text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-6 py-3 font-medium ${
                activeTab === "activities" && !isSectionRestricted("activities")
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              disabled={isSectionRestricted("activities")}
            >
              Activities
              {isSectionRestricted("activities") && (
                <FiLock className="ml-2 inline text-gray-400" />
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      {ClassroomData?.midtermActivities.length}{" "}
                      {ClassroomData?.midtermActivities.length === 1
                        ? "Total Midterm Activity"
                        : "Total Midterm Activities"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiBarChart2 className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData?.finalActivities.length}{" "}
                      {ClassroomData?.finalActivities.length === 1
                        ? "Total Final Activity"
                        : "Total Final Activities"}
                    </span>
                  </div>
                </div>
                {/* Dynamically render midterm components */}
                {/*                 {renderGradingComponents("midterm")}
                 */}
                {/* Dynamically render final components */}
                {/*                 {renderGradingComponents("final")}
                 */}{" "}
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && !isSectionRestricted("students") && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Students</h3>
              <button
                onClick={() => setShowAddStudentsModal(true)}
                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="mr-2" /> Add Students
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complete Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.student.first_name}{" "}
                          {student.student.middle_name}{" "}
                          {student.student.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                          >
                            active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewClick(student)}
                            className="cursor-pointer px-4 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                          >
                            GRADES
                          </button>
                          <button
                            onClick={() => handleViewClickActivities(student)}
                            className="cursor-pointer px-4 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition"
                          >
                            VIEW
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

            {/* Student Pagination */}
            {totalStudentPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() =>
                    handlePageChange("students", currentPage.students - 1)
                  }
                  disabled={currentPage.students === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.students === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="inline mr-1" /> Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage.students} of {totalStudentPages}
                </span>
                <button
                  onClick={() =>
                    handlePageChange("students", currentPage.students + 1)
                  }
                  disabled={currentPage.students === totalStudentPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.students === totalStudentPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next <FiChevronRight className="inline ml-1" />
                </button>
              </div>
            )}

            {isModalOpenActivities && selectedStudentActivities && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-full max-w-4xl h-[80vh] overflow-y-auto rounded-lg shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Student Activities
                  </h2>

                  <div className="space-y-4 text-md text-gray-700">
                    <div className="font-semibold">Student Information:</div>
                    <p>
                      <span className="font-semibold">Complete Name:</span>{" "}
                      {selectedStudentActivities.student.first_name}{" "}
                      {selectedStudentActivities.student.middle_name}{" "}
                      {selectedStudentActivities.student.last_name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedStudentActivities.student.email}
                    </p>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="font-semibold mb-2">Activities:</div>

                    <div className="mb-4 flex gap-2">
                      <button
                        onClick={() => setActivityFilter("all")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          activityFilter === "all"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        ALL ({selectedStudentActivities.all_activities.length})
                      </button>

                      <button
                        onClick={() => setActivityFilter("answered")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          activityFilter === "answered"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        ANSWERED (
                        {selectedStudentActivities.answered_activities.length})
                      </button>

                      <button
                        onClick={() => setActivityFilter("unanswered")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          activityFilter === "unanswered"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        UNANSWERED (
                        {selectedStudentActivities.unanswered_activities.length}
                        )
                      </button>
                    </div>

                    {getFilteredActivities().map((activity) => (
                      <div
                        key={activity?._id || activity?.activity?._id}
                        className="mt-3 p-3 border rounded-md shadow-sm bg-gray-50"
                      >
                        <div className="font-medium">
                          Title:{" "}
                          <span className="font-normal">
                            {activity?.title || activity?.activity?.title}
                          </span>
                        </div>
                        <div>
                          Type:{" "}
                          <span className="font-normal">
                            {(
                              activity?.activity_type ||
                              activity?.activity?.activity_type ||
                              "N/A"
                            ).toUpperCase()}{" "}
                          </span>
                        </div>
                        <div>
                          Grading Breakdown:{" "}
                          <span className="font-normal">
                            {(
                              activity?.grading_breakdown ||
                              activity?.activity?.grading_breakdown ||
                              "N/A"
                            ).toUpperCase()}{" "}
                          </span>
                        </div>
                        {activityFilter !== "all" && (
                          <div>
                            Score:{" "}
                            {(activity?.answer?.answers || []).reduce(
                              (acc, q) => acc + (q.points || 0),
                              0
                            )}{" "}
                            /{" "}
                            {(
                              activity?.quiz?.question ||
                              activity?.exam?.question ||
                              activity?.activity?.question ||
                              activity?.question ||
                              []
                            ).reduce((acc, q) => acc + (q.points || 0), 0)}
                          </div>
                        )}
                        <Link
                          to={`/instructor/class/${classId}/activity/${
                            (activity?._id || activity?.activity?._id) ?? ""
                          }`}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          VISIT{" "}
                          {(
                            activity?.type ||
                            activity?.activity?.type ||
                            "ACTIVITY"
                          ).toUpperCase()}
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() =>
                        handleRemoveClick(selectedStudentActivities.student)
                      }
                      className="cursor-pointer px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
                    >
                      Remove
                    </button>
                    <button
                      onClick={closeModalActivities}
                      className="cursor-pointer px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && selectedStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Student Grade Details
                    </h2>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-6">
                    <div className="space-y-4">
                      {/* Student Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-gray-700">
                            <span className="font-semibold">
                              Complete Name:{" "}
                            </span>
                            {selectedStudent.student.first_name}{" "}
                            {selectedStudent.student.middle_name}{" "}
                            {selectedStudent.student.last_name}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Email:</span>{" "}
                            {selectedStudent.student.email}
                          </p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-lg font-semibold text-indigo-800">
                            Overall Grade:{" "}
                            <span className="text-2xl">
                              {selectedStudent.overallGrade || null}
                              /100
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Midterm Grades */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Midterm Grades
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(
                            selectedStudent.classroom.grading_system.midterm
                              .components || {}
                          ).map(([type, weight]) => (
                            <div
                              key={`midterm-${type}`}
                              className="border p-4 rounded-lg bg-white"
                            >
                              <p className="font-semibold capitalize">
                                {type}:
                              </p>
                              <p className="text-gray-700">
                                {selectedStudent.grades.midterm[type]
                                  ?.earnedPoints || 0}
                                /
                                {selectedStudent.grades.midterm[type]
                                  ?.totalPoints || 0}{" "}
                                ={" "}
                                <span className="font-medium text-indigo-600">
                                  {selectedStudent.grades.midterm[type]
                                    ?.grade || 0}
                                </span>
                                /{weight}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-800">
                            Midterm Total:{" "}
                            {selectedStudent.grades.midterm.term_grade || 0}/
                            {Object.values(
                              selectedStudent.classroom.grading_system.midterm
                                ?.components || {}
                            ).reduce((a, b) => a + b, 0)}
                          </p>
                        </div>
                      </div>

                      {/* Final Grades */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Final Grades
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(
                            selectedStudent.classroom.grading_system.final
                              .components || {}
                          ).map(([type, weight]) => (
                            <div
                              key={`final-${type}`}
                              className="border p-4 rounded-lg bg-white"
                            >
                              <p className="font-semibold capitalize">
                                {type}:
                              </p>
                              <p className="text-gray-700">
                                {selectedStudent.grades.final[type]
                                  ?.earnedPoints || 0}
                                /
                                {selectedStudent.grades.final[type]
                                  ?.totalPoints || 0}{" "}
                                ={" "}
                                <span className="font-medium text-indigo-600">
                                  {selectedStudent.grades.final[type]?.grade ||
                                    0}
                                </span>
                                /{weight}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-800">
                            Final Total:{" "}
                            {selectedStudent.grades.final.term_grade || 0}/
                            {Object.values(
                              selectedStudent.classroom.grading_system.final
                                ?.components || {}
                            ).reduce((a, b) => a + b, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Actions */}
                  <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex justify-end gap-4">
                    <button
                      onClick={() => handleRemoveClick(selectedStudent.student)}
                      className="cursor-pointer px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove Student
                    </button>
                    <button
                      onClick={closeModal}
                      className="cursor-pointer px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showRemoveStudentModal && studentToRemove && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Confirm Removal</h3>
                  <p className="mb-6">
                    Are you sure you want to remove {studentToRemove.first_name}{" "}
                    {studentToRemove.last_name} ({studentToRemove.email}) from
                    this class?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowRemoveStudentModal(false)}
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmRemoveStudent}
                      className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove Student
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddStudentsModal && (
              <AddStudentsModal
                isOpen={showAddStudentsModal}
                onClose={() => setShowAddStudentsModal(false)}
                classId={classId}
                onSuccess={handleUploadSuccess}
              />
            )}
          </div>
        )}

        {activeTab === "materials" && !isSectionRestricted("materials") && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Materials</h3>

              <button
                onClick={() => setShowUploadModal(true)}
                className="cursor-pointer  px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
              >
                <FiPlus className="mr-2" /> Upload Material
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {currentMaterials.length > 0 ? (
                currentMaterials.map((material) => (
                  <div
                    key={material._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{material.title}</h4>
                        <h6 className="font-light">{material.description}</h6>

                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                            Material
                          </span>
                          <span>
                            Posted:{" "}
                            {new Date(material.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(material._id)}
                          className="cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Download"
                        >
                          <FiDownload />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMaterial(material);
                            setShowEditMaterialModal(true);
                          }}
                          className="cursor-pointer p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => {
                            setMaterialToDelete(material);
                            setShowDeleteModal(true);
                          }}
                          className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 italic">
                  No materials available.
                </div>
              )}
            </div>

            {/* Materials Pagination */}
            {totalMaterialPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() =>
                    handlePageChange("materials", currentPage.materials - 1)
                  }
                  disabled={currentPage.materials === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.materials === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="inline mr-1" /> Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage.materials} of {totalMaterialPages}
                </span>
                <button
                  onClick={() =>
                    handlePageChange("materials", currentPage.materials + 1)
                  }
                  disabled={currentPage.materials === totalMaterialPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.materials === totalMaterialPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next <FiChevronRight className="inline ml-1" />
                </button>
              </div>
            )}

            {showUploadModal && (
              <UploadMaterialModal
                classId={classId}
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            )}

            {showEditMaterialModal && selectedMaterial && (
              <EditMaterialModal
                isOpen={showEditMaterialModal}
                onClose={() => setShowEditMaterialModal(false)}
                material={selectedMaterial}
                classId={classId}
                onUpdateSuccess={handleUploadSuccess}
              />
            )}

            {showDeleteModal && materialToDelete && (
              <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                material={materialToDelete}
                onDeleteSuccess={handleUploadSuccess}
              />
            )}
          </div>
        )}

        {activeTab === "activities" && !isSectionRestricted("activities") && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Activities</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <FiFilter className="mr-2" /> Filters
                </button>
                <button
                  onClick={() => setIsAssignmentModalOpen(true)}
                  className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                >
                  <FiPlus className="mr-2" /> New Activity
                </button>
              </div>
            </div>

            {/* Activity Filters */}
            {showFilters && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActivityTypeFilter("all")}
                        className={`px-3 py-1 rounded-md text-sm ${
                          activityTypeFilter === "all"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        All
                      </button>

                      {uniqueActivityTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setActivityTypeFilter(type)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            activityTypeFilter === type
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                          {/* Capitalize */}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grading Breakdown
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setGradingBreakdownFilter("all")}
                        className={`px-3 py-1 rounded-md text-sm ${
                          gradingBreakdownFilter === "all"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        All
                      </button>
                      {uniqueGradingBreakdowns.map((breakdown) => (
                        <button
                          key={breakdown}
                          onClick={() => setGradingBreakdownFilter(breakdown)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            gradingBreakdownFilter === breakdown
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {breakdown}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-200">
              {currentActivitiesPaginated.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {filteredActivities.length === 0
                    ? "No activities match your filters"
                    : "There are no activities"}
                </div>
              ) : (
                currentActivitiesPaginated.map((activity) => (
                  <div
                    key={activity._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-gray-700">
                          <strong className="font-medium">Title:</strong>{" "}
                          {activity.title}
                        </h4>
                        <span className="text-gray-700">
                          <strong className="font-medium">Description:</strong>{" "}
                          {activity.description}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs mr-2 capitalize ${
                              activity.activityType === "quiz"
                                ? "bg-blue-100 text-blue-800"
                                : activity.activityType === "exam"
                                ? "bg-purple-100 text-purple-800"
                                : activity.activityType === "assignment"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {activity.activityType} -{" "}
                            {activity.grading_breakdown || "N/A"}
                          </span>
                          <span className="text-gray-700 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mx-2"></span>
                            <strong className="font-medium mr-2">
                              Duration:
                            </strong>
                            {activity.submission_time +
                              (activity.extended_minutes || 0) >=
                            60
                              ? `${Math.floor(
                                  (activity.submission_time +
                                    (activity.extended_minutes || 0)) /
                                    60
                                )}h ${
                                  (activity.submission_time +
                                    (activity.extended_minutes || 0)) %
                                  60
                                }m`
                              : `${
                                  activity.submission_time +
                                  (activity.extended_minutes || 0)
                                }m`}
                            {activity.extended_minutes > 0 && (
                              <span className="text-green-600 ml-1">
                                (+{activity.extended_minutes}m extended)
                              </span>
                            )}
                          </span>
                          <span className="ml-2 text-gray-700">
                            <strong className="font-medium">Points:</strong>{" "}
                            <span>{calculateActivityPoints(activity)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/instructor/class/${classId}/activity/${activity._id}`}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setActivityToEdit(activity);
                            setShowEditModal(true);
                          }}
                          className="cursor-pointer px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Activities Pagination */}
            {totalActivityPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() =>
                    handlePageChange("activities", currentPage.activities - 1)
                  }
                  disabled={currentPage.activities === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.activities === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="inline mr-1" /> Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage.activities} of {totalActivityPages}
                </span>
                <button
                  onClick={() =>
                    handlePageChange("activities", currentPage.activities + 1)
                  }
                  disabled={currentPage.activities === totalActivityPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage.activities === totalActivityPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next <FiChevronRight className="inline ml-1" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show message when section is restricted */}
        {(activeTab === "students" && isSectionRestricted("students")) ||
        (activeTab === "materials" && isSectionRestricted("materials")) ||
        (activeTab === "assignments" && isSectionRestricted("assignments")) ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <FiLock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              This section is restricted
            </h3>
            <p className="text-gray-500">
              Students cannot access this section of the classroom.
            </p>
          </div>
        ) : null}
      </div>

      {showEditClassModal && classData && (
        <EditClassModal
          showEditClassModal={showEditClassModal}
          setShowEditClassModal={setShowEditClassModal}
          data={classData}
          onUpdate={handleClassUpdate}
        />
      )}

      {showActivityDeletionModal && activityToDelete && (
        <ActivityDeletionModal
          isOpen={showActivityDeletionModal}
          onClose={() => setShowActivityDeletionModal(false)}
          onConfirm={() => {
            handleDeleteActivity(activityToDelete._id, activityToDelete.type);
            setShowActivityDeletionModal(false);
          }}
          title={`Delete ${
            activityToDelete.type === "quiz"
              ? "Quiz"
              : activityToDelete.type === "exam"
              ? "Exam"
              : activityToDelete.type === "assignment"
              ? "Assignment"
              : "Activity"
          }`}
          message={`Are you sure you want to delete "${activityToDelete.title}"? All associated data will be permanently removed.`}
        />
      )}

      {isAssignmentModalOpen && (
        <CreateAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => setIsAssignmentModalOpen(false)}
          classId={classId}
          onSuccess={handleActivityCreated}
          progLanguage={ClassroomData?.classroom.programming_language}
        />
      )}

      {showEditModal && (
        <EditActivityModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          activity={activityToEdit}
          onUpdateSuccess={fetchClasses}
          classId={classId}
        />
      )}

      {showRestrictModal && (
        <SectionRestrictionModal
          classroom={ClassroomData.classroom}
          onClose={() => setShowRestrictModal(false)}
          onUpdate={handleRestrictSections}
          availableSections={availableSections}
        />
      )}
    </>
  );
};

export default ClassDetailPage;
