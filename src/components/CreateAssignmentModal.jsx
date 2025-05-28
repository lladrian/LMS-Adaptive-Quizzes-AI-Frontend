import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { addQuiz } from "../utils/authService";

const CreateAssignmentModal = ({ isOpen, onClose, classId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    type: "quiz",
    /*     dueDate: "", */
    timeLimit: 60,
    totalPoints: 100,
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "programming",
    points: 1,
    language: "javascript",
  });

  const programmingLanguages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    /*     { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" }, */
  ];

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
      type: newQuestion.type,
      points: parseInt(newQuestion.points),
      language: newQuestion.language,
    };

    setAssignmentData((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToAdd],
      totalPoints: prev.totalPoints + parseInt(newQuestion.points),
    }));

    // Reset new question form
    setNewQuestion({
      text: "",
      type: "programming",
      points: 1,
      language: "javascript",
    });
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
  
    if (assignmentData.questions.length === 0) {
      setError("Please add at least one question");
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Prepare the questions data for API - extract just the text
      const questionTexts = assignmentData.questions.map(q => q.text);
  
      const result = await addQuiz(
        classId,
        questionTexts, // Now sending array of strings
        assignmentData.timeLimit,
        assignmentData.title,
        assignmentData.description,
        assignmentData.totalPoints
      );
  
      if (!result.success) {
        throw new Error(result.error);
      }
  
      console.log("Assignment created:", result.data);
      onClose();
      setAssignmentData({
        title: "",
        description: "",
        type: "quiz",
        timeLimit: 60,
        totalPoints: 100,
        questions: [],
      });
      setCurrentStep(1);
    } catch (err) {
      setError(err.message || "Failed to create assignment. Please try again.");
      console.error("Creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !assignmentData.title ||
        /*      !assignmentData.dueDate || */
        !assignmentData.timeLimit
      ) {
        setError("Please fill all required fields");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
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
                    </select>
                  </div>

                  {/*       <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="dueDate"
                        value={assignmentData.dueDate}
                        onChange={handleAssignmentChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                        required
                      />
                      <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div> */}

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
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="flex justify-between items-start w-full">
                            <h4 className="font-medium">
                              Question {qIndex + 1} ({question.points} point
                              {question.points !== 1 ? "s" : ""})
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                                {question.type.replace("-", " ")}
                                {` (${question.language})`}
                              </span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <p className="text-gray-700 mt-1">{question.text}</p>
                        </div>
                      </div>
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
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter the question..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Programming Language *
                      </label>
                      <select
                        name="language"
                        value={newQuestion.language}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        {programmingLanguages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
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
                  </div>

                  {error && <div className="text-red-600 text-sm">{error}</div>}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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
              <h3 className="text-lg font-semibold mb-4">Review Assignment</h3>

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
                      </p>
                    </div>
                    {/*      <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">
                        {new Date(assignmentData.dueDate).toLocaleString()}
                      </p>
                    </div> */}
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
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                            {question.type.replace("-", " ")}
                            {` (${question.language})`}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{question.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          )}

          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Next <FiChevronRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
    </div>
  );
};

export default CreateAssignmentModal;
