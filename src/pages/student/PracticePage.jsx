import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import {
  compilerRunCode,
  allLanguage,
  askAI,
  specificClassroom
} from "../../utils/authService";
import renderFormattedTextGemini from "../../components/GeminiTextFormatter";


const PracticePage = () => {
  const { classId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [practiceData, setPracticeData] = useState([]);
  const [code, setCode] = useState("print('Hello, World!')");
  const [output, setOutput] = useState("");
  const [solution, setSolution] = useState("");
  const [compiler, setCompiler] = useState({
      name: "Python",
      language: "python",
      version: "3.10.0",
      starting_code: "print('Hello, World!')",
  });
  const [languages, setLanguages] = useState([]);
  const [classroom, setClassroom] = useState(null);
  

  useEffect(() => {
    fetchSpecificClassroom();

  }, []);


     const fetchQuiz = async (language) => {
      try {
        let ask = `Give me one simple programming quiz using ${language} programming. 
        Do not give any solutions and instructions, just problems only. 
        make it unique quiz to practice. Put also sample result for easy to 
        understand especially for beginner. strictly no more to say.. no more input related quiz`;

        const result = await askAI(ask);

        setPracticeData([
          {
            text: result.data.data
          },
        ]);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };




    const getQuizSolution = async (problem) => {
      try {
        let ask = `Give me unique solution of this problem -> ${problem} <- using ${compiler.name}. 
            give me the exact solution with no any words to say. remove also the comments 
            just pure code for solution only. put sample results using print statement. 
            `;
        const result = await askAI(ask);

        setSolution(result.data.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

      const runCode = async () => {
        try {
          const result = await compilerRunCode(
            languages[0].language,
            languages[0].version,
            code
          );
          setOutput(result.data.data.run.output);
        } catch (error) {
          console.error(error);
          setOutput("Error running code.");
        }
      };


  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleNext = () => {
    fetchQuiz();
    setOutput("");
    setSolution("");
    setCode("");
  };

   const handleSolution = () => {
    getQuizSolution(practiceData[currentQuestionIndex].text);
  };


      const fetchSpecificClassroom = async () => {
      try {
        const result = await specificClassroom(classId);

        if (result.success) {
          setClassroom(result.data.data);
          fetchLanguages(result.data.data.classroom.programming_language);
          fetchQuiz(result.data.data.classroom.programming_language);
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
    

  const handleCompilerChange = (e) => {
    const selected = JSON.parse(e.target.value);
    setCompiler(selected);
    setCode(selected.starting_code || "");
  };

  const currentQuestion = practiceData[currentQuestionIndex];
  
  return (
    <div className="p-6 space-y-4">
      {currentQuestion && (
        <div className="space-y-4">
          <div className="p-4 border rounded bg-white shadow">
               {renderFormattedTextGemini(currentQuestion.text)}
          </div>

          {solution && (
              <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
                <h1 className="text-xl">Solution:</h1>
                   {renderFormattedTextGemini(solution)}
              </div>
          )}

          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={classroom.classroom.programming_language}
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

          <div className="flex justify-between gap-1">
              <button
                onClick={handleSolution}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium w-full px-4 py-3 rounded"
              >
                Show Solution
              </button>

              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full px-4 py-3 rounded"
              >
                Next
              </button>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
