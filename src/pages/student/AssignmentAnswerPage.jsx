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
} from "../../utils/authService";
import { toast } from "react-toastify";




const AssignmentAnswerPage = () => {
  const {assignmentId, type} = useParams();
  const [started, setStarted] = useState(false);
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
  const [correct, setCorrect] = useState([]);
  const [points, setPoints] = useState([]);

  const studentId = localStorage.getItem("userId");


  useEffect(() => {
    fetchLanguages();
    fetchAssignment();
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
        setQuestions(combinedQuestions);
        getAnswers(combinedQuestions, result4.data?.data?._id);
      } else {
        const result1 = await specificExam(assignmentId);
        //const result3 = await specificExamAnswer(answer_id);
        const result3 = await specificExamSpecificAnswer(assignmentId, studentId);

        const combinedQuestions = [
          ...(result1.data?.data?.question || []),
        ];
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
            }
            toast.error(result2.error);
        } else {
          const result1 = await examAnswer(assignmentId, studentId, answers);
          if(result1.success){
              toast.success(result1?.data?.message);
              setAnswers(questions.map(() => "")); 
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
        compiler.language,
        compiler.version,
        code
      );
      setOutput(result.data.data.run.output);
      askAIFunction(result.data.data.run.output, questions[currentIndex].points);
    } catch (error) {
      console.error(error);
      setOutput("Error running code.");
    }
  };


  const startingCode = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = compiler.starting_code || "";

    setAnswers(updatedAnswers); // ✅ You need to set the answers array
    setCode(compiler.starting_code || ""); // ✅ Also update the code shown to the user
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
      points: points[i] || 0,
      is_correct: correct[i] || 0,
    }));

    submitAnswers(submitted); 
    console.log("Submitting Answers:", submitted);

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
          // let askForCorrection = `in this code ->${code}<- using ${compiler.name} programming language with this output ->${output}<- .
          // . please do correction with this question ->${questions[currentIndex].text}<-. 
          // strictly just answer 1 or 0. remove the newline. please take note and have consideration that the compiler API used
          // doesnt accept any input data like to pause and wait for input. no more any other to say just 0 or 1 only. 
          // note that it is okay to give 1 if its partially correct. please do consider if code is beginner.
          // strictly give answer and stick to the output from the given code. do stricly give 0 if out of nowhere code and results`;

          // let askForPoints = `From this total points ->${questions[currentIndex].points} <- as maximum. 
          // what can you give points from this code ->${code}<- using ${compiler.name} programming language with this question
          // ->${questions[currentIndex].text}<- with this output ->${output}<- from the given code give result 
          // just number only remove the newline. by giving points please stick to the output from the given code
          // please take note and have consideration that the compiler API used
          // doesnt accept any input data like to pause and wait for input. stricly no more any other to say just points only.
          // please do consider to give more points especially if code is beginner`;

    

          // let askForPoints = `From a total of ->${questions[currentIndex].points}<- points maximum, 
          // how many points would you assign to this code ->${code}<- using the ${compiler.name} programming language for the question 
          // ->${questions[currentIndex].text}<- with the output ->${output_result}<-? 
          // Please respond with just a number, without any newlines. Stick to the output from the given code. 
          // Note that the compiler API does not accept input data or pause for input. 
          // Strictly respond with points only, and consider giving more points, especially for beginner code.`;

        //   let askForPoints = `From a total of ->${question_points}<- points maximum, 
        //   how many points would you assign to this code ->${code}<- using the ${compiler.name} programming language for the question 
        //   ->${questions[currentIndex].text}<- with the output ->${output_result}<-? 
        //   Please respond with just a number, without any newlines. Stick to the output from the given code. 
        //   Note that the compiler API does not accept input data or pause for input. 
        //   Strictly look for the valid question to give points and the given code and output of the code.
        //   Strictly respond with points only, and consider giving more points, especially for beginner code.
        //  `;

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

          //console.log(askForCorrection)
          //console.log(askForPoints)
          // console.log(result)
          // console.log(result.data.data)
          // console.log(result2)
          // console.log(result2.data.data)

          updatedCorrect[currentIndex] = result.data.data; // Assign the value if it's not text
          updatedPoints[currentIndex] = result2.data.data; // Assign the value if it's not text
        
          // Update state with the new arrays
          setPoints(updatedPoints);
          setCorrect(updatedCorrect);
        } catch (error) {
          console.error("Error fetching question:", error);
        }
      };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 space-y-4">
      {currentQuestion && (
        <div className="space-y-4">
          {!started ? (
              <div className="text-center">
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
            ) : 
              <div className="p-4 border rounded bg-white shadow">
                  <h2 className="text-lg font-semibold mb-2">
                    Question {currentIndex + 1} of {questions.length}
                  </h2>
                  <p className="mb-2">{currentQuestion.text}</p>
                  <p className="text-sm text-gray-600">
                    Points: {points[currentIndex]} / {currentQuestion.points}
                  </p>
                   <p className="text-sm">
                    Correct: {correct[currentIndex] == 1 ? 'true' : 'false'}
                  </p>
                </div>
            }

          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={compiler.language}
            height="400px"
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

          <button
            onClick={startingCode}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium w-full px-4 py-3 rounded"
          >
            Starting Code
          </button>

          
            {!started ? (
              null
            ) : 
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
            }

          <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
            {output}
          </div>

        </div>
      )}
    </div>
  );
};

export default AssignmentAnswerPage;
