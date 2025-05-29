import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import {
  compilerRunCode,
  allLanguage,
  specificExam,
  specificQuiz,
  examAnswer,
  quizAnswer,
  specificExamAnswer,
  specificQuizAnswer,
  takeExam,
  takeQuiz,
} from "../../utils/authService";



const AssignmentAnswerPage = () => {
  const { assignmentId } = useParams();

  const [code, setCode] = useState("print('Hello, World!')");
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

  const studentId = localStorage.getItem("userId");


  useEffect(() => {
    fetchLanguages();
    fetchAssignment();
    takeAssignment();
  }, []);

  const fetchLanguages = async () => {
    try {
      const result = await allLanguage();
      setLanguages(result.data.data || []);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };
  const takeAssignment = async () => {
    try {
      const result1 = await takeExam(assignmentId, studentId);
      const result2 = await takeQuiz(assignmentId, studentId);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const getAnswers = async (combinedQuestions) => {
    try {
      const result1 = await specificExamAnswer("6838429e9c7b3b5c59bfd616");
      const result2 = await specificQuizAnswer("6838429e9c7b3b5c59bfd616");

      const answers = [
        ...(result1.data?.data?.answers || []),
        ...(result2.data?.data?.answers || []),
      ];

      functionGetAnswers(answers, combinedQuestions)
 
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const functionGetAnswers = async (answers, combinedQuestions) => {
      const initialAnswers = combinedQuestions.map((question) => {
        const matched = answers.find((ans) => ans.questionId == question._id);
        return matched ? matched.line_of_code : "";
      });

      setAnswers(initialAnswers);
      setCode(initialAnswers[currentIndex] || ""); // initial code display

      // console.log(combinedQuestions)
      //   console.log(333)
      // console.log(answers)
      //    console.log(321)
      // console.log(initialAnswers)
      //  console.log(222)
  };


  const fetchAssignment = async () => {
    try {
      const result1 = await specificExam(assignmentId);
      const result2 = await specificQuiz(assignmentId);


      const combinedQuestions = [
        ...(result1.data?.data?.question || []),
        ...(result2.data?.data?.question || []),
      ];

      setQuestions(combinedQuestions);
      getAnswers(combinedQuestions);
      // console.log(combinedQuestions)
      // console.log(123)
      //setAnswers(combinedQuestions.map(() => "")); // initialize blank answers
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
      const result1 = await examAnswer(assignmentId, studentId, answers);
      const result2 = await quizAnswer(assignmentId, studentId, answers);
      console.log(result1);
      console.log(result2);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const runCode = async () => {
    try {
      const result = await compilerRunCode(
        compiler.language,
        compiler.version,
        code
      );
      setOutput(result.data.data.run.output);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };

  const handleCompilerChange = (e) => {
    const selected = JSON.parse(e.target.value);
    setCompiler(selected);
    setCode(selected.starting_code || "");
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selected.starting_code || "";
    setAnswers(updatedAnswers);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = newCode;
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
    }));

    submitAnswers(submitted); 
    console.log("Submitting Answers:", submitted);

     // Reset answers
    setAnswers(questions.map(() => "")); 
    setCurrentIndex(0); // optional: go back to first question
    alert("All answers submitted!");
    fetchAssignment();
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 space-y-4">
      {currentQuestion && (
        <div className="space-y-4">
          <div className="p-4 border rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <p className="mb-2">{currentQuestion.text}</p>
            <p className="text-sm text-gray-600">
              Points: {currentQuestion.points}
            </p>
          </div>

          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={compiler.language}
            height="300px"
          />

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
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded"
              >
                Submit All Answers
              </button>
            )}
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
            {output}
          </div>

        </div>
      )}
    </div>
  );
};

export default AssignmentAnswerPage;
