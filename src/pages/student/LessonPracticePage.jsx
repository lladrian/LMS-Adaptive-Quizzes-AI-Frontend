import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import CodeEditor from "../../components/CodeEditor";

const LessonPracticePage = () => {
  const { classId, lessonId } = useParams();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [practiceData, setPracticeData] = useState({});
  const [runOutput, setRunOutput] = useState("");

  // Fetch AI-generated question on load
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch("http://localhost:4000/ai/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ask: "Give me one simple programming quiz using Python programming. Do not give any solutions and instructions, just problems only.",
          }),
        });

        const data = await response.json();
        const generatedQuestion = data?.data || "No question generated.";

        setPracticeData({
          [lessonId]: [
            {
              id: 1,
              type: "coding-challenge",
              question: generatedQuestion,
              starterCode: "print('Hello, World!')",
              language: "python",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching AI question:", err);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const currentPractice = practiceData[lessonId] || [];
  const currentQuestion = currentPractice[currentQuestionIndex];

  const runCode = async () => {
    try {
      const response = await fetch("http://localhost:4000/compilers/run_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: currentQuestion.language || "python",
          version: "3.10.0",
          code: userAnswers[currentQuestionIndex] || currentQuestion.starterCode,
        }),
      });

      const result = await response.json();
      setRunOutput(result?.run?.output || "No output.");
    } catch (error) {
      console.error(error);
      setRunOutput("Error running code.");
    }
  };

  const handleAnswerSubmit = () => {
    if (currentQuestionIndex < currentPractice.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return <p>Loading question...</p>;

    if (currentQuestion.type === "coding-challenge") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          <CodeEditor
            value={userAnswers[currentQuestionIndex] || currentQuestion.starterCode}
            onChange={(value) =>
              setUserAnswers((prev) => ({
                ...prev,
                [currentQuestionIndex]: value,
              }))
            }
            language={currentQuestion.language || "python"}
            height="300px"
          />
          <div className="flex gap-4">
            <button
              onClick={runCode}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
            >
              Run Code
            </button>
            <button
              onClick={handleAnswerSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
            >
              Submit Answer
            </button>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded p-4 mt-4 whitespace-pre-wrap">
            {runOutput}
          </div>
        </div>
      );
    }

    return <p>Unsupported question type</p>;
  };

  const renderResults = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Practice Complete</h2>
      <button
        onClick={() => navigate(`/class/${classId}`)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Back to Lessons
      </button>
    </div>
  );

  if (showResults) {
    return <div className="p-6">{renderResults()}</div>;
  }

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Practice Lesson - {lessonId}
        </h2>
      </header>
      <main className="p-6">{renderQuestion()}</main>
    </>
  );
};

export default LessonPracticePage;
