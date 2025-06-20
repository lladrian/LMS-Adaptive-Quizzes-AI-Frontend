import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiFileText,
  FiCalendar,
  FiUsers,
  FiDownload,
  FiArrowLeft,
  FiBarChart2,
  FiMessageSquare,
  FiEdit2,
  FiHelpCircle,
  FiX,
  FiMail,
  FiClock,
  FiLoader,
} from "react-icons/fi";
import {
  specificClassroom,
  allAnswerSpecificQuiz,
  allAnswerSpecificExam,
  allAnswerSpecificActivity,
  allAnswerSpecificAssignment,
  allStudentMissingAnswerSpecificQuiz,
  allStudentMissingAnswerSpecificExam,
  allStudentMissingAnswerSpecificActivity,
  allStudentMissingAnswerSpecificAssignment,
  extendActivityTime,
} from "../../utils/authService";
import { toast } from "react-toastify";
import EditActivityModal from "../../components/EditActivityModal";

const SubmissionDetail = ({ submission, activityData, onClose }) => {
  if (!submission || !activityData) return null;

  const totalPoints =
    activityData.question?.reduce((total, q) => total + (q.points || 0), 0) ||
    0;

  const totalScore = (submission.answers || []).reduce(
    (acc, q) => acc + (q.points || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {submission.first_name} {submission.middle_name}{" "}
              {submission.last_name}'s Submission
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium text-gray-700">
                Score: {totalScore || 0}/{totalPoints}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-gray-500">
                {Math.round((totalScore / totalPoints) * 100)}%
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Submission Details
            </h4>
            <p className="text-sm text-gray-500">
              Submitted on: {submission.submitted}
            </p>
            <p className="text-sm text-gray-500">Email: {submission.email}</p>
          </div>

          {activityData.question && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Answers</h4>
              {activityData.question.map((question, index) => {
                const answer = submission.answers.find(
                  (a) => a.questionId === question._id
                );
                const isCorrect = answer?.is_correct;
                const pointsEarned = answer?.points || 0;
                const isMultipleChoice = question.answer_type === "options";

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Question {index + 1}</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {pointsEarned}/{question.points} points
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{question.text}</p>

                    {isMultipleChoice ? (
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Student's Answer:
                          </p>
                          <p className="font-mono bg-gray-100 p-2 rounded">
                            {answer?.selected_option || "No answer provided"}
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Correct Answer:
                          </p>
                          <p className="font-mono bg-gray-100 p-2 rounded">
                            {question.correct_option}
                          </p>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isCorrect
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Student's Code:
                          </p>
                          {answer?.line_of_code ? (
                            <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto">
                              <code>{answer.line_of_code}</code>
                            </pre>
                          ) : (
                            <p className="text-gray-500 italic">
                              No code submitted
                            </p>
                          )}
                        </div>

                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Expected Output:
                          </p>
                          <p className="font-mono bg-gray-100 p-2 rounded">
                            {question.expected_output}
                          </p>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isCorrect
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignmentDetailPage = () => {
  const { classId, assignmentId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [missingStudents, setMissingStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState("");
  const [isExtending, setIsExtending] = useState(false);
  const [viewFilter, setViewFilter] = useState("all");
  const [currentQuestionPage, setCurrentQuestionPage] = useState(1);
  const questionsPerPage = 5;

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const classroomResult = await specificClassroom(classId);
      const answersQuizResult = await allAnswerSpecificQuiz(assignmentId);
      const answersExamResult = await allAnswerSpecificExam(assignmentId);
      const answersActivityResult = await allAnswerSpecificActivity(
        assignmentId
      );
      const answersAssignmentResult = await allAnswerSpecificAssignment(
        assignmentId
      );

      const missingQuizResult = await allStudentMissingAnswerSpecificQuiz(
        assignmentId
      );
      const missingExamResult = await allStudentMissingAnswerSpecificExam(
        assignmentId
      );
      const missingActivityResult =
        await allStudentMissingAnswerSpecificActivity(assignmentId);
      const missingAssignmentResult =
        await allStudentMissingAnswerSpecificAssignment(assignmentId);

      if (classroomResult.success) {
        const classroom = classroomResult.data.data;
        if (!classroom) return;

        const quizzes = (classroom.quizzes || []).map((q) => ({
          ...q,
          type: "quiz",
        }));

        const exams = (classroom.exams || []).map((e) => ({
          ...e,
          type: "exam",
        }));

        const activities = (classroom.activities || []).map((e) => ({
          ...e,
          type: "activity",
        }));

        const assignments = (classroom.assignments || []).map((e) => ({
          ...e,
          type: "assignment",
        }));

        const combinedActivities = [
          ...quizzes,
          ...exams,
          ...activities,
          ...assignments,
        ];

        const activity = combinedActivities.find(
          (activity) => activity._id === assignmentId
        );
        setActivityData(activity || null);
      }

      // Handle all types of answers
      const responseData =
        answersQuizResult.data ||
        answersExamResult.data ||
        answersActivityResult.data ||
        answersAssignmentResult.data;

      let studentAnswers = [];

      if (Array.isArray(responseData)) {
        studentAnswers = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        studentAnswers = responseData.data;
      } else if (responseData && Array.isArray(responseData.answers)) {
        studentAnswers = responseData.answers;
      }

      setSubmissions(
        studentAnswers.map((answer) => ({
          id: answer._id,
          first_name: answer.student?.first_name || "",
          middle_name: answer.student?.middle_name || "",
          last_name: answer.student?.last_name || "",
          email: answer.student?.email || "No email",
          submitted: answer.submitted_at
            ? new Date(answer.submitted_at).toLocaleString()
            : "Not submitted",
          status: answer.submitted_at ? "submitted" : "missing",
          grade: answer.total_score || "Not graded",
          answers: answer.answers || [],
          total_score: answer.total_score || 0,
        }))
      );

      // Handle missing students for all types
      const missingStudentsData =
        missingQuizResult.data?.data ||
        missingExamResult.data?.data ||
        missingActivityResult.data?.data ||
        missingAssignmentResult.data?.data ||
        [];

      setMissingStudents(missingStudentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch classroom or answers");
    } finally {
      setIsLoading(false);
    }
  }, [classId, assignmentId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleExtendTime = async () => {
    if (!extendMinutes || isNaN(extendMinutes)) {
      toast.error("Please enter valid minutes");
      return;
    }

    setIsExtending(true);
    try {
      const result = await extendActivityTime(
        assignmentId,
        activityData.type,
        parseInt(extendMinutes)
      );

      if (result.success) {
        toast.success(`Time extended by ${extendMinutes} minutes`);
        setActivityData((prev) => ({
          ...prev,
          extended_minutes: prev.extended_minutes + parseInt(extendMinutes),
        }));
        setShowExtendModal(false);
        setExtendMinutes("");
      }
    } catch (error) {
      toast.error(error.message || "Failed to extend time");
    } finally {
      setIsExtending(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (viewFilter === "all") return true;
    if (viewFilter === "submitted") return sub.status === "submitted";
    if (viewFilter === "missing") return sub.status === "missing";
    return true;
  });

  const filteredMissingStudents =
    viewFilter === "all" || viewFilter === "missing" ? missingStudents : [];

  // Calculate paginated questions
  const indexOfLastQuestion = currentQuestionPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions =
    activityData?.question?.slice(indexOfFirstQuestion, indexOfLastQuestion) ||
    [];
  const totalQuestionPages = Math.ceil(
    (activityData?.question?.length || 0) / questionsPerPage
  );

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!activityData) return <div className="p-6">Assignment not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to={`/instructor/class/${classId}`}
            className="p-2 mr-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft />
          </Link>
          <h2 className="text-lg font-semibold">{activityData.title}</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Edit activity"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => setShowExtendModal(true)}
            className="cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Extend time"
          >
            <FiClock />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
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
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-3 font-medium ${
              activeTab === "submissions"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Submissions ({submissions.length + missingStudents.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiClock className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Time Limit</p>
                    <p className="font-medium">
                      {Math.floor(
                        (activityData.submission_time +
                          (activityData.extended_minutes || 0)) /
                          60
                      )}
                      h{" "}
                      {(activityData.submission_time +
                        (activityData.extended_minutes || 0)) %
                        60}
                      m
                      {activityData.extended_minutes > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          (+{activityData.extended_minutes}m extended)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiFileText className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">
                      {activityData.type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiBarChart2 className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="font-medium">
                      {activityData.question?.reduce(
                        (total, q) => total + (q.points || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{activityData.description}</p>
            </div>

            {activityData.question && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                <div className="space-y-4">
                  {currentQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FiHelpCircle className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Question {indexOfFirstQuestion + index + 1}
                        </p>
                        <p className="text-gray-700 mt-1">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Points: {question.points}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {totalQuestionPages > 1 && (
                  <div className="flex justify-baseline mt-6">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentQuestionPage((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={currentQuestionPage === 1}
                        className={`p-2 rounded-md ${
                          currentQuestionPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: totalQuestionPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentQuestionPage(page)}
                          className={`w-10 h-10 rounded-md ${
                            currentQuestionPage === page
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentQuestionPage((prev) =>
                            Math.min(prev + 1, totalQuestionPages)
                          )
                        }
                        disabled={currentQuestionPage === totalQuestionPages}
                        className={`p-2 rounded-md ${
                          currentQuestionPage === totalQuestionPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "submissions" && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewFilter("all")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewFilter === "all"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  All ({submissions.length + missingStudents.length})
                </button>
                <button
                  onClick={() => setViewFilter("submitted")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewFilter === "submitted"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Submitted (
                  {submissions.filter((s) => s.status === "submitted").length})
                </button>
                <button
                  onClick={() => setViewFilter("missing")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewFilter === "missing"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Missing (
                  {missingStudents.length +
                    submissions.filter((s) => s.status === "missing").length}
                  )
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.length > 0 &&
                    filteredSubmissions.map((submission) => {
                      const totalPoints =
                        activityData.question?.reduce(
                          (total, q) => total + (q.points || 0),
                          0
                        ) || 0;

                      const totalScore = (submission.answers || []).reduce(
                        (acc, q) => acc + (q.points || 0),
                        0
                      );
                      const percentage =
                        totalPoints > 0
                          ? Math.round((totalScore / totalPoints) * 100)
                          : 0;

                      return (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {submission.first_name} {submission.middle_name}{" "}
                              {submission.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                submission.status === "submitted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {submission.status}
                            </span>
                            <div className="text-sm text-gray-500">
                              {submission.submitted}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">
                              {totalScore}/{totalPoints}
                            </div>
                            <div className="text-sm text-gray-500">
                              {percentage}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {submission.status === "submitted" ? (
                              <button
                                onClick={() =>
                                  setSelectedSubmission(submission)
                                }
                                className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                              >
                                View Details
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}

                  {filteredMissingStudents.length > 0 &&
                    filteredMissingStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {student.first_name} {student.middle_name}{" "}
                            {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Missing
                          </span>
                          <div className="text-sm text-gray-500">
                            Not submitted
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">
                            0/
                            {activityData.question?.reduce(
                              (total, q) => total + (q.points || 0),
                              0
                            ) || 0}
                          </div>
                          <div className="text-sm text-gray-500">-</div>
                        </td>
                      </tr>
                    ))}

                  {filteredSubmissions.length === 0 &&
                    filteredMissingStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No {viewFilter === "all" ? "" : viewFilter}{" "}
                          submissions found
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          activityData={activityData}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {showEditModal && (
        <EditActivityModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          activity={activityData}
          onUpdateSuccess={fetchClasses}
          classId={classId}
        />
      )}

      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Extend Time Limit</h3>
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setExtendMinutes("");
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isExtending}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Minutes
                </label>
                <input
                  type="number"
                  min="1"
                  value={extendMinutes}
                  onChange={(e) =>
                    setExtendMinutes(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter minutes to extend"
                  disabled={isExtending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current extension: {activityData.extended_minutes || 0}{" "}
                  minutes
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowExtendModal(false);
                    setExtendMinutes("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={isExtending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendTime}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                  disabled={!extendMinutes || isExtending}
                >
                  {isExtending ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Extending...
                    </>
                  ) : (
                    "Extend Time"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailPage;
