import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import {
  compilerRunCode,
  allLanguage,
  specificExam,
  specificQuiz,
  specificActivity,
  specificAssignment,
  examAnswer,
  quizAnswer,
  activityAnswer,
  assignmentAnswer,
  specificExamAnswer,
  specificQuizAnswer,
  specificActivityAnswer,
  specificAssignmentAnswer,
  takeExam,
  takeQuiz,
  takeActivity,
  takeAssignment as takeAssignmentAPI,
  specificExamSpecificAnswer,
  specificQuizSpecificAnswer,
  specificActivitySpecificAnswer,
  specificAssignmentSpecificAnswer,
  askAI,
  specificClassroom,
} from "../../utils/authService";
import { toast } from "react-toastify";

const AssignmentAnswerPage = () => {
  const { assignmentId, type, classId } = useParams();
  const [started, setStarted] = useState(false);
  const [code, setCode] = useState("");
  const [compiler, setCompiler] = useState({
    name: "Python",
    language: "python",
    version: "3.10.0",
    starting_code: "print('Hello, World!')",
  });
  const [languages, setLanguages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answersData, setAnswersData] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [points, setPoints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSpecificClassroom();
    fetchAssignment();
  }, []);

  const fetchSpecificClassroom = async () => {
    try {
      const result = await specificClassroom(classId);
      if (result.success) {
        setClassroom(result.data.data);
        fetchLanguages(result.data.data.classroom.programming_language);
      }
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast.error("Failed to fetch classroom data");
    }
  };

  useEffect(() => {
    if (!answersData?.opened_at) return;

    const countdownFrom =
      (answersData?.quiz?.submission_time ||
        answersData?.exam?.submission_time ||
        answersData?.activity?.submission_time ||
        answersData?.assignment?.submission_time) * 60 || 0;

    const openedAt = new Date(answersData?.opened_at?.replace(" ", "T"));

    const updateCountdown = () => {
      const now = new Date();
      const elapsed = Math.floor((now - openedAt) / 1000);
      const remaining = countdownFrom - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [answersData]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const fetchLanguages = async (language) => {
    try {
      const result = await allLanguage(language);
      const allLanguages = result.data.data || [];
      const matched = allLanguages.find((lang) => lang.language === language);
      setCode(matched?.starting_code || "");
      setLanguages(matched ? [matched] : []);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };

  const takeAssignment = async () => {
    try {
      let result;
      switch (type) {
        case "quiz":
          result = await takeQuiz(assignmentId, studentId);
          break;
        case "exam":
          result = await takeExam(assignmentId, studentId);
          break;
        case "activity":
          result = await takeActivity(assignmentId, studentId);
          break;
        case "assignment":
          result = await takeAssignmentAPI(assignmentId, studentId);
          break;
        default:
          throw new Error("Invalid assignment type");
      }
      return result?.success;
    } catch (error) {
      console.error("Failed to start assignment:", error);
      toast.error("Failed to start assignment");
      return false;
    }
  };

  const getAnswers = async (combinedQuestions, answer_id) => {
    try {
      let result;
      switch (type) {
        case "quiz":
          result = await specificQuizAnswer(answer_id);
          break;
        case "exam":
          result = await specificExamAnswer(answer_id);
          break;
        case "activity":
          result = await specificActivityAnswer(answer_id);
          break;
        case "assignment":
          result = await specificAssignmentAnswer(answer_id);
          break;
        default:
          throw new Error("Invalid assignment type");
      }

      const answers = [...(result.data?.data?.answers || [])];
      functionGetAnswers(answers, combinedQuestions);
      setStarted(result.success);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
      toast.error("Failed to fetch answers");
    }
  };

  const functionGetAnswers = (answers, combinedQuestions) => {
    const initialAnswers = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched?.line_of_code || "";
    });

    const initialSelectedAnswers = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched?.selected_option || "";
    });

    const initialAnswersPoints = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched?.points || 0;
    });

    const initialAnswersCorrect = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched?.is_correct || 0;
    });

    setCode(initialAnswers[currentIndex] || "");
    setAnswers(initialAnswers);
    setSelectedAnswer(initialSelectedAnswers);
    setPoints(initialAnswersPoints);
    setCorrect(initialAnswersCorrect);
  };

  const fetchAssignment = async () => {
    try {
      let result, answerResult;
      switch (type) {
        case "quiz":
          result = await specificQuiz(assignmentId);
          answerResult = await specificQuizSpecificAnswer(
            assignmentId,
            studentId
          );
          break;
        case "exam":
          result = await specificExam(assignmentId);
          answerResult = await specificExamSpecificAnswer(
            assignmentId,
            studentId
          );
          break;
        case "activity":
          result = await specificActivity(assignmentId);
          answerResult = await specificActivitySpecificAnswer(
            assignmentId,
            studentId
          );
          break;
        case "assignment":
          result = await specificAssignment(assignmentId);
          answerResult = await specificAssignmentSpecificAnswer(
            assignmentId,
            studentId
          );
          break;
        default:
          throw new Error("Invalid assignment type");
      }

      const combinedQuestions = [...(result.data?.data?.question || [])];
      setAnswersData(answerResult.data.data);
      setQuestions(combinedQuestions);
      getAnswers(combinedQuestions, answerResult.data?.data?._id);
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      toast.error("Failed to fetch assignment");
    }
  };

  const submitAnswers = async (answers) => {
    try {
      let result;
      switch (type) {
        case "quiz":
          result = await quizAnswer(assignmentId, studentId, answers);
          break;
        case "exam":
          result = await examAnswer(assignmentId, studentId, answers);
          break;
        case "activity":
          result = await activityAnswer(assignmentId, studentId, answers);
          break;
        case "assignment":
          result = await assignmentAnswer(assignmentId, studentId, answers);
          break;
        default:
          throw new Error("Invalid assignment type");
      }

      if (result.success) {
        toast.success(result?.data?.message);
        setAnswers(questions.map(() => ""));
        setSelectedAnswer(questions.map(() => ""));
        fetchAssignment(); // Refresh data after submission
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to submit answers:", error);
      toast.error("Failed to submit answers");
    }
  };

  const runCode = async () => {
    try {
      const result = await compilerRunCode(
        languages[0].language,
        languages[0].version,
        code
      );

      const updatedPoints = [...points];
      const updatedCorrect = [...correct];

      const isCorrect =
        questions[currentIndex].expected_output.toString().trim() ===
        result.data.data.run.output.toString().trim();

      updatedCorrect[currentIndex] = isCorrect ? 1 : 0;
      updatedPoints[currentIndex] = isCorrect
        ? questions[currentIndex].points
        : 0;

      setPoints(updatedPoints);
      setCorrect(updatedCorrect);
      setOutput(result.data.data.run.output);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };

  const startingCode = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = languages[0]?.starting_code || "";
    setAnswers(updatedAnswers);
    setCode(languages[0]?.starting_code || "");
  };

  const handleCompilerChange = (e) => {
    const selected = JSON.parse(e.target.value);
    setCompiler(selected);
  };

  const handleCodeChange = (newCode) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = newCode;
    setCode(newCode);
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCode(answers[currentIndex + 1] || "");
      setOutput("");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCode(answers[currentIndex - 1] || "");
      setOutput("");
    }
  };

  const handleSubmitAll = () => {
    const submitted = questions.map((q, i) => ({
      questionId: q._id,
      line_of_code: answers[i] || "",
      selected_option: selectedAnswer[i] || "",
      points: points[i] || 0,
      is_correct: correct[i] || 0,
    }));

    submitAnswers(submitted);
  };

  const startAssignment = async () => {
    const success = await takeAssignment();
    if (success) {
      await fetchAssignment();
      setStarted(true);
    }
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...selectedAnswer];
    const updatedCorrect = [...correct];
    const updatedPoints = [...points];

    const isCorrect = option === questions[currentIndex].correct_option;

    updatedCorrect[currentIndex] = isCorrect ? 1 : 0;
    updatedPoints[currentIndex] = isCorrect
      ? questions[currentIndex].points
      : 0;
    updatedAnswers[currentIndex] = option;

    setSelectedAnswer(updatedAnswers);
    setCorrect(updatedCorrect);
    setPoints(updatedPoints);
  };

  const currentQuestion = questions[currentIndex];
  const assignmentTypeName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer  text-md text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>
      {currentQuestion && (
        <div className="space-y-4">
          {started && currentQuestion.answer_type === "programming" && (
            <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
              {output}
            </div>
          )}

          {!started && (
            <div className="text-center w-full">
              <h2 className="text-xl font-bold mb-4">
                Ready to Start the {assignmentTypeName}?
              </h2>
              <button
                onClick={startAssignment}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
              >
                Start {assignmentTypeName}
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <div className="w-full md:w-1/2 space-y-4">
              {started && (
                <>
                  <div className="p-4 border rounded bg-white shadow">
                    <h2 className="text-lg font-semibold mb-2">
                      Question {currentIndex + 1} of {questions.length}
                    </h2>
                    <p className="mb-2">{currentQuestion.text}</p>

                    {(currentQuestion.answer_type === "programming" ||
                      answersData.submitted_at) && (
                      <div className="mt-2">
                        {currentQuestion.answer_type === "programming" && (
                          <p className="text-sm text-gray-600 font-semibold">
                            Expected Output: {currentQuestion.expected_output}
                          </p>
                        )}

                        <p className="text-sm text-gray-600 font-semibold">
                          Points: {points[currentIndex]} /{" "}
                          {currentQuestion.points}
                        </p>
                        <p className="text-sm text-gray-600 font-semibold">
                          Status:{" "}
                          {correct[currentIndex] === 1
                            ? "Correct"
                            : "Incorrect"}
                        </p>
                      </div>
                    )}

                    {!answersData.submitted_at && (
                      <div>
                        <p className="font-medium">
                          Time Left: {formatTime(timeLeft)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {started && currentQuestion.answer_type === "programming" && (
                <>
                  <select
                    onChange={handleCompilerChange}
                    className="border border-gray-300 rounded px-2 py-3 w-full"
                    value={JSON.stringify(compiler)}
                  >
                    {languages.map((lang, index) => (
                      <option
                        key={index}
                        value={JSON.stringify({
                          name: lang.name,
                          language: lang.language,
                          version: lang.version,
                          starting_code: lang.starting_code,
                        })}
                      >
                        {`${lang.name} - ${lang.version}`.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={runCode}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium w-full px-4 py-3 rounded"
                  >
                    Run Code
                  </button>

                  <button
                    onClick={startingCode}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium w-full px-4 py-3 rounded"
                  >
                    Reset Code
                  </button>
                </>
              )}

              {started && (
                <div className="flex justify-between gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`w-1/2 px-4 py-3 rounded text-white font-medium ${
                      currentIndex === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitAll}
                      disabled={answersData.submitted_at}
                      className={`w-1/2 px-4 py-3 rounded text-white font-medium ${
                        answersData.submitted_at
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {answersData.submitted_at ? "Submitted" : "Submit All"}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2">
              {started && currentQuestion.answer_type === "options" && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                  <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">
                    Choose Your Answer
                  </h3>
                  <ul className="space-y-4">
                    {Object.values(currentQuestion.options).map(
                      (value, index) => (
                        <li key={index}>
                          <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50 transition">
                            <input
                              type="radio"
                              name={`mcq-${currentIndex}`}
                              value={value}
                              checked={selectedAnswer[currentIndex] === value}
                              onChange={() => handleOptionSelect(value)}
                              className="accent-blue-600 w-5 h-5 mr-4"
                              disabled={answersData.submitted_at}
                            />
                            <span className="text-lg font-medium text-gray-700">
                              {value}
                            </span>
                          </label>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {started && currentQuestion.answer_type === "programming" && (
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  language={
                    classroom?.classroom?.programming_language || "python"
                  }
                  height="400px"
                  readOnly={answersData.submitted_at}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentAnswerPage;
