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
} from "../../utils/authService";
import { toast } from "react-toastify";
import CreateAssignmentModal from "../../components/CreateAssignmentModal";
import EditMaterialModal from "../../components/EditMaterialModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActivityDeletionModal from "../../components/ActivityDeletionModal";
import AddStudentsModal from "../../components/AddStudentsModal";
import EditActivityModal from "../../components/EditActivityModal";

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
  const [ClassroomData, setClassroomData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentActivities, setSelectedStudentActivities] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenActivities, setIsModalOpenActivities] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");

  // Helper function to calculate activity points
  // Updated calculateActivityPoints function
  // Updated calculateActivityPoints function
  const calculateActivityPoints = (activity) => {
    console.log(activity);
    // First check if activity has direct points property
    if (activity.points !== undefined && activity.points !== null) {
      return activity.points;
    }

    // Check if it has questions array with points
    if (Array.isArray(activity.question)) {
      // Note: your data uses 'question' not 'questions'
      return activity.question.reduce((total, q) => {
        return total + (Number(q.points) || 0); // Ensure points is treated as number
      }, 0);
    }

    // Default to 0 if no points can be calculated
    return 0;
  };
  // Combine and sort all activities (quizzes, exams, and activities)
  const quizzes = Array.isArray(ClassroomData.quizzes)
    ? ClassroomData.quizzes
    : [];
  const exams = Array.isArray(ClassroomData.exams) ? ClassroomData.exams : [];
  const activities = Array.isArray(ClassroomData.activities)
    ? ClassroomData.activities
    : [];

  const allActivities = [...quizzes, ...exams, ...activities].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await specificClassroom(classId);
      if (result.success) {
        setClassroomData(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast.error("Failed to fetch classroom data");
    } finally {
      setIsLoading(false);
    }
  }, [classId, setIsLoading, setClassroomData]);

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
      //console.log(student_id)
      //console.log(result.data.data);
      setSelectedStudentActivities(result.data.data);
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("An error occurred while removing student");
    }
  };

  const allStudentData = async () => {
    try {
      const result = await getAllStudentGradeSpecificClassroom(classId);
      console.log(result.data.data);
      setStudentData(result.data.data);
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("An error occurred while removing student");
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showRemoveStudentModal, setShowRemoveStudentModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  /* const handleEditActivity = async () => {
    try {
      if (!activityToEdit) {
        toast.error("No activity data to update");
        return;
      }

      const payload = {
        classroom_id: classId,
        question: activityToEdit.question,
        time_limit: activityToEdit.submission_time,
        title: activityToEdit.title,
        description: activityToEdit.description,
        grading_breakdown: activityToEdit.grading_breakdown,
      };

      const result = await updateActivity(
        activityToEdit._id,
        activityToEdit.type,
        payload
      );

      if (result.success) {
        toast.success("Activity updated successfully");
        // setActivityToEdit(activityToEdit);
        setShowEditModal(false);
        fetchClasses();
      } else {
        toast.error(result.error || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("An error occurred while updating");
    }
  }; */

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
      }
    }
  };

  const handleDeleteActivity = async (activityId, activityType) => {
    try {
      const result = await deleteActivity(activityId, activityType);

      if (result.success) {
        toast.success("Activity deleted successfully");

        // Update the state to remove the deleted activity
        if (activityType === "quiz") {
          setClassroomData((prev) => ({
            ...prev,
            quizzes: prev.quizzes?.filter((q) => q._id !== activityId) || [],
          }));
        } else if (activityType === "exam") {
          setClassroomData((prev) => ({
            ...prev,
            exams: prev.exams?.filter((e) => e._id !== activityId) || [],
          }));
        } else if (activityType === "activity") {
          setClassroomData((prev) => ({
            ...prev,
            activities:
              prev.activities?.filter((a) => a._id !== activityId) || [],
          }));
        }
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

    // Create a complete activity object with all required fields
    const completeActivity = {
      _id: newActivity._id,
      title: newActivity.title || "Untitled Activity",
      description: newActivity.description || "",
      submission_time: newActivity.submission_time || 60,
      points: newActivity.points || calculateActivityPoints(newActivity),
      created_at: newActivity.created_at || new Date().toISOString(),
      type: newActivity.type || "quiz",
      ...newActivity,
    };

    // Update the appropriate array based on activity type
    if (completeActivity.type === "quiz") {
      setClassroomData((prev) => ({
        ...prev,
        quizzes: [...(prev.quizzes || []), completeActivity],
      }));
    } else if (completeActivity.type === "exam") {
      setClassroomData((prev) => ({
        ...prev,
        exams: [...(prev.exams || []), completeActivity],
      }));
    } else if (completeActivity.type === "activity") {
      setClassroomData((prev) => ({
        ...prev,
        activities: [...(prev.activities || []), completeActivity],
      }));
    }

    toast.success(`New ${completeActivity.type} created successfully!`);
  };

  const handleUploadSuccess = () => {
    fetchClasses();
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

        <button
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
              Activities
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
                          (ClassroomData.exams?.length || 0) +
                          (ClassroomData.activities?.length || 0);
                        return `${total} ${
                          total <= 1 ? "Activity" : "Activities"
                        }`;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiEdit3 className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData.quizzes?.length || 0} Quiz
                      {(ClassroomData.quizzes?.length || 0) !== 1 ? "zes" : ""}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiClipboard className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData.exams?.length || 0} Exam
                      {(ClassroomData.exams?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiBook className="text-indigo-600 mr-2" />
                    <span className="font-medium">
                      {ClassroomData.activities?.length || 0} Activity
                      {(ClassroomData.activities?.length || 0) !== 1
                        ? "ies"
                        : "y"}
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
                  {studentData?.length > 0 ? (
                    studentData.map((student) => (
                      <tr
                        key={student.student._id}
                        className="hover:bg-gray-50"
                      >
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
                            className="px-4 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                          >
                            GRADES
                          </button>

                          <button
                            onClick={() => handleViewClickActivities(student)}
                            className="px-4 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition"
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

            {isModalOpenActivities && selectedStudentActivities && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
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

                    {/* Filter Buttons */}
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

                    {/* Activities List */}
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
                              activity?.type ||
                              activity?.activity?.type ||
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
                            activity?._id || activity?.activity?._id
                          }`}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          VISIT{" "}
                          {(
                            activity?.type || activity?.activity?.type
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
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
                    >
                      Remove
                    </button>
                    <button
                      onClick={closeModalActivities}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && selectedStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Student Grade Details
                  </h2>

                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Complete Name: </span>
                      {selectedStudent.student.first_name}{" "}
                      {selectedStudent.student.middle_name}{" "}
                      {selectedStudent.student.last_name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedStudent.student.email}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
                        <p className="font-semibold capitalize">Quiz:</p>
                        <p>
                          {selectedStudent.grades.quiz.earnedPoints}/
                          {selectedStudent.grades.quiz.totalPoints} ={" "}
                          <span className="font-medium text-indigo-600">
                            {selectedStudent.grades.quiz.quiz}
                          </span>
                          /{selectedStudent.classroom.grading_system.quiz}
                        </p>
                      </div>
                      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
                        <p className="font-semibold capitalize">Activity:</p>
                        <p>
                          {selectedStudent.grades.activity.earnedPoints}/
                          {selectedStudent.grades.activity.totalPoints} ={" "}
                          <span className="font-medium text-indigo-600">
                            {selectedStudent.grades.activity.activity}
                          </span>
                          /{selectedStudent.classroom.grading_system.activity}
                        </p>
                      </div>
                      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
                        <p className="font-semibold capitalize">Midterm:</p>
                        <p>
                          {selectedStudent.grades.midterm.earnedPoints}/
                          {selectedStudent.grades.midterm.totalPoints} ={" "}
                          <span className="font-medium text-indigo-600">
                            {selectedStudent.grades.midterm.midterm}
                          </span>
                          /{selectedStudent.classroom.grading_system.midterm}
                        </p>
                      </div>
                      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
                        <p className="font-semibold capitalize">Final:</p>
                        <p>
                          {selectedStudent.grades.final.earnedPoints}/
                          {selectedStudent.grades.final.totalPoints} ={" "}
                          <span className="font-medium text-indigo-600">
                            {selectedStudent.grades.final.final}
                          </span>
                          / {selectedStudent.classroom.grading_system.final}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <p className="text-lg font-semibold">
                        Student Grade:
                        <span className="text-indigo-700 ml-2">
                          {selectedStudent.grades.student_grade.grade}/100
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => handleRemoveClick(selectedStudent.student)}
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
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
                    Are you sure you want to remove {studentToRemove.fullname} (
                    {studentToRemove.email}) from this class?
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
                onSuccess={fetchClasses}
              />
            )}
          </div>
        )}

        {activeTab === "materials" && (
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
              {ClassroomData.materials && ClassroomData.materials.length > 0 ? (
                ClassroomData.materials.map((material) => (
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

        {activeTab === "assignments" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Class Activities</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsAssignmentModalOpen(true)}
                  className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                >
                  <FiPlus className="mr-2" /> New Activity
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {allActivities.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  There are no activities
                </div>
              ) : (
                allActivities.map((activity) => (
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
                              activity.type === "quiz"
                                ? "bg-blue-100 text-blue-800"
                                : activity.type === "exam"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {activity.type} - {activity.grading_breakdown}
                          </span>

                          {activity.type !== "activity" && (
                            <>
                              <span className="text-gray-700 flex items-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mx-2"></span>
                                <strong className="font-medium mr-2">
                                  Duration:
                                </strong>
                                {activity.submission_time >= 60
                                  ? `${Math.floor(
                                      activity.submission_time / 60
                                    )}h ${activity.submission_time % 60}m`
                                  : `${activity.submission_time}m`}
                              </span>
                            </>
                          )}

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
    </>
  );
};

export default ClassDetailPage;
