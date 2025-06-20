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
  allAnswerExamSpecificStudentSpecificClassroom,
  allAnswerQuizSpecificStudentSpecificClassroom,
  allAnswerActivitySpecificStudentSpecificClassroom,
  leaveClassroom,
  computeStudentGrade,
  allAnswerAssignmentSpecificStudentSpecificClassroom,
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
    quizzes: [],
    exams: [],
    activities: [],
    assignments: [],
  });
  const [grades, setGrade] = useState({});
  const [answers, setAnswer] = useState([]);
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
      const [
        classResult,
        examResult,
        quizResult,
        activityResult,
        assignmentResult,
        gradeResult,
      ] = await Promise.all([
        specificClassroom(classId),
        allAnswerExamSpecificStudentSpecificClassroom(classId, studentId),
        allAnswerQuizSpecificStudentSpecificClassroom(classId, studentId),
        allAnswerActivitySpecificStudentSpecificClassroom(classId, studentId),
        allAnswerAssignmentSpecificStudentSpecificClassroom(classId, studentId),
        computeStudentGrade(classId, studentId),
      ]);

      if (classResult.success) {
        setClassroom((prev) => ({
          ...prev,
          ...classResult.data.data,
          assignments: [
            ...(classResult.data.data.exams || []),
            ...(classResult.data.data.quizzes || []),
            ...(classResult.data.data.activities || []),
            ...(classResult.data.data.assignments || []),
          ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        }));
        setRestrictedSections(
          classResult.data.data.classroom?.restricted_sections || []
        );
      }

      // Combine all answers including assignments
      if (
        examResult.success &&
        quizResult.success &&
        activityResult.success &&
        assignmentResult.success
      ) {
        setAnswer(
          [
            ...(examResult.data.data || []),
            ...(quizResult.data.data || []),
            ...(activityResult.data.data || []),
            ...(assignmentResult.data.data || []),
          ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        );
      }

      if (gradeResult.success) {
        setGrade(gradeResult.data.data);
      }
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast.error("Failed to fetch classroom data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssignments = () => {
    return (
      classroom.assignments?.filter((assignment) => {
        const isAnswered = answers.some(
          (ans) =>
            (ans?.quiz?._id === assignment?._id ||
              ans?.exam?._id === assignment?._id ||
              ans?.activity?._id === assignment?._id ||
              ans?.assignment?._id === assignment?._id) &&
            ans?.submitted_at
        );

        const isOngoing = answers.some(
          (ans) =>
            (ans?.quiz?._id === assignment?._id ||
              ans?.exam?._id === assignment?._id ||
              ans?.activity?._id === assignment?._id ||
              ans?.assignment?._id === assignment?._id) &&
            ans?.opened_at &&
            !ans?.submitted_at
        );

        if (selectedStatus === "all") return true;
        if (selectedStatus === "not yet") return !isAnswered && !isOngoing;
        if (selectedStatus === "ongoing") return isOngoing;
        if (selectedStatus === "completed") return isAnswered;

        return true;
      }) || []
    );
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
                  <div className="mb-4">
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
                  </div>

                  {currentAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {currentAssignments.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
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
                                <span
                                  className={`px-2 py-1 rounded-full text-xs capitalize ${
                                    assignment.type === "quiz"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : assignment.type === "exam"
                                      ? "bg-green-100 text-green-800"
                                      : assignment.type === "assignment"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {assignment.type} -{" "}
                                  {assignment.grading_breakdown}
                                </span>
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
                                    {/* {assignment.submission_time || 0} */}
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
                              {expandedAssignment === assignment._id ? (
                                <FiChevronUp />
                              ) : (
                                <FiChevronDown />
                              )}
                            </div>
                          </div>

                          {expandedAssignment === assignment._id && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                              <Link
                                to={`/student/class/${classId}/${assignment._id}/${assignment.type}/answer`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                              >
                                <FiCode className="mr-2" />
                                {assignment.type === "quiz"
                                  ? "Take Quiz"
                                  : assignment.type === "exam"
                                  ? "Take Exam"
                                  : assignment.type === "assignment"
                                  ? "Submit Assignment"
                                  : "Take Activity"}
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
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
                      <div className="space-y-2 text-lg font-semibold text-gray-700">
                        <div>
                          📘 Quiz: {grades.quiz?.earnedPoints || 0}/
                          {grades.quiz?.totalPoints || 0} ={" "}
                          {grades.quiz?.quiz || 0}/
                          {classroom.classroom?.grading_system?.quiz || 0}
                        </div>
                        <div>
                          📝 Assignment: {grades.assignment?.earnedPoints || 0}/
                          {grades.assignment?.totalPoints || 0} ={" "}
                          {grades.assignment?.assignment || 0}/
                          {classroom.classroom?.grading_system?.assignment || 0}
                        </div>
                        <div>
                          🎯 Laboratory Activity:{" "}
                          {grades.activity?.earnedPoints || 0}/
                          {grades.activity?.totalPoints || 0} ={" "}
                          {grades.activity?.activity || 0}/
                          {classroom.classroom?.grading_system?.activity || 0}
                        </div>
                        <div>
                          📚 Midterm: {grades.midterm?.earnedPoints || 0}/
                          {grades.midterm?.totalPoints || 0} ={" "}
                          {grades.midterm?.midterm || 0}/
                          {classroom.classroom?.grading_system?.midterm || 0}
                        </div>
                        <div>
                          📖 Final: {grades.final?.earnedPoints || 0}/
                          {grades.final?.totalPoints || 0} ={" "}
                          {grades.final?.final || 0}/
                          {classroom.classroom?.grading_system?.final || 0}
                        </div>
                        <div className="mt-4 border-t pt-2 text-blue-600 font-bold text-xl">
                          🔢 Total: {grades.student_grade?.grade || 0}/100
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No grades available yet.</p>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
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
                          answers
                            .filter((a) => a.submitted_at)
                            .map((answer) => {
                              const assignment =
                                answer.quiz ||
                                answer.exam ||
                                answer.activity ||
                                answer.assignment;
                              return (
                                <tr key={answer._id}>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        assignment.type === "quiz"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : assignment.type === "exam"
                                          ? "bg-green-100 text-green-800"
                                          : assignment.type === "assignment"
                                          ? "bg-purple-100 text-purple-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {assignment.type.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap font-medium">
                                    {assignment.title}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {(answer.answers || []).reduce(
                                      (acc, q) => acc + (q.points || 0),
                                      0
                                    )}
                                    /
                                    {(assignment.question || []).reduce(
                                      (acc, q) => acc + (q.points || 0),
                                      0
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <Link
                                      to={`/student/class/${classId}/${assignment._id}/${assignment.type}/view_answer`}
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
                              colSpan="4"
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Students</h3>
                  <p className="text-2xl font-bold">
                    {classroom.students?.length || 0}
                  </p>
                </div>

                <div className="bg-cyan-100 text-cyan-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Assignments</h3>
                  <p className="text-2xl font-bold">
                    {classroom.assignments?.length || 0}
                  </p>
                </div>

                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Quizzes</h3>
                  <p className="text-2xl font-bold">
                    {classroom.quizzes?.length || 0}
                  </p>
                </div>

                <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Exams</h3>
                  <p className="text-2xl font-bold">
                    {classroom.exams?.length || 0}
                  </p>
                </div>

                <div className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Materials</h3>
                  <p className="text-2xl font-bold">
                    {classroom.materials?.length || 0}
                  </p>
                </div>

                <div className="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Activities</h3>
                  <p className="text-2xl font-bold">
                    {classroom.activities?.length || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Grading System
                </h2>
                {classroom.classroom?.grading_system ? (
                  <div className="space-y-2 text-lg font-semibold text-gray-700">
                    <div>
                      📘 Quiz: {classroom.classroom.grading_system.quiz}%
                    </div>
                    <div>
                      📝 Assignment:{" "}
                      {classroom.classroom.grading_system.assignment}%
                    </div>
                    <div>
                      🎯 Activity: {classroom.classroom.grading_system.activity}
                      %
                    </div>
                    <div>
                      📚 Midterm: {classroom.classroom.grading_system.midterm}%
                    </div>
                    <div>
                      📖 Final: {classroom.classroom.grading_system.final}%
                    </div>
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
