import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiDownload,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiPlay,
  FiCheck,
  FiX,
  FiLogOut,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { BASE_URL } from "../../utils/config";
import {
  specificClassroom,
  allAnswerActivitySpecificStudentSpecificClassroom,
  leaveClassroom,
  computeStudentGrade,
} from "../../utils/authService";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classroom_overview");
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classroom, setClassroom] = useState({
    classroom: {},
    students: [],
    materials: [],
    midtermActivities: [], // ✅ must be array
    finalActivities: [],
    gradingSystem: { midterm: {}, final: {} },
  });
  const [grades, setGrades] = useState({
    midterm: {},
    final: {},
    student_grade: {},
  });
  const [answers, setAnswers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [restrictedSections, setRestrictedSections] = useState([]);
  const studentId = localStorage.getItem("userId");

  // Pagination state
  const [currentPage, setCurrentPage] = useState({
    lessons: 1,
    assignments: 1,
  });
  const itemsPerPage = 5;

  // Calculate pagination for lessons
  const lessonStartIndex = (currentPage.lessons - 1) * itemsPerPage;
  const lessonEndIndex = lessonStartIndex + itemsPerPage;
  const currentLessons =
    classroom.materials?.slice(lessonStartIndex, lessonEndIndex) || [];
  const totalLessonPages = Math.ceil(
    (classroom.materials?.length || 0) / itemsPerPage
  );

  // Get all activity types from grading system
  const getActivityTypes = () => {
    const midtermTypes = classroom.gradingSystem?.midterm?.components
      ? Object.keys(classroom.gradingSystem.midterm.components)
      : [];
    const finalTypes = classroom.gradingSystem?.final?.components
      ? Object.keys(classroom.gradingSystem.final.components)
      : [];
    return [...new Set([...midtermTypes, ...finalTypes])];
  };

  // Get all assignments by combining activities from both terms
  const getAllAssignments = () => {
    const midterm = (classroom.midtermActivities || []).map((activity) => ({
      ...activity,
      type: activity.activity_type,
      term: "midterm",
    }));

    const final = (classroom.finalActivities || []).map((activity) => ({
      ...activity,
      type: activity.activity_type,
      term: "final",
    }));

    return [...midterm, ...final].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  };

  // Get color for activity type badge
  const getActivityTypeColor = (type) => {
    const colors = {
      quiz: "bg-yellow-100 text-yellow-800",
      exam: "bg-green-100 text-green-800",
      assignment: "bg-purple-100 text-purple-800",
      activity: "bg-blue-100 text-blue-800",
      // Add more types as needed
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Pagination handlers
  const handlePageChange = (tab, page) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: Math.max(
        1,
        Math.min(
          page,
          tab === "lessons" ? totalLessonPages : totalAssignmentPages
        )
      ),
    }));
  };

  const isSectionRestricted = (section) => {
    return restrictedSections.includes(section);
  };

  useEffect(() => {
    fetchSpecificClassroom();
    // console.log("🏁 classroom.gradingSystem:", classroom.gradingSystem);
    // console.log("✅ Activity Types:", getActivityTypes());
    // console.log("📦 Midterm Activities:", classroom.midtermActivities);
    // console.log("📦 Final Activities:", classroom.finalActivities);
    // console.log("🧪 All Assignments:", getAllAssignments());
    // console.log("🎯 Filtered Assignments:", filterAssignments());
  }, [classId]);

  useEffect(() => {
    if (!isLoading) {
      // Set the first non-restricted tab as active if the current tab is restricted
      if (
        (activeTab === "lessons" && isSectionRestricted("lessons")) ||
        (activeTab === "assignments" && isSectionRestricted("assignments")) ||
        (activeTab === "grades" && isSectionRestricted("grades")) ||
        (activeTab === "practice_with_ai" && isSectionRestricted("practice"))
      ) {
        const sections = [
          { id: "lessons", restricted: isSectionRestricted("lessons") },
          { id: "assignments", restricted: isSectionRestricted("assignments") },
          { id: "grades", restricted: isSectionRestricted("grades") },
          {
            id: "practice_with_ai",
            restricted: isSectionRestricted("practice"),
          },
          { id: "classroom_overview", restricted: false },
        ];

        const firstAvailable = sections.find((s) => !s.restricted);
        setActiveTab(firstAvailable?.id || "classroom_overview");
      }
    }
  }, [restrictedSections, isLoading, activeTab]);

  const fetchSpecificClassroom = async () => {
    setIsLoading(true);
    try {
      const [classResult, activityResult, gradeResult] = await Promise.all([
        specificClassroom(classId),
        allAnswerActivitySpecificStudentSpecificClassroom(classId, studentId),
        computeStudentGrade(classId, studentId),
      ]);

      if (classResult.success) {
        let classroomData = classResult.data.data;
        // Merge grading system from gradeResult if available
        if (gradeResult.success && gradeResult.data.data) {
          classroomData = {
            ...classroomData,
            gradingSystem: gradeResult.data.gradingSystem,
          };
        }
        setClassroom(classroomData);
        setRestrictedSections(
          classroomData.classroom?.restricted_sections || []
        );
      }

      if (activityResult.success) {
        setAnswers(activityResult.data.data || []);
      }

      if (gradeResult?.data?.data) {
        const gradeData = gradeResult.data.data;
        setGrades({
          midterm: gradeData.midterm || {},
          final: gradeData.final || {},
          student_grade: gradeData.student_grade || {},
        });
      }
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast.error("Failed to fetch classroom data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssignments = () => {
    const assignments = getAllAssignments();

    return assignments.filter((assignment) => {
      const answer = answers.find((ans) => {
        const ansAssignment =
          ans.quiz || ans.exam || ans.activity || ans.assignment;
        return ansAssignment?._id === assignment?._id;
      });

      const isCompleted = answer?.submitted_at;
      const isOngoing = answer?.opened_at && !answer?.submitted_at;

      if (selectedStatus === "all") return true;
      if (selectedStatus === "not yet") return !isCompleted && !isOngoing;
      if (selectedStatus === "ongoing") return isOngoing;
      if (selectedStatus === "completed") return isCompleted;

      return true;
    });
  };

  const assignmentStartIndex = (currentPage.assignments - 1) * itemsPerPage;
  const assignmentEndIndex = assignmentStartIndex + itemsPerPage;
  const currentAssignments = filterAssignments().slice(
    assignmentStartIndex,
    assignmentEndIndex
  );
  const totalAssignmentPages = Math.ceil(
    filterAssignments().length / itemsPerPage
  );

  const handleCopy = () => {
    if (classroom.classroom?.classroom_code) {
      navigator.clipboard.writeText(classroom.classroom.classroom_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const leaveClassroomFunction = async () => {
    try {
      const result = await leaveClassroom(classId, studentId);
      toast.success(result.data);
      navigate("/student/classes");
    } catch (error) {
      toast.error("Failed to leave classroom");
    }
  };

  const handleLeaveClass = () => {
    leaveClassroomFunction();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Helper function to convert numeric grade to letter grade
  const getGradeLetter = (grade) => {
    if (grade >= 90) return "A (Excellent)";
    if (grade >= 80) return "B (Good)";
    if (grade >= 70) return "C (Average)";
    if (grade >= 60) return "D (Below Average)";
    return "F (Fail)";
  };

  // Render grade breakdown for a term
  const renderGradeBreakdown = (term) => {
    const student_grade =  term === "midterm" ? grades.midterm.categoryBreakdown : grades.final.categoryBreakdown;
    const termData = grades[term] || {};
    const gradingComponents = classroom.gradingSystem?.[term] || {};
    const activityTypes = Object.keys(gradingComponents);

    return (
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">
          {term.charAt(0).toUpperCase() + term.slice(1)} Grades
        </h3>
        <div className="space-y-2 text-gray-700">
          {/* {activityTypes.map((type) => (
            <div key={type} className="flex justify-between">
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
              <span>
                {termData[type]?.earnedPoints || 0}/
                {termData[type]?.totalPoints || 0} ={" "}
                {termData[type]?.grade || 0}/{gradingComponents[type] || 0}%
              </span>
            </div>
          ))} */}
          {Object.keys(student_grade).map((type) => (
            <div key={type} className="flex justify-between">
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
              <span>
                {student_grade[type]?.earnedPoints || 0}/
                {student_grade[type]?.totalPoints || 0} ={" "}
                {student_grade[type]?.weightedContribution}/{student_grade[type]?.weight || 0}%
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2">
            <span>{term.charAt(0).toUpperCase() + term.slice(1)} Total:</span>
            <span>
              {termData.term_grade || 0}/
              {Object.values(gradingComponents).reduce((a, b) => a + b, 0)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render grading system overview
  const renderGradingSystem = (term) => {
    // Check both possible locations for grading system data
    const gradingSystem =
      classroom.gradingSystem?.[term] || grades.gradingSystem?.[term] || {};

    const components = gradingSystem.components || gradingSystem; // Handle both structures

    if (!components || Object.keys(components).length === 0) {
      return (
        <p className="text-gray-500">
          No grading components defined for {term}
        </p>
      );
    }

    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {term.charAt(0).toUpperCase() + term.slice(1)}
        </h3>
        <div className="space-y-2 text-gray-700">
          {Object.entries(components).map(([type, value]) => (
            <div key={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}: {value}%
            </div>
          ))}
        </div>
      </div>
    );
  };


  const midterm_activities = classroom.activities.filter(activity => activity.grading_breakdown === 'midterm');
  const final_activities = classroom.activities.filter(activity => activity.grading_breakdown === 'final');
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Group activities by grading_breakdown and activity_type and count them
const groupAndCountActivities = (activities) => {
  return activities.reduce((acc, activity) => {
    const key = `${activity.grading_breakdown}-${activity.activity_type}`;
    if (!acc[key]) {
      acc[key] = {
        grading_breakdown: activity.grading_breakdown,
        activity_type: activity.activity_type,
        count: 0,
      };
    }
    acc[key].count += 1;
    return acc;
  }, {});
};

  // Render activity counts for classroom overview
  const renderActivityCounts = () => {
    const groupedActivitiesMidterm = groupAndCountActivities(midterm_activities);
    const groupedActivitiesFinal = groupAndCountActivities(final_activities);
    const groupedArrayMidterm = Object.values(groupedActivitiesMidterm);
    const groupedArrayFinal = Object.values(groupedActivitiesFinal);

    const activityTypes = getActivityTypes();
    const counts = {};

    activityTypes.forEach((type) => {
      counts[type] = {
        midterm: (classroom.midtermActivities[type] || []).length,
        final: (classroom.finalActivities[type] || []).length,
        total: 0,
      };
      counts[type].total = counts[type].midterm + counts[type].final;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(counts).map(([type, count]) => (
          <div
            key={type}
            className={`p-4 rounded-xl shadow-sm ${
              type === "quiz"
                ? "bg-yellow-100 text-yellow-800"
                : type === "exam"
                ? "bg-green-100 text-green-800"
                : type === "assignment"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <h3 className="text-sm font-medium">
              Total {type.charAt(0).toUpperCase() + type.slice(1)}s
            </h3>
            <p className="text-2xl font-bold">{count.total}</p>
            <p className="text-xs mt-1">
              {count.midterm} midterm, {count.final} final
            </p>
          </div>
        ))}

        <div className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium">Total Materials</h3>
          <p className="text-2xl font-bold">
            {classroom.materials?.length || 0}
          </p>
        </div>

        <div className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium">Total Midterm Activities</h3>
          <p className="text-2xl font-bold">
            {classroom.midtermActivities.length}
          </p>
        </div>

        <div className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium">Total Final Activities</h3>
          <p className="text-2xl font-bold">
            {classroom.finalActivities.length}
          </p>
        </div>

        {groupedArrayMidterm.map((group) => (
            <div key={`${group.grading_breakdown}-${group.activity_type}`} className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold">
                Total {capitalizeWords(group.grading_breakdown)} - {capitalizeWords(group.activity_type)}
              </h3>
              <p className="text-2xl font-bold">{group.count}</p>
            </div>
        ))}

        {groupedArrayFinal.map((group) => (
            <div key={`${group.grading_breakdown}-${group.activity_type}`} className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold">
                Total {capitalizeWords(group.grading_breakdown)} - {capitalizeWords(group.activity_type)}
              </h3>
              <p className="text-2xl font-bold">{group.count}</p>
            </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Class Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-red-200 text-black hover:text-white font-semibold py-1 px-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105 focus:outline-none mb-4"
            >
              <FiLogOut className="mr-2" />
              Leave Class
            </button>
            <h1 className="text-4xl font-bold text-gray-800">
              {classroom.classroom?.classroom_name || "Classroom"}
            </h1>
            <p className="text-gray-600">
              {classroom.classroom?.subject_code || ""} •
              {classroom.classroom?.instructor
                ? ` ${classroom.classroom.instructor.first_name} ${classroom.classroom.instructor.middle_name} ${classroom.classroom.instructor.last_name}`
                : " Loading instructor..."}
            </p>
            <p className="mt-2 text-gray-700">
              {classroom.classroom?.description || ""}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-gray-700">
                <span className="italic">Classroom Code: </span>
                <button
                  onClick={handleCopy}
                  className="text-sm hover:bg-gray-400 hover:text-white px-2 py-1 rounded"
                  disabled={!classroom.classroom?.classroom_code}
                >
                  {copied
                    ? "Copied"
                    : classroom.classroom?.classroom_code || "Loading..."}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() =>
              !isSectionRestricted("lessons") && setActiveTab("lessons")
            }
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "lessons"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : isSectionRestricted("lessons")
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSectionRestricted("lessons")}
          >
            Lessons
            {isSectionRestricted("lessons") && (
              <FiLock className="ml-2 inline text-gray-400" />
            )}
          </button>

          <button
            onClick={() =>
              !isSectionRestricted("assignments") && setActiveTab("assignments")
            }
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "assignments"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : isSectionRestricted("assignments")
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSectionRestricted("assignments")}
          >
            Assignments
            {isSectionRestricted("assignments") && (
              <FiLock className="ml-2 inline text-gray-400" />
            )}
          </button>

          <button
            onClick={() =>
              !isSectionRestricted("grades") && setActiveTab("grades")
            }
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "grades"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : isSectionRestricted("grades")
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSectionRestricted("grades")}
          >
            Grades
            {isSectionRestricted("grades") && (
              <FiLock className="ml-2 inline text-gray-400" />
            )}
          </button>

          <button
            onClick={() =>
              !isSectionRestricted("practice") &&
              setActiveTab("practice_with_ai")
            }
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === "practice_with_ai"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : isSectionRestricted("practice")
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            disabled={isSectionRestricted("practice")}
          >
            Practice With AI
            {isSectionRestricted("practice") && (
              <FiLock className="ml-2 inline text-gray-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("classroom_overview")}
            className={`px-6 py-3 font-medium ${
              activeTab === "classroom_overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Classroom Overview
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLeaveClass}
          title="Leave Classroom"
          message="Are you sure you want to leave this classroom?"
        />

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "lessons" && (
            <div className="space-y-4">
              {isSectionRestricted("lessons") ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium mb-4">
                    This section has been restricted by the instructor.
                  </p>
                  <button
                    onClick={() => setActiveTab("classroom_overview")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Classroom Overview
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Class Materials</h2>
                  {currentLessons.length > 0 ? (
                    <div className="space-y-3">
                      {currentLessons.map((material) => (
                        <div
                          key={material._id}
                          className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow overflow-hidden"
                        >
                          <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() =>
                              setExpandedLesson(
                                expandedLesson === material._id
                                  ? null
                                  : material._id
                              )
                            }
                          >
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                                  Material
                                </span>
                                <span>
                                  Posted:{" "}
                                  {new Date(
                                    material.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {expandedLesson === material._id ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </div>

                          {expandedLesson === material._id && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">
                                  Lesson Content
                                </h4>
                                <p className="text-gray-700">
                                  {material.description}
                                </p>
                                {material.material && (
                                  <a
                                    href={`${BASE_URL}/uploads/${material.material}`}
                                    download
                                    className="mt-2 inline-block px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm"
                                  >
                                    <FiDownload className="mr-2" /> Download
                                    Materials
                                  </a>
                                )}
                              </div>

                              <div className="mt-4 border-t pt-4">
                                <Link
                                  to={`/student/class/${classId}/${material._id}/practice_with_lesson`}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                >
                                  <FiCode className="mr-2" />
                                  Start Practice Exercises
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No materials available.</p>
                  )}

                  {totalLessonPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <button
                        onClick={() =>
                          handlePageChange("lessons", currentPage.lessons - 1)
                        }
                        disabled={currentPage.lessons === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage.lessons === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <FiChevronLeft className="inline mr-1" /> Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage.lessons} of {totalLessonPages}
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange("lessons", currentPage.lessons + 1)
                        }
                        disabled={currentPage.lessons === totalLessonPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage.lessons === totalLessonPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next <FiChevronRight className="inline ml-1" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="space-y-4">
              {isSectionRestricted("assignments") ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium mb-4">
                    This section has been restricted by the instructor.
                  </p>
                  <button
                    onClick={() => setActiveTab("classroom_overview")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Classroom Overview
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Assignments</h2>
                  {/* <div className="mb-4">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="all">All</option>
                      <option value="not yet">Not Yet</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div> */}

                  {currentAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {currentAssignments.map((assignment) => {
                        const answer = answers.find((ans) => {
                          const ansAssignment =
                            ans.main_activity 
                          return ansAssignment?._id === assignment?._id;
                        });

                        const isCompleted = answer?.submitted_at;
                        const isOngoing =
                          answer?.opened_at && !answer?.submitted_at;

                        return (
                          <div
                            key={assignment._id}
                            className={`bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow ${
                              isCompleted ? "border-l-4 border-l-green-500" : ""
                            }`}
                          >
                            <div
                              className="p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                setExpandedAssignment(
                                  expandedAssignment === assignment._id
                                    ? null
                                    : assignment._id
                                )
                              }
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs capitalize ${getActivityTypeColor(
                                        assignment.type
                                      )}`}
                                    >
                                      {assignment.type} -{" "}
                                      {assignment.grading_breakdown}
                                    </span>
                                    {isCompleted && (
                                      <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        <FiCheck className="mr-1" /> Completed
                                      </span>
                                    )}
                                    {isOngoing && (
                                      <span className="flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                        <FiClock className="mr-1" /> In Progress
                                      </span>
                                    )}
                                    {!isCompleted && !isOngoing && (
                                      <span className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                        <FiX className="mr-1" /> Not Started
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-medium mt-2">
                                    {assignment.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {assignment.description}
                                  </p>
                                  <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <FiClock className="mr-1" />
                                    <span>
                                      Time:{" "}
                                      {assignment.submission_time +
                                        (assignment.extended_minutes || 0) >=
                                      60
                                        ? `${Math.floor(
                                            (assignment.submission_time +
                                              (assignment.extended_minutes ||
                                                0)) /
                                              60
                                          )}h ${
                                            (assignment.submission_time +
                                              (assignment.extended_minutes ||
                                                0)) %
                                            60
                                          }m`
                                        : `${
                                            assignment.submission_time +
                                            (assignment.extended_minutes || 0)
                                          }m`}
                                      {assignment.extended_minutes > 0 && (
                                        <span className="text-green-600 ml-1">
                                          (+{assignment.extended_minutes}m
                                          extended)
                                        </span>
                                      )}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      Posted:{" "}
                                      {new Date(
                                        assignment.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {expandedAssignment === assignment._id ? (
                                    <FiChevronUp />
                                  ) : (
                                    <FiChevronDown />
                                  )}
                                </div>
                              </div>
                            </div>

                            {expandedAssignment === assignment._id && (
                              <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <Link
                                  to={`/student/class/${classId}/${assignment._id}/${assignment.type}/answer`}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                >
                                  <FiCode className="mr-2" />
                                  {isCompleted
                                    ? "View Submission"
                                    : isOngoing
                                    ? "Continue Assignment"
                                    : `Start ${
                                        assignment.type
                                          .charAt(0)
                                          .toUpperCase() +
                                        assignment.type.slice(1)
                                      }`}
                                </Link>
                                {isCompleted && answer?.grade && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-medium">Score: </span>
                                    <span>
                                      {answer.grade}% -{" "}
                                      {getGradeLetter(answer.grade)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No assignments available.</p>
                  )}

                  {totalAssignmentPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <button
                        onClick={() =>
                          handlePageChange(
                            "assignments",
                            currentPage.assignments - 1
                          )
                        }
                        disabled={currentPage.assignments === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage.assignments === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <FiChevronLeft className="inline mr-1" /> Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage.assignments} of {totalAssignmentPages}
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(
                            "assignments",
                            currentPage.assignments + 1
                          )
                        }
                        disabled={
                          currentPage.assignments === totalAssignmentPages
                        }
                        className={`px-3 py-1 rounded-md ${
                          currentPage.assignments === totalAssignmentPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next <FiChevronRight className="inline ml-1" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-4">
              {isSectionRestricted("grades") ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium mb-4">
                    This section has been restricted by the instructor.
                  </p>
                  <button
                    onClick={() => setActiveTab("classroom_overview")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Classroom Overview
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                      Your Grades
                    </h2>
                    {grades.student_grade ? (
                      <div className="space-y-4">
                        {renderGradeBreakdown("midterm")}
                        {renderGradeBreakdown("final")}

                        {/* Total Grade */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">
                              Overall Grade:
                            </span>
                            <span className="text-blue-600 font-bold text-xl">
                              {grades.student_grade?.grade || 0}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                            <div
                              className="bg-blue-600 h-4 rounded-full"
                              style={{
                                width: `${grades.student_grade?.grade || 0}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-right text-sm text-gray-500 mt-1">
                            {getGradeLetter(grades.student_grade?.grade || 0)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No grades available yet.</p>
                    )}
                  </div>

                  <div className="overflow-x-auto mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Assignment Details
                    </h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Term
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {answers.length > 0 ? (
                          answers.filter((a) => a.submitted_at)
                            .map((answer) => {
                              const assignment =
                                answer.main_activity 
                              const term = assignment?.grading_breakdown;
                              const totalPoints = (
                                assignment.question || []
                              ).reduce((acc, q) => acc + (q.points || 0), 0);
                              const earnedPoints = (
                                answer.answers || []
                              ).reduce((acc, q) => acc + (q.points || 0), 0);
                              const percentage =
                                totalPoints > 0
                                  ? Math.round(
                                      (earnedPoints / totalPoints) * 100
                                    )
                                  : 0;

                              return (
                                <tr
                                  key={answer._id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-4 whitespace-nowrap capitalize">
                                    {term}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getActivityTypeColor(
                                        assignment.activity_type
                                      )}`}
                                    >
                                      {assignment.activity_type.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap font-medium">
                                    {assignment.title}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span className="mr-2">
                                        {earnedPoints}/{totalPoints}
                                      </span>
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full ${
                                            percentage >= 70
                                              ? "bg-green-500"
                                              : percentage >= 50
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                          }`}
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="ml-2 text-xs text-gray-500">
                                        {percentage}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <Link
                                      to={`/student/class/${classId}/${assignment._id}/${assignment.activity_type}/view_answer`}
                                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                    >
                                      View
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-4 text-center text-gray-500"
                            >
                              No submitted assignments yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "practice_with_ai" && (
            <div className="space-y-6">
              {isSectionRestricted("practice") ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium mb-4">
                    This section has been restricted by the instructor.
                  </p>
                  <button
                    onClick={() => setActiveTab("classroom_overview")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Classroom Overview
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <Link to={`/student/class/${classId}/practice_with_ai`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full py-2 px-4 rounded">
                      Practice with AI
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "classroom_overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Classroom Overview</h2>

              {renderActivityCounts()}

              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Grading System
                </h2>
                {classroom.gradingSystem || grades.gradingSystem ? (
                  <div className="space-y-4">
                    {renderGradingSystem("midterm")}
                    {renderGradingSystem("final")}
                    <div className="mt-4 border-t pt-2 text-blue-600 font-bold text-xl">
                      🔢 Total: 100%
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Grading system not available</p>
                )}
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">Students</h3>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classroom.students?.length > 0 ? (
                      classroom.students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {student.first_name} {student.middle_name}{" "}
                            {student.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              active
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No students in this classroom
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                {classroom.classroom?.instructor ? (
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {classroom.classroom.instructor.first_name}{" "}
                          {classroom.classroom.instructor.middle_name}{" "}
                          {classroom.classroom.instructor.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {classroom.classroom.instructor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">
                    Instructor information not available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
