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
  specificExamSpecificAnswer,
  specificQuizSpecificAnswer,
  askAI,
  specificClassroom
} from "../../utils/authService";
import { toast } from "react-toastify";




const AssignmentAnswerPage = () => {
  const {assignmentId, type, classId} = useParams();
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
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [classroom, setClassroom] = useState(null);



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
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      } 
  };


  useEffect(() => {
 // const countdownFrom = 120; // 2 minutes in seconds.
  //const openedAt = new Date(); // Initialize openedAt when useEffect runs
 // const openedAt = answersData.opened_at; // 2025-06-03 12:00:34
    const countdownFrom = (answersData?.quiz?.submission_time || answersData?.exam?.submission_time) * 60;
    const openedAt = new Date(answersData?.opened_at?.replace(' ', 'T')); // e.g. "2025-06-03T12:00:34"

    const updateCountdown = () => {
    const now = new Date();
    const elapsed = Math.floor((now - openedAt) / 1000);
    const remaining = countdownFrom - elapsed;

    setTimeLeft(remaining > 0 ? remaining : 0);
  };

  updateCountdown(); // initial call

  const timer = setInterval(updateCountdown, 1000);
  return () => clearInterval(timer);
}, [answersData]);

  


    const formatTime = (seconds) => {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      return `${m}:${s}`;
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


  const takeAssignment = async () => {
    try {
      if(type == 'quiz') {
        const result2 = await takeQuiz(assignmentId, studentId);
      } else {
        const result1 = await takeExam(assignmentId, studentId);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const getAnswers = async (combinedQuestions, answer_id) => {
    try {
       if(type == 'quiz') { 
            const result2 = await specificQuizAnswer(answer_id);
            const answers = [
              ...(result2.data?.data?.answers || []),
            ];
     
            functionGetAnswers(answers, combinedQuestions);
            setStarted(result2.success);
       } else {
          const result1 = await specificExamAnswer(answer_id);
          const answers = [
              ...(result1.data?.data?.answers || []),
          ];
          functionGetAnswers(answers, combinedQuestions)
          setStarted(result1.success);
       }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const functionGetAnswers = async (answers, combinedQuestions) => {
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

      setCode(initialAnswers[currentIndex] || ""); // initial code display
      setAnswers(initialAnswers);
      setSelectedAnswer(initialSelectedAnswers);
      setPoints(initialAnswersPoints)
      setCorrect(initialAnswersCorrect)
  };


  const fetchAssignment = async () => {
    try {
      if(type == 'quiz') { 
        const result2 = await specificQuiz(assignmentId);
        //const result4 = await specificQuizAnswer(answer_id)
        const result4 = await specificQuizSpecificAnswer(assignmentId, studentId);


        const combinedQuestions = [
          ...(result2.data?.data?.question || []),
        ];
        setAnswersData(result4.data.data)
        setQuestions(combinedQuestions);
        getAnswers(combinedQuestions, result4.data?.data?._id);
      } else {
        const result1 = await specificExam(assignmentId);
        //const result3 = await specificExamAnswer(answer_id);
        const result3 = await specificExamSpecificAnswer(assignmentId, studentId);

        const combinedQuestions = [
          ...(result1.data?.data?.question || []),
        ];
        setAnswersData(result3.data.data)
        setQuestions(combinedQuestions);
        getAnswers(combinedQuestions, result3.data?.data?._id);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
        if(type == 'quiz') { 
            const result2 = await quizAnswer(assignmentId, studentId, answers);
            if(result2.success){
              toast.success(result2?.data?.message);
              setAnswers(questions.map(() => "")); 
              setSelectedAnswer(questions.map(() => "")); 
            }
            toast.error(result2.error);
        } else {
          const result1 = await examAnswer(assignmentId, studentId, answers);
          if(result1.success){
              toast.success(result1?.data?.message);
              setAnswers(questions.map(() => "")); 
              setSelectedAnswer(questions.map(() => "")); 
          }
          toast.error(result1.error);
        }
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

      if(questions[currentIndex].expected_output == result.data.data.run.output) {
        updatedCorrect[currentIndex] = 1; // Assign the value if it's not text
        updatedPoints[currentIndex] = questions[currentIndex].points; // Assign the value if it's not text
      } else {
        updatedCorrect[currentIndex] = 1; // Assign the value if it's not text
        updatedPoints[currentIndex] = questions[currentIndex].points; // Assign the value if it's not text
      }

      // Update state with the new arrays
      setPoints(updatedPoints);
      setCorrect(updatedCorrect);

      setOutput(result.data.data.run.output);
      //askAIFunction(result.data.data.run.output, questions[currentIndex].points);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };


  const startingCode = async () => {
    const updatedAnswers = [...answers];
    //updatedAnswers[currentIndex] = compiler.starting_code || "";
    updatedAnswers[currentIndex] = languages[0].starting_code || "";

    setAnswers(updatedAnswers); // ✅ You need to set the answers array
    setCode(languages[0].starting_code || ""); // ✅ Also update the code shown to the user
  };

  const handleCompilerChange = (e) => {
    const selected = JSON.parse(e.target.value);
    //const updatedAnswers = [...answers];
   // const updatedPoints = [...points];    
   // const updatedCorrect = [...correct];

    //updatedAnswers[currentIndex] = selected.starting_code || "";
   // updatedPoints[currentIndex]  = 0;
   // updatedCorrect[currentIndex] = 0;

    setCompiler(selected);
   // setCode(selected.starting_code || "");
   // setAnswers(updatedAnswers);
   // setPoints(updatedPoints);
    //setCorrect(updatedCorrect);
  
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
    //console.log("Submitting Answers:", submitted);

     // Reset answers
   // setAnswers(questions.map(() => "")); 
    setCurrentIndex(0); // optional: go back to first question
    fetchAssignment();
  };

  const startAssignment = async () => {
    await takeAssignment();
    await fetchAssignment();
    setStarted(true);
  };

  const askAIFunction = async (output_result, question_points) => {
        try {
          let askForCorrection = `You are evaluating a beginner's code submission.
          The code is: ->${code}<-
          The output is: ->${output_result}<-
          The question is: ->${questions[currentIndex].text}<-
          The programming language is: ->${compiler.name}<-
          Determine if the code correctly answers the question based on its output.
          Respond with:
            - 1 if the code is fully or partially correct.
            - 0 if the code and output do not relate to the question.
          Only respond with a single number (0 or 1). No newlines, explanations, or symbols.
          Strictly adhere to the output from the given code, and respond with 0 if the code and results are unrelated.
          Note: The compiler does not support input(), so do not penalize for input handling.
          `;
          
          
          let askForPoints = `You are grading a beginner's code submission.
          The code is: ->${code}<-
          The output is: ->${output_result}<-
          The question is: ->${questions[currentIndex].text}<-
          The programming language is: ->${compiler.name}<-
          Maximum possible points: ->${question_points}<-
          Evaluate how well the code matches the question and produces the expected output.
          Stricly if the code does not answer the question or the output is unrelated, respond with 0.
          If the code is partially correct or attempts to solve the question reasonably, assign partial points.
          Only respond with a number (0 to ${question_points}), with no newlines, explanations, or symbols.
          Note: Input is not supported by the compiler. Do not penalize for that.
          `;

  
          const result = await askAI(askForCorrection);
          const result2 = await askAI(askForPoints);

          const updatedPoints = [...points];    
          const updatedCorrect = [...correct];

          updatedCorrect[currentIndex] = result.data.data; // Assign the value if it's not text
          updatedPoints[currentIndex] = result2.data.data; // Assign the value if it's not text
        
          // Update state with the new arrays
          setPoints(updatedPoints);
          setCorrect(updatedCorrect);
        } catch (error) {
          console.error("Error fetching question:", error);
        }
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
    <div className="p-6 space-y-4">
      {currentQuestion && (
        <div className="space-y-4">

          {started && currentQuestion.answer_type === 'programming' && (
           <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
              {output}
            </div>
          )}

          {!started  && (
                <div className="text-center w-full">
                  <h2 className="text-xl font-bold mb-4">
                    Ready to Start the {type === "quiz" ? "Quiz" : "Exam"}?
                  </h2>
                  <button
                    onClick={startAssignment}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
                  >
                    Start {type === "quiz" ? "Quiz" : "Exam"}
                  </button>
                </div>
          )}

          <div className="flex gap-4">
            {/* Left Column - Controls */}
            <div className="w-full md:w-1/2 space-y-4">
            

              {started && (
              <>
                <div className="p-4 border rounded bg-white shadow">
                      <h2 className="text-lg font-semibold mb-2">
                        Question {currentIndex + 1} of {questions.length}
                      </h2>
                      <p className="mb-2">{currentQuestion.text}</p>

                      {(currentQuestion.answer_type === 'programming' || answersData.submitted_at) && ( 
                        <div className="mt-2">
                          {(currentQuestion.answer_type === 'programming') && ( 
                            <p className="text-sm text-gray-600 font-semibold">
                              Expected Output: {currentQuestion.expected_output}
                            </p>
                          )}

                          <p className="text-sm text-gray-600 font-semibold">
                            Points: {points[currentIndex]} / {currentQuestion.points}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            Correct: {correct[currentIndex] === 1 ? 'true' : 'false'}
                          </p>
                        </div>
                      )}

                      {(!answersData.submitted_at) && ( 
                        <div>
                          <p>Time Left: {formatTime(timeLeft)}</p>
                        </div>
                      )}
                  </div>
              </>
              )}

              {started && currentQuestion.answer_type === 'programming' && (
              <>
                {/* <select
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
                </select> */}

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
                      Submit All Answers
                    </button>

                    // <button
                    //   onClick={handleSubmitAll}
                    //   className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded"
                    // >
                    //   Submit All Answers
                    // </button>
                  )}
                </div>
              )}
            </div>

           <div className="w-full md:w-1/2">
            {/* Only show if answer_type is 'options' */}
            {started && currentQuestion.answer_type === 'options' && (
              <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">
                Choose Your Answer
              </h3>
              <ul className="space-y-4">
                {Object.values(currentQuestion.options).map((value, index) => (
                    <li key={index}>
                      <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50 transition">
                        <input
                          type="radio"
                          name={`mcq-${currentIndex}`}
                          value={value}
                          checked={selectedAnswer[currentIndex] === value}
                          onChange={() => handleOptionSelect(value)}
                          className="accent-blue-600 w-5 h-5 mr-4"
                        />
                        <span className="text-lg font-medium text-gray-700">{value}</span>
                      </label>
                    </li>
                  ))}
          

                {/* {["option_1", "option_2", "option_3", "option_4"].map((opt, index) => (
                  <li key={index}>
                    <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50 transition">
                      <input
                        type="radio"
                        name="mcq"
                        value={opt}
                        className="accent-blue-600 w-5 h-5 mr-4"
                        // checked={selectedAnswer === opt}
                        // onChange={() => setSelectedAnswer(opt)}
                      />
                      <span className="text-lg font-medium text-gray-700">
                        {currentQuestion.options[opt]}
                      </span>
                    </label>
                  </li>
                ))} */}
              </ul>
            </div>
            )}

           

            {/* Only show CodeEditor if answer_type is 'programming' */}
            {started && currentQuestion.answer_type === 'programming' && (
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language={classroom.classroom.programming_language}
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

export default AssignmentAnswerPage;
