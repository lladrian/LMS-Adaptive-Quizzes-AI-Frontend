import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiCode } from "react-icons/fi";

const CreateAssignmentPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    type: "quiz",
    dueDate: "",
    timeLimit: 60,
    totalPoints: 100,
    questions: [],
    isPublished: false,
  });

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "multiple-choice",
    points: 1,
    options: ["", "", "", ""],
    correctAnswer: null,
    correctShortAnswer: "",
    // Programming question specific fields
    language: "javascript",
    starterCode: "",
    testCases: [{ input: "", output: "", isPublic: true }],
  });

  // Available programming languages
  const programmingLanguages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
  ];

  // Handle changes to assignment details
  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes to new question fields
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new question to the assignment
  const addQuestion = () => {
    // Validate question based on type
    if (!newQuestion.text) {
      setError("Question text is required");
      return;
    }

    if (newQuestion.type === "programming") {
      if (!newQuestion.starterCode.trim()) {
        setError("Starter code is required for programming questions");
        return;
      }
      if (newQuestion.testCases.length === 0) {
        setError("At least one test case is required");
        return;
      }
      for (const testCase of newQuestion.testCases) {
        if (!testCase.input.trim() || !testCase.output.trim()) {
          setError("All test cases must have both input and output");
          return;
        }
      }
    } else if (
      newQuestion.type !== "short-answer" &&
      !newQuestion.correctAnswer
    ) {
      setError("Please select the correct answer");
      return;
    } else if (
      newQuestion.type === "short-answer" &&
      !newQuestion.correctShortAnswer
    ) {
      setError("Please provide the correct answer");
      return;
    }

    setError(null);

    // Prepare question object based on type
    const questionToAdd = {
      id: Date.now(),
      text: newQuestion.text,
      type: newQuestion.type,
      points: parseInt(newQuestion.points),
    };

    // Add type-specific fields
    if (newQuestion.type === "programming") {
      questionToAdd.language = newQuestion.language;
      questionToAdd.starterCode = newQuestion.starterCode;
      questionToAdd.testCases = newQuestion.testCases;
    } else if (newQuestion.type !== "short-answer") {
      questionToAdd.options = newQuestion.options.filter(
        (opt) => opt.trim() !== ""
      );
      questionToAdd.correctAnswer = newQuestion.correctAnswer;
    } else {
      questionToAdd.correctShortAnswer = newQuestion.correctShortAnswer;
    }

    // Add question to assignment
    setAssignmentData((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToAdd],
      totalPoints: prev.totalPoints + parseInt(newQuestion.points),
    }));

    // Reset new question form
    setNewQuestion({
      text: "",
      type: "multiple-choice",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: null,
      correctShortAnswer: "",
      language: "javascript",
      starterCode: "",
      testCases: [{ input: "", output: "", isPublic: true }],
    });
  };

  // Remove a question from the assignment
  const removeQuestion = (questionId) => {
    const question = assignmentData.questions.find((q) => q.id === questionId);
    setAssignmentData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
      totalPoints: prev.totalPoints - question.points,
    }));
  };

  // Submit the assignment
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Assignment created:", assignmentData);

      // Navigate back to assignments list on success
      navigate(`/instructor/class/${classId}/`);
    } catch (err) {
      setError("Failed to create assignment. Please try again.");
      console.error("Creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link
          to={`/instructor/class/${classId}/`}
          className="p-2 mr-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h2 className="text-xl font-semibold text-gray-800">
          Create New Assignment
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assignment Details Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Assignment Details</h3>

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

              <div>
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
              </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Points: {assignmentData.totalPoints}
              </label>
            </div>
          </div>
        </div>

        {/* Questions Section */}
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
                            {question.type === "programming" &&
                              ` (${question.language})`}
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

                      {question.type === "programming" && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">
                              Starter Code:
                            </h5>
                            <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                              {question.starterCode}
                            </pre>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">
                              Test Cases:
                            </h5>
                            <div className="space-y-2">
                              {question.testCases.map((testCase, tIndex) => (
                                <div
                                  key={tIndex}
                                  className="bg-gray-50 p-2 rounded text-sm"
                                >
                                  <div className="grid grid-cols-2 gap-2 mb-1">
                                    <div>
                                      <span className="text-gray-500">
                                        Input:
                                      </span>
                                      <pre className="bg-white p-1 rounded">
                                        {testCase.input}
                                      </pre>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Expected Output:
                                      </span>
                                      <pre className="bg-white p-1 rounded">
                                        {testCase.output}
                                      </pre>
                                    </div>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      testCase.isPublic
                                        ? "bg-green-100 text-green-800"
                                        : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {testCase.isPublic ? "Public" : "Private"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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

          {/* Add New Question Form */}
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type *
                  </label>
                  <select
                    name="type"
                    value={newQuestion.type}
                    onChange={handleQuestionChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="programming">Programming Question</option>
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
                  />
                </div>
              </div>

              {/* Programming Question */}
              {newQuestion.type === "programming" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programming Language *
                    </label>
                    <select
                      name="language"
                      value={newQuestion.language}
                      onChange={handleQuestionChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {programmingLanguages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

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

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <Link
            to={`/instructor/class/${classId}/assignments`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting || assignmentData.questions.length === 0}
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
              "Create Assignment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignmentPage;
