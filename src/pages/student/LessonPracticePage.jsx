import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiCode,
} from "react-icons/fi";
import CodeEditor from "../../components/CodeEditor";

const LessonPracticePage = () => {
  const { classId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Sample practice questions for each lesson
  const practiceData = {
    1: [
      {
        id: 1,
        type: "concept-check",
        question: "What does O(n) time complexity mean?",
        options: [
          "Constant time",
          "Linear time",
          "Quadratic time",
          "Logarithmic time",
        ],
        correctAnswer: 1,
        explanation: "O(n) means the time grows linearly with the input size.",
      },
      {
        id: 2,
        type: "coding-challenge",
        question:
          "Implement a function that calculates the sum of all numbers up to n",
        starterCode: "function sumUpTo(n) {\n  // Your code here\n}",
        testCases: [
          { input: "5", output: "15" },
          { input: "10", output: "55" },
        ],
      },
    ],
    2: [
      // Questions for Data Structures lesson
    ],
  };

  const currentPractice = practiceData[lessonId] || [];
  const currentQuestion = currentPractice[currentQuestionIndex];

  const handleAnswerSubmit = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    if (currentQuestionIndex < currentPractice.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "concept-check":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSubmit(index)}
                  className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "coding-challenge":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <CodeEditor
              value={currentQuestion.starterCode}
              onChange={(value) =>
                setUserAnswers((prev) => ({
                  ...prev,
                  [currentQuestionIndex]: value,
                }))
              }
              language="javascript"
              height="200px"
            />
            <button
              onClick={() =>
                handleAnswerSubmit(
                  userAnswers[currentQuestionIndex] ||
                    currentQuestion.starterCode
                )
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Submit Code
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Practice Results</h2>

        {currentPractice.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = question.correctAnswer === userAnswer;

          return (
            <div key={index} className="border-b pb-4">
              <div className="flex items-start mb-2">
                <span
                  className={`flex-shrink-0 mt-1 mr-2 ${
                    isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isCorrect ? <FiCheck /> : <FiX />}
                </span>
                <div>
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <p className="text-gray-700">{question.question}</p>

                  {question.explanation && !isCorrect && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => navigate(`/class/${classId}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Lessons
        </button>
      </div>
    );
  };

  if (currentPractice.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
          <h2 className="text-xl font-semibold mb-4">
            No Practice Exercises Available
          </h2>
          <button
            onClick={() => navigate(`/class/${classId}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return <div className="p-6">{renderResults()}</div>;
  }

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Practice Lesson
        </h2>
      </header>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className={`p-2 rounded-full ${
                currentQuestionIndex === 0
                  ? "text-gray-400"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                Question {currentQuestionIndex + 1} of {currentPractice.length}
              </span>
            </div>

            <button
              onClick={() =>
                currentQuestionIndex < currentPractice.length - 1
                  ? setCurrentQuestionIndex((prev) => prev + 1)
                  : setShowResults(true)
              }
              className={`p-2 rounded-full ${
                currentQuestionIndex === currentPractice.length - 1
                  ? "text-green-600 hover:bg-green-50"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {currentQuestionIndex === currentPractice.length - 1 ? (
                <span className="flex items-center">
                  Finish <FiArrowRight className="ml-1" />
                </span>
              ) : (
                <FiArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {renderQuestion()}
        </div>
      </div>
    </>
  );
};

export default LessonPracticePage;
