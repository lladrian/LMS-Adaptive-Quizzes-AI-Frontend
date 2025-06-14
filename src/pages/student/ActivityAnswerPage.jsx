import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import {
  compilerRunCode,
  allLanguage,
  specificActivity,
  activityAnswer,
  specificActivitySpecificAnswer,
  specificClassroom
} from "../../utils/authService";
import { toast } from "react-toastify";


const ActivityAnswerPage = () => {
  const { classId, lessonId } = useParams();
  const [code, setCode] = useState("");
  const [languages, setLanguages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answersData, setAnswersData] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [points, setPoints] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSpecificClassroom();
    GetAnswers();
  }, []);

  const GetAnswers = async () => {
      const answers = await specificActivitySpecificAnswer(lessonId, studentId);
      const material = await specificActivity(lessonId);

      const initialAnswers = material.data?.data?.question.map((question) => {
        const matched = answers.data?.data?.answers.find((ans) => ans.questionId == question._id);
        return matched ? matched.line_of_code : "";
      });


      const initialAnswersPoints = material.data?.data?.question.map((question) => {
        const matched = answers.data?.data?.answers.find((ans) => ans.questionId == question._id);
        return matched ? matched.points : 0;
      });

      const initialAnswersCorrect = material.data?.data?.question.map((question) => {
        const matched = answers.data?.data?.answers.find((ans) => ans.questionId == question._id);
        return matched ? matched.is_correct : "";
      });

      setQuestions(material.data?.data?.question || []);
      setAnswersData(answers.data?.data)
      setCode(initialAnswers[currentIndex] || ""); // initial code display
      setAnswers(initialAnswers);
      setPoints(initialAnswersPoints)
      setCorrect(initialAnswersCorrect)
  };



  const fetchSpecificClassroom = async () => {
      try {
        const result = await specificClassroom(classId);

        if (result.success) {
          setClassroom(result.data.data);
          fetchLanguages(result.data.data.classroom.programming_language);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      } 
  };


  const fetchLanguages = async (language) => {
    try {
      const result = await allLanguage(language);

      const allLanguages = result.data.data || [];

      // Filter to get only the language that matches the `language` argument
      const matched = allLanguages.find((lang) => lang.language === language);

      // Set only the matched language (as an array if needed)
      setLanguages(matched ? [matched] : []);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
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

  const handleCodeChange = (newCode) => {
    const updatedAnswers = [...answers];   

    updatedAnswers[currentIndex] = newCode;

    setCode(newCode);
    setAnswers(updatedAnswers);
  };


  const startingCode = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = languages[0].starting_code || "";

    setAnswers(updatedAnswers); // ✅ You need to set the answers array
    setCode(languages[0].starting_code || ""); // ✅ Also update the code shown to the user
  };

  const handleSubmitAll = () => {
    const submitted = questions.map((q, i) => ({
      questionId: q._id,
      line_of_code: answers[i] || "",
      points: points[i] || 0,
      is_correct: correct[i] || 0,
    }));

    submitAnswers(submitted); 
    //console.log("Submitting Answers:", submitted);

     // Reset answers
    // setAnswers(questions.map(() => "")); 
    setCurrentIndex(0); // optional: go back to first question
    GetAnswers();
  };

  const submitAnswers = async (answers) => {
    try {
        const result = await activityAnswer(lessonId, studentId, answers);

        if(result.success){
              toast.success(result?.data?.message);
              setAnswers(questions.map(() => "")); 
        }

        toast.error(result.error);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
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

      if (questions[currentIndex]?.expected_output?.toString().trim() === result?.data?.data?.run?.output?.toString().trim()) {
        updatedCorrect[currentIndex] = 1; // Assign the value if it's not text
        updatedPoints[currentIndex] = questions[currentIndex].points; // Assign the value if it's not text
      } else {
        updatedCorrect[currentIndex] = 0; // Assign the value if it's not text
        updatedPoints[currentIndex] = 0; // Assign the value if it's not text
      }

      // Update state with the new arrays
      setPoints(updatedPoints);
      setCorrect(updatedCorrect);

      setOutput(result.data.data.run.output);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
            {output}
          </div>
          
          <div className="flex gap-4">
            {/* Left Column - Controls */}
            <div className="w-full md:w-1/2 space-y-4">
            
                <div className="p-4 border rounded bg-white shadow">
                      <h2 className="text-lg font-semibold mb-2">
                           Question {currentIndex + 1} of {questions?.length}
                      </h2>
                      <p className="mb-2">{currentQuestion?.text}</p>

                      <div className="mt-2">
                          <p className="text-sm text-gray-600 font-semibold">
                              Expected Output: {currentQuestion?.expected_output}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                              Points: {points[currentIndex] || 0}  / {currentQuestion?.points}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                              Correct: {correct[currentIndex] === 1 ? 'true' : 'false'}
                          </p>
                      </div>
                  </div>
     
        

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
            </div>

            <div className="w-full md:w-1/2">
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  language={classroom?.classroom?.programming_language}
                  height="400px"
                />
            </div>
          </div>
        </div>
    </div>
  );
};

export default ActivityAnswerPage;
