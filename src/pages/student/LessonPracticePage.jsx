import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import {
  compilerRunCode,
  allLanguage,
  askAI,
  extractMaterialData,
  specificClassroom,
} from "../../utils/authService";
import renderFormattedTextGemini from "../../components/GeminiTextFormatter";

const LessonPracticePage = () => {
  const { classId, lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [practiceData, setPracticeData] = useState([]);
  const [code, setCode] = useState("print('Hello, World!')");
  const [output, setOutput] = useState("");
  const [solution, setSolution] = useState("");
  const [material, setMaterial] = useState("");
  const [compiler, setCompiler] = useState({
    name: "Python",
    language: "python",
    version: "3.10.0",
    starting_code: "print('Hello, World!')",
  });
  const [languages, setLanguages] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecificClassroom();
    fetchMaterialData();
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

  const fetchMaterialData = async () => {
    try {
      const result = await extractMaterialData(lessonId);
      setMaterial(result.data.data);
      fetchQuiz(result.data.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const fetchQuiz = async (material) => {
    try {
      let ask = `Give me one simple programming quiz using ${compiler.name} programming.
        strictly use this -> ${material} <- as reference for the quiz questions.  
        Do not give any solutions and instructions, just problems only. 
        make it unique quiz to practice. Put also sample result for easy to 
        understand especially for beginner. strictly no more to say.. 
        strictly no more input related problem or question. 
        strictly one problem or question only`;

      const result = await askAI(ask);

      setPracticeData([
        {
          text: result.data.data,
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
    fetchQuiz(material);
    setOutput("");
    setSolution("");
    setCode("");
  };

  const handleSolution = () => {
    getQuizSolution(practiceData[currentQuestionIndex].text);
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

  const startingCode = async () => {
    setCode(languages[0].starting_code || ""); // ✅ Also update the code shown to the user
  };

  const currentQuestion = practiceData[currentQuestionIndex];

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
          <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap">
            {output}
          </div>
          {solution && (
            <div className="bg-gray-100 border border-gray-300 rounded p-4 whitespace-pre-wrap mb-5">
              <h1 className="text-xl">Solution:</h1>
              {renderFormattedTextGemini(solution)}
            </div>
          )}
          <div className="flex gap-4">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="p-4 border rounded bg-white shadow">
                <div className="p-4 border rounded bg-white shadow">
                  {renderFormattedTextGemini(currentQuestion.text)}
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
                  onClick={handleSolution}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium w-full px-4 py-3 rounded"
                >
                  Show Solution
                </button>

                <button
                  onClick={handleNext}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language={classroom?.classroom?.programming_language}
                height="500px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPracticePage;
