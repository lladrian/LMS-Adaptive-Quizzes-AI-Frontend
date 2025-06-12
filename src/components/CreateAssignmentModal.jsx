import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiClock,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiEdit2,
} from "react-icons/fi";
import { addActivity } from "../utils/authService";
import AIPromptModal from "./AIPromptModal";

const CreateAssignmentModal = ({ isOpen, onClose, classId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    type: "quiz",
    timeLimit: 60,
    totalPoints: 0,
    questions: [],
    grading_breakdown: "midterm",
  });

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    points: 1,
    expectedOutput: "",
  });

  const steps = [
    { id: 1, name: "Activity Details" },
    { id: 2, name: "Add Questions" },
    { id: 3, name: "Review & Submit" },
  ];

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    if (!newQuestion.text) {
      setError("Question text is required");
      return;
    }

    setError(null);

    const questionToAdd = {
      id: Date.now(),
      text: newQuestion.text,
      points: parseInt(newQuestion.points),
      expectedOutput: newQuestion.expectedOutput,
    };

    setAssignmentData((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToAdd],
      totalPoints: prev.totalPoints + parseInt(newQuestion.points),
    }));

    setNewQuestion({
      text: "",
      points: 1,
      expectedOutput: "",
    });
    setEditingQuestionId(null);
    setShowAIPromptModal(false);
  };

  const removeQuestion = (questionId) => {
    const question = assignmentData.questions.find((q) => q.id === questionId);
    setAssignmentData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
      totalPoints: prev.totalPoints - question.points,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!assignmentData.title || !assignmentData.timeLimit) {
      setError("Title and time limit are required");
      setIsSubmitting(false);
      return;
    }

    if (assignmentData.questions.length === 0) {
      setError("Please add at least one question");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await addActivity(
        classId,
        assignmentData.questions,
        assignmentData.timeLimit,
        assignmentData.title,
        assignmentData.description,
        assignmentData.type,
        assignmentData.type === "exam"
          ? assignmentData.grading_breakdown
          : undefined
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      setAssignmentData({
        title: "",
        description: "",
        type: "quiz",
        timeLimit: 60,
        totalPoints: 0,
        questions: [],
        grading_breakdown: "midterm",
      });

      onClose();
      setCurrentStep(1);

      if (onSuccess && result.data) {
        onSuccess({
          ...result.data,
          title: assignmentData.title,
          description: assignmentData.description,
          type: assignmentData.type,
          submission_time: assignmentData.timeLimit,
          points: assignmentData.totalPoints,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Creation error:", err);
      setError(err.message || "Failed to create activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!assignmentData.title || !assignmentData.timeLimit) {
        setError("Please fill all required fields");
        return;
      }
      if (assignmentData.type === "exam" && !assignmentData.grading_breakdown) {
        setError("Please select grading breakdown for exams");
        return;
      }
    } else if (currentStep === 2 && assignmentData.questions.length === 0) {
      setError("Please add at least one question");
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const handleOutputSelect = (output) => {
    setNewQuestion((prev) => ({ ...prev, expectedOutput: output }));
    setShowAIPromptModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black/50 p-4 z-50">
      <div className="flex items-stretch gap-4 w-full max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg flex-1 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Activity
              </h2>
              <div className="flex mt-2">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span
                      className={`ml-2 ${
                        currentStep === step.id
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                    {step.id < steps.length && (
                      <div className="w-8 h-px bg-gray-300 mx-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Activity Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={assignmentData.title}
                      onChange={handleAssignmentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      placeholder="Midterm Exam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={assignmentData.description}
                      onChange={handleAssignmentChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Instructions for students..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        name="type"
                        value={assignmentData.type}
                        onChange={handleAssignmentChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="quiz">Quiz</option>
                        <option value="exam">Exam</option>
                        <option value="programming">Programming</option>
                      </select>
                    </div>

                    {assignmentData.type === "exam" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grading Breakdown *
                        </label>
                        <select
                          name="grading_breakdown"
                          value={assignmentData.grading_breakdown}
                          onChange={handleAssignmentChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="midterm">Midterm</option>
                          <option value="final">Final</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Limit (minutes) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="timeLimit"
                          value={assignmentData.timeLimit}
                          onChange={handleAssignmentChange}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                          required
                        />
                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Questions</h3>

                {assignmentData.questions.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {assignmentData.questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {editingQuestionId === question.id ? (
                          <div className="space-y-4">
                            <textarea
                              value={newQuestion.text}
                              onChange={handleQuestionChange}
                              name="text"
                              rows="3"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Question text"
                            />
                            <textarea
                              value={newQuestion.expectedOutput}
                              onChange={handleQuestionChange}
                              name="expectedOutput"
                              rows="2"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Sample expected output"
                            />
                            <div className="flex justify-between">
                              <input
                                type="number"
                                value={newQuestion.points}
                                onChange={handleQuestionChange}
                                name="points"
                                min="1"
                                className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedQuestions =
                                      assignmentData.questions.map((q) =>
                                        q.id === question.id
                                          ? {
                                              ...q,
                                              text: newQuestion.text,
                                              expectedOutput:
                                                newQuestion.expectedOutput,
                                              points: parseInt(
                                                newQuestion.points
                                              ),
                                            }
                                          : q
                                      );
                                    setAssignmentData((prev) => ({
                                      ...prev,
                                      questions: updatedQuestions,
                                      totalPoints: updatedQuestions.reduce(
                                        (sum, q) => sum + q.points,
                                        0
                                      ),
                                    }));
                                    setEditingQuestionId(null);
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingQuestionId(null)}
                                  className="px-3 py-1 bg-gray-200 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <div className="flex justify-between items-start w-full">
                                <h4 className="font-medium">
                                  Question {qIndex + 1} ({question.points} point
                                  {question.points !== 1 ? "s" : ""})
                                </h4>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewQuestion({
                                        text: question.text,
                                        points: question.points,
                                        expectedOutput: question.expectedOutput,
                                      });
                                      setEditingQuestionId(question.id);
                                    }}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 p-1"
                                    title="Edit question"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeQuestion(question.id)}
                                    className="cursor-pointer text-red-600 hover:text-red-800 p-1"
                                    title="Delete question"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-700 mt-1">
                                {question.text}
                              </p>
                              {question.expectedOutput && (
                                <>
                                  <h5 className="font-medium mt-2 text-sm">
                                    Sample Expected Output:
                                  </h5>
                                  <pre className="text-gray-700 bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                                    {question.expectedOutput}
                                  </pre>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-6">
                    No questions added yet
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Add New Question</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text *
                      </label>
                      <textarea
                        name="text"
                        value={newQuestion.text}
                        onChange={handleQuestionChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Example: Given an array of integers nums, find the smallest index i such that nums[i] == i. If no such index exists, return -1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample Expected Output (Optional)
                      </label>
                      <textarea
                        name="expectedOutput"
                        value={newQuestion.expectedOutput}
                        onChange={handleQuestionChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Example: Input: [0,2,3,4,5] → Output: 0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points *
                      </label>
                      <input
                        type="number"
                        name="points"
                        value={newQuestion.points}
                        onChange={handleQuestionChange}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAIPromptModal(true)}
                        className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <FiMessageSquare className="mr-2" /> Generate Questions
                      </button>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <FiPlus className="mr-2" /> Add Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Review Assignment
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Activity Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{assignmentData.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium capitalize">
                          {assignmentData.type}
                          {assignmentData.type === "exam" &&
                            ` (${assignmentData.grading_breakdown})`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time Limit</p>
                        <p className="font-medium">
                          {assignmentData.timeLimit} minutes
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Points</p>
                        <p className="font-medium">
                          {assignmentData.totalPoints}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Questions ({assignmentData.questions.length})
                    </h4>
                    <div className="space-y-4">
                      {assignmentData.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between">
                            <h5 className="font-medium">
                              Question {index + 1} ({question.points} points)
                            </h5>
                          </div>
                          <p className="text-gray-700 mt-1">{question.text}</p>
                          {question.expectedOutput && (
                            <>
                              <h6 className="font-medium mt-2 text-sm">
                                Sample Expected Output:
                              </h6>
                              <pre className="text-gray-700 bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                                {question.expectedOutput}
                              </pre>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <FiChevronLeft className="mr-2" /> Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Next <FiChevronRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Activity"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        {showAIPromptModal && (
          <AIPromptModal
            isOpen={showAIPromptModal}
            onClose={() => setShowAIPromptModal(false)}
            onSelectQuestion={(question) => {
              setNewQuestion({
                text: question.text,
                points: newQuestion.points,
                expectedOutput: question.expectedOutput,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
