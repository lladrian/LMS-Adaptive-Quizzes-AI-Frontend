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

const CreateAssignmentModal = ({
  isOpen,
  onClose,
  classId,
  onSuccess,
  progLanguage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    type: "activity",
    timeLimit: 60,
    totalPoints: 0,
    questions: [],
    grading_breakdown: "midterm",
  });

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    points: 1,
    expectedOutput: "",
    options: [],
    answer: "",
    type: "multiple_choice",
  });

  const steps = [
    { id: 1, name: "Activity Details" },
    { id: 2, name: "Add Questions" },
    { id: 3, name: "Review & Submit" },
  ];

  const activityTypes = [
    {
      value: "activity",
      label: "Laboratory Activity",
      description: "Graded laboratory task or coding exercise",
    },
    {
      value: "assignment",
      label: "Assignment",
      description: "Graded coding project or problem set",
    },
    { value: "quiz", label: "Quiz", description: "Short graded assessment" },
    { value: "exam", label: "Exam", description: "Major graded assessment" },
  ];

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index].text = value;
    setNewQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleAnswerChange = (letter) => {
    setNewQuestion((prev) => ({
      ...prev,
      answer: letter,
    }));
  };

  const addOption = () => {
    if (newQuestion.options.length >= 4) return;
    const letter = String.fromCharCode(65 + newQuestion.options.length);
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { letter, text: "" }],
    }));
  };

  const removeOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);

    const reletteredOptions = updatedOptions.map((opt, idx) => ({
      letter: String.fromCharCode(65 + idx),
      text: opt.text,
    }));

    let updatedAnswer = newQuestion.answer;
    if (newQuestion.answer === String.fromCharCode(65 + index)) {
      updatedAnswer = "";
    } else if (newQuestion.answer > String.fromCharCode(65 + index)) {
      updatedAnswer = String.fromCharCode(newQuestion.answer.charCodeAt(0) - 1);
    }

    setNewQuestion((prev) => ({
      ...prev,
      options: reletteredOptions,
      answer: updatedAnswer,
    }));
  };

  const handleQuestionSelect = (question) => {
    const questionToAdd = {
      id: Date.now(),
      text: question.text || question.problem || "",
      points: question.points || 1,
      expectedOutput: question.expectedOutput || question.output || "",
      options: question.options || [],
      answer: question.answer || "",
      type: question.type || "multiple_choice",
    };

    setAssignmentData((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToAdd],
      totalPoints: prev.totalPoints + (question.points || 1),
    }));

    setShowAIPromptModal(false);
  };

  const addQuestion = () => {
    if (!newQuestion.text) {
      setError("Question text is required");
      return;
    }

    if (newQuestion.type === "multiple_choice") {
      if (newQuestion.options.length < 2) {
        setError("Please add at least 2 options");
        return;
      }
      if (!newQuestion.answer) {
        setError("Please select the correct answer");
        return;
      }
    } else if (!newQuestion.expectedOutput) {
      setError("Expected output is required for programming questions");
      return;
    }

    setError(null);

    const questionToAdd = {
      id: Date.now(),
      text: newQuestion.text,
      points: parseInt(newQuestion.points),
      type: newQuestion.type,
      ...(newQuestion.type === "programming"
        ? {
            expectedOutput: newQuestion.expectedOutput,
            options: [],
            answer: "",
          }
        : {
            options: newQuestion.options,
            answer: newQuestion.answer,
            expectedOutput: "",
          }),
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
      options: [],
      answer: "",
      type: newQuestion.type,
    });

    setEditingQuestionId(null);
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

    if (!assignmentData.title) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (assignmentData.type !== "activity" && !assignmentData.timeLimit) {
      setError("Time limit is required");
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
        assignmentData.grading_breakdown
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      setAssignmentData({
        title: "",
        description: "",
        type: "activity",
        timeLimit: 60,
        totalPoints: 0,
        questions: [],
        grading_breakdown: "midterm",
      });

      onClose();
      setCurrentStep(1);

      if (result.data) {
        onSuccess(result.data.data);
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
      if (!assignmentData.title) {
        setError("Title is required");
        return;
      }
      if (!assignmentData.timeLimit) {
        setError("Time limit is required");
        return;
      }
      if (!assignmentData.grading_breakdown) {
        setError("Please select grading breakdown for exams");
        return;
      }
    } else if (currentStep === 2) {
      if (assignmentData.questions.length === 0) {
        setError("Please add at least one question");
        return;
      }
    }

    setError(null);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const renderQuestionForm = () => {
    if (newQuestion.type === "multiple_choice") {
      return (
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
              placeholder="Enter your question here"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options *
            </label>
            <div className="space-y-2">
              {newQuestion.options.map((option, index) => (
                <div key={option.letter} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correctAnswer-${editingQuestionId || "new"}`}
                    onChange={() => handleAnswerChange(option.letter)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Option ${option.letter}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              {newQuestion.options.length < 4 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  <FiPlus className="mr-1" size={14} />
                  Add Option
                </button>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Statement *
            </label>
            <textarea
              name="text"
              value={newQuestion.text}
              onChange={handleQuestionChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the programming problem statement"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Output *
            </label>
            <textarea
              name="expectedOutput"
              value={newQuestion.expectedOutput}
              onChange={handleQuestionChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the expected output for the problem"
              required
            />
          </div>
        </div>
      );
    }
  };

  const renderQuestionPreview = (question) => {
    return (
      <div className="w-full">
        <div className="flex justify-between items-start w-full">
          <h4 className="font-medium">
            {question.text} ({question.points} point
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
                  options: question.options.map((opt) => ({ ...opt })),
                  answer: question.answer,
                  type: question.type,
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
        {question.type === "multiple_choice" ? (
          <div className="space-y-2 mt-2">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className={`p-2 border rounded ${
                  question.answer === option.letter
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <span className="font-medium mr-2">{option.letter})</span>
                {option.text}
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-700 mt-1">{question.text}</p>
            {question.expectedOutput && (
              <>
                <h5 className="font-medium mt-2 text-sm">Expected Output:</h5>
                <pre className="text-gray-700 bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                  {question.expectedOutput}
                </pre>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderReviewQuestion = (question, index) => {
    return (
      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium">
          Question {index + 1} ({question.points} points)
        </h5>
        <p className="text-gray-700 mt-1">{question.text}</p>
        {question.type === "multiple_choice" ? (
          <div className="space-y-2 mt-3">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className={`p-2 border rounded ${
                  question.answer === option.letter
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <span className="font-medium mr-2">{option.letter})</span>
                {option.text}
              </div>
            ))}
          </div>
        ) : (
          question.expectedOutput && (
            <>
              <h6 className="font-medium mt-2 text-sm">Expected Output:</h6>
              <pre className="text-gray-700 bg-gray-50 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
                {question.expectedOutput}
              </pre>
            </>
          )
        )}
      </div>
    );
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

                <div className="space-y-6">
                  {/* Activity Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activityTypes.map((activity) => (
                        <div
                          key={activity.value}
                          onClick={() =>
                            setAssignmentData((prev) => ({
                              ...prev,
                              type: activity.value,
                              timeLimit: prev.timeLimit,
                            }))
                          }
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            assignmentData.type === activity.value
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300 hover:border-indigo-300"
                          }`}
                        >
                          <h4 className="font-medium text-gray-800">
                            {activity.label}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

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
                      placeholder="Title"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Questions</h3>

                {assignmentData.questions.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {assignmentData.questions.map((question) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {editingQuestionId === question.id ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Question Type
                              </label>
                              <select
                                value={newQuestion.type}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  setNewQuestion((prev) => ({
                                    ...prev,
                                    type: newType,
                                    // Reset answer when changing question type
                                    answer:
                                      newType === "multiple_choice"
                                        ? prev.answer
                                        : "",
                                    // Reset options if switching to programming
                                    options:
                                      newType === "multiple_choice"
                                        ? prev.options
                                        : [],
                                  }));
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-lg"
                              >
                                <option value="multiple_choice">
                                  Multiple Choice
                                </option>
                                <option value="programming">Programming</option>
                              </select>
                            </div>

                            {renderQuestionForm()}

                            <div className="flex justify-between">
                              <input
                                type="number"
                                value={newQuestion.points}
                                onChange={(e) =>
                                  setNewQuestion((prev) => ({
                                    ...prev,
                                    points: e.target.value,
                                  }))
                                }
                                name="points"
                                min="1"
                                className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Validate before saving
                                    if (
                                      newQuestion.type === "multiple_choice" &&
                                      !newQuestion.answer
                                    ) {
                                      setError(
                                        "Please select the correct answer"
                                      );
                                      return;
                                    }

                                    const updatedQuestions =
                                      assignmentData.questions.map((q) =>
                                        q.id === question.id
                                          ? {
                                              ...q,
                                              text: newQuestion.text,
                                              points: parseInt(
                                                newQuestion.points
                                              ),
                                              type: newQuestion.type,
                                              options: [...newQuestion.options], // Create new array
                                              answer: newQuestion.answer,
                                              expectedOutput:
                                                newQuestion.expectedOutput,
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
                                    setError(null);
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingQuestionId(null);
                                    setError(null);
                                  }}
                                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          renderQuestionPreview(question)
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

                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="programming">Programming</option>
                    </select>
                  </div>

                  {renderQuestionForm()}

                  <div className="mt-4">
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
                    <div className="text-red-600 text-sm mt-2">{error}</div>
                  )}

                  <div className="flex justify-between space-x-3 mt-4">
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
                      <FiPlus className="mr-2" /> Add Question Manually
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Review Activity</h3>

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
                      {assignmentData.type !== "activity" && (
                        <div>
                          <p className="text-sm text-gray-500">Time Limit</p>
                          <p className="font-medium">
                            {assignmentData.timeLimit} minutes
                          </p>
                        </div>
                      )}
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
                      {assignmentData.questions.map((question, index) =>
                        renderReviewQuestion(question, index)
                      )}
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
                ) : null}

                {currentStep == 3 ? (
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                ) : null}
              </div>
            </div>
          </form>
        </div>

        {showAIPromptModal && (
          <AIPromptModal
            isOpen={showAIPromptModal}
            onClose={() => setShowAIPromptModal(false)}
            onSelectQuestion={handleQuestionSelect}
            progLanguage={progLanguage}
            questionType={newQuestion.type}
            classId={classId}
          />
        )}
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
