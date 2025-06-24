import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  compilerRunCode,
  allLanguage,
  specificActivity,
  takeActivity,
  activityAnswer,
  specificActivityAnswer,
  specificActivitySpecificAnswer,
  specificClassroom,
} from "../../utils/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CodeEditor = ({ value, onChange, language, height }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    setIsEditorReady(true);

    editor.onKeyDown((e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.keyCode === monaco.KeyCode.KeyC ||
          e.keyCode === monaco.KeyCode.KeyV ||
          e.keyCode === monaco.KeyCode.KeyX)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    editor.onContextMenu((e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden no-select">
      <Editor
        height={height || "300px"}
        language={language || "python"}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: false,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

const ActivityAnswerPage = () => {
  const { assignmentId, classId } = useParams();
  const [started, setStarted] = useState(false);
  const [code, setCode] = useState("");
  const [languages, setLanguages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answersData, setAnswersData] = useState(null);
  const [correct, setCorrect] = useState([]);
  const [points, setPoints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [extendedTime, setExtendedTime] = useState(0);

  const studentId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCopyPaste = (e) => {
      e.preventDefault();
      toast.warning("Copy/paste is disabled for this activity");
      return false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    fetchSpecificClassroom();
    fetchActivity();
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

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    console.log(answersData)

    if (!answersData || !answersData?.answer?.opened_at) return;

    const baseTime = parseInt(answersData?.activity?.submission_time || 0, 10);
    const extTime = parseInt(answersData?.activity?.extended_minutes || 0, 10);
    const totalTimeInSeconds = (baseTime + extTime) * 60;

    setExtendedTime(extTime);
    setTotalTime(totalTimeInSeconds);

    console.log(answersData)


    const openedAt = new Date(answersData?.answer?.opened_at.replace(" ", "T"));
    if (isNaN(openedAt.getTime())) {
      console.error("Invalid opened_at date:", answersData.opened_at);
      return;
    }


    const updateCountdown = () => {
      const now = new Date();
      const elapsed = Math.floor((now - openedAt) / 1000);
      const remaining = totalTimeInSeconds - elapsed;

      if (remaining <= 0) {
        if (!timeExpired) {
          setTimeLeft(0);
          setTimeExpired(true);
          if (!answersData.submitted_at) {
            handleSubmitAll(); // Submit only once
          }
        }
      } else {
        setTimeLeft(remaining);
        setTimeExpired(false);
      }
    };

    updateCountdown(); // run immediately
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [answersData, timeExpired]); // <- include timeExpired to prevent infinite loop

  const fetchLanguages = async (language) => {
    try {
      const result = await allLanguage(language);
      const allLanguages = result.data.data || [];
      const matched = allLanguages.find((lang) => lang.language === language);
      setLanguages(matched ? [matched] : []);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };

  const startActivityAttempt = async () => {
    try {
      await takeActivity(assignmentId, studentId);
    } catch (error) {
      console.error("Failed to start activity:", error);
      toast.error("Failed to start the activity");
    }
  };

  const getAnswers = async (combinedQuestions, answer_id) => {
    try {
      const result = await specificActivityAnswer(answer_id);
      const answers = [...(result.data?.data?.answers || [])];
      functionGetAnswers(answers, combinedQuestions);
      setStarted(result.success);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
    }
  };

  const functionGetAnswers = (answers, combinedQuestions) => {
    const initialAnswers = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched ? matched.line_of_code : "";
    });

    const initialSelectedAnswers = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched ? matched.selected_option : "";
    });

    const initialAnswersPoints = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched ? matched.points : 0;
    });

    const initialAnswersCorrect = combinedQuestions.map((question) => {
      const matched = answers.find((ans) => ans.questionId == question._id);
      return matched ? matched.is_correct : "";
    });

    setCode(initialAnswers[currentIndex] || "");
    setAnswers(initialAnswers);
    setSelectedAnswer(initialSelectedAnswers);
    setPoints(initialAnswersPoints);
    setCorrect(initialAnswersCorrect);
  };

  const fetchActivity = async () => {
    try {
      const result = await specificActivity(assignmentId);
      const answerResult = await specificActivitySpecificAnswer(
        assignmentId,
        studentId
      );
      const combinedQuestions = [...(result.data?.data?.question || [])];

      setAnswersData(answerResult.data.data);
      setQuestions(combinedQuestions);
      getAnswers(combinedQuestions, answerResult.data?.data?.answer?._id);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
      const result = await activityAnswer(assignmentId, studentId, answers);

      if (result.success) {
        toast.success("Answers submitted successfully!");
        setAnswers(questions.map(() => ""));
        setSelectedAnswer(questions.map(() => ""));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Failed to submit answers:", error);
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

      if (
        questions[currentIndex].expected_output.toString().trim() ===
        result.data.data.run.output.toString().trim()
      ) {
        updatedCorrect[currentIndex] = 1;
        updatedPoints[currentIndex] = questions[currentIndex].points;
      } else {
        updatedCorrect[currentIndex] = 0;
        updatedPoints[currentIndex] = 0;
      }

      setPoints(updatedPoints);
      setCorrect(updatedCorrect);
      setOutput(result.data.data.run.output);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };

  const startingCode = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = languages[0].starting_code || "";
    setAnswers(updatedAnswers);
    setCode(languages[0].starting_code || "");
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
    console.log(submitted);

    submitAnswers(submitted);
    setCurrentIndex(0);
    fetchActivity();
  };

  const startActivity = async () => {
    await startActivityAttempt();
    await fetchActivity();
    setStarted(true);
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...selectedAnswer];
    const updatedCorrect = [...correct];
    const updatedPoints = [...points];

    if (option === questions[currentIndex].correct_option) {
      updatedCorrect[currentIndex] = 1;
      updatedPoints[currentIndex] = questions[currentIndex].points;
      updatedAnswers[currentIndex] = option;
    } else {
      updatedCorrect[currentIndex] = 0;
      updatedPoints[currentIndex] = 0;
      updatedAnswers[currentIndex] = option;
    }

    setSelectedAnswer(updatedAnswers);
    setCorrect(updatedCorrect);
    setPoints(updatedPoints);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 space-y-4 no-select">
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer text-md text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>
      <style jsx global>{`
        .no-select {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .no-select::selection {
          background: transparent;
        }
        .no-select::-moz-selection {
          background: transparent;
        }
      `}</style>

      {currentQuestion && (
        <div className="space-y-4">
          {started && currentQuestion.answer_type === "programming" && (
            <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap no-select">
              {output}
            </div>
          )}

          {!started && (
            <div className="text-center w-full no-select">
              <h2 className="text-xl font-bold mb-4">
                Ready to Start the Activity?
              </h2>
              <button
                onClick={startActivity}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
              >
                Start Activity
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <div className="w-full md:w-1/2 space-y-4">
              {started && (
                <>
                  <div className="p-4 border rounded bg-white shadow no-select">
                    <h2 className="text-lg font-semibold mb-2">
                      Question {currentIndex + 1} of {questions.length}
                    </h2>
                    <p className="mb-2">{currentQuestion.text}</p>

                    {(currentQuestion.answer_type === "programming" ||
                      answersData?.submitted_at) && (
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
                          Correct:{" "}
                          {correct[currentIndex] === 1 ? "true" : "false"}
                        </p>
                      </div>
                    )}
                    {!answersData?.submitted_at && (
                      <div>
                        <p
                          className={`text-lg font-semibold ${
                            timeLeft < 300
                              ? "text-red-600"
                              : timeLeft < 600
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
                          ⏱️ Time Remaining: {formatTime(timeLeft)}
                          {extendedTime > 0 && (
                            <span className="text-xs text-green-600 ml-2">
                              (+{extendedTime} min extension)
                            </span>
                          )}
                        </p>
                        {timeExpired && (
                          <p className="text-red-600 font-semibold mt-1">
                            Time has expired! Your answers have been submitted.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {started && currentQuestion.answer_type === "programming" && (
                <>
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
                    Starting Code
                  </button>
                </>
              )}

              {started && !timeExpired && (
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
                      disabled={answersData?.submitted_at}
                      className={`w-1/2 px-4 py-3 rounded text-white font-medium ${
                        answersData?.submitted_at
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Submit All Answers
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2">
              {started && currentQuestion.answer_type === "options" && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200 no-select">
                  <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">
                    Choose Your Answer
                  </h3>
                  <ul className="space-y-4">
                    {Object.values(currentQuestion.options).map(
                      (value, index) => (
                        <li key={index} className="no-select">
                          <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50 transition no-select">
                            <input
                              type="radio"
                              name={`mcq-${currentIndex}`}
                              value={value}
                              checked={selectedAnswer[currentIndex] === value}
                              onChange={() => handleOptionSelect(value)}
                              className="accent-blue-600 w-5 h-5 mr-4"
                            />
                            <span className="text-lg font-medium text-gray-700 no-select">
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
                  language={classroom?.classroom?.programming_language}
                  height="400px"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityAnswerPage;