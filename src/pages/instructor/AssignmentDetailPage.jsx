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
} from "react-icons/fi";
import {
  specificClassroom,
  allAnswerSpecificQuiz,
} from "../../utils/authService";
import { toast } from "react-toastify";

const SubmissionDetail = ({ submission, activityData, onClose }) => {
  if (!submission || !activityData) return null;

  // Calculate total possible points
  const totalPoints =
    activityData.question?.reduce((total, q) => total + (q.points || 0), 0) ||
    0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {submission.student}'s Submission
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium text-gray-700">
                Score: {submission.total_score || 0}/{totalPoints}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-gray-500">
                {Math.round((submission.total_score / totalPoints) * 100)}%
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

          {activityData.type === "quiz" && activityData.question && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Answers</h4>
              {activityData.question.map((question, index) => {
                const answer = submission.answers.find(
                  (a) => a.question_id === question._id
                );
                const isCorrect = answer?.is_correct;
                const pointsEarned = isCorrect ? question.points : 0;

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

                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Student's Answer:
                      </p>
                      <p className="text-gray-900">
                        {answer ? answer.answer : "No answer provided"}
                      </p>
                    </div>

                    <div className="mt-3">
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

                    {!isCorrect && question.correct_answer && (
                      <div className="mt-3 bg-blue-50 p-3 rounded-md border border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Correct Answer:
                        </p>
                        <p className="text-gray-900">
                          {question.correct_answer}
                        </p>
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
  const [activeTab, setActiveTab] = useState("overview");
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const [classroomResult, answersResult] = await Promise.all([
        specificClassroom(classId),
        allAnswerSpecificQuiz(assignmentId),
      ]);

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

        const combinedActivities = [...quizzes, ...exams];
        const activity = combinedActivities.find(
          (activity) => activity._id === assignmentId
        );
        setActivityData(activity || null);
      }

      if (answersResult.success) {
        const responseData = answersResult.data;
        let studentAnswers = [];

        // Handle different possible response structures
        if (Array.isArray(responseData)) {
          studentAnswers = responseData;
        } else if (Array.isArray(responseData.data)) {
          studentAnswers = responseData.data;
        } else if (Array.isArray(responseData.answers)) {
          studentAnswers = responseData.answers;
        }

        // In the fetchClasses function where you setSubmissions:
        setSubmissions(
          studentAnswers.map((answer) => ({
            id: answer._id,
            student: answer.student?.fullname || "Unknown Student",
            email: answer.student?.email || "No email",
            submitted: answer.submitted_at
              ? new Date(answer.submitted_at).toLocaleString()
              : "Not submitted",
            status: answer.submitted_at ? "submitted" : "missing",
            grade: answer.total_score || "Not graded", // Use the total_score from the answer
            answers: answer.answers || [],
            total_score: answer.total_score || 0, // Add total score
          }))
        );
      }
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
          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Assignment Navigation */}
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
            Submissions ({submissions.length})
          </button>
          {/*    <button
            onClick={() => setActiveTab("grades")}
            className={`px-6 py-3 font-medium ${
              activeTab === "grades"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Grades
          </button> */}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FiCalendar className="text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {activityData.submission_time >= 60
                        ? `${Math.floor(activityData.submission_time / 60)}h ${
                            activityData.submission_time % 60
                          }m`
                        : `${activityData.submission_time}m`}
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

            {/* Questions Section - Only for Quiz type */}
            {activityData.type === "quiz" && activityData.question && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                <div className="space-y-4">
                  {activityData.question.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FiHelpCircle className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Question {index + 1}
                        </p>
                        <p className="text-gray-700 mt-1">{question.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Points: {question.points}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "submissions" && (
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
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const totalPoints =
                      activityData.question?.reduce(
                        (total, q) => total + (q.points || 0),
                        0
                      ) || 0;
                    const percentage =
                      totalPoints > 0
                        ? Math.round(
                            (submission.total_score / totalPoints) * 100
                          )
                        : 0;

                    return (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {submission.student}
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
                            {submission.total_score}/{totalPoints}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentage}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="space-y-6">
            {/* Grades content remains the same */}
            {/* ... */}
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
    </div>
  );
};

export default AssignmentDetailPage;
