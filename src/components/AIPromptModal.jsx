import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { askPrompt } from "../utils/authService";

const AIPromptModal = ({
  isOpen,
  onClose,
  onSelectQuestion,
  activityType,
  progLanguage,
  questionType,
}) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateQuestions();
    }
  }, [isOpen, activityType, questionType]);

  const generateQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);

    try {
      let prompt = "";
      const topic = progLanguage || "programming";

      if (questionType === "multiple_choice") {
        prompt = `Generate 3 multiple choice questions about ${topic} with these requirements:
        - Each question should have 1 correct answer and 3 incorrect answers
        - Assign points based on question difficulty (1 for easy, 2 for medium, 3 for hard)
        - Format exactly like this:

        1. Question: [question text]
        Points: [number]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]

        2. Question: [question text]
        Points: [number]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]

        3. Question: [question text]
        Points: [number]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]`;
      } else {
        prompt = `Generate 3 programming problems about ${topic} with these requirements:
        - Each problem should be a clear, practical coding task
        - Include one sample input/output pair
        - Assign points based on problem difficulty (1 for easy, 2 for medium, 3 for hard)
        - Focus on real-world application
        - Format exactly like this:
        
        1. Problem: [description] 
        Points: [number]
        Input: [example]
        Output: [value]
        
        2. Problem: [description]
        Points: [number]
        Input: [example]
        Output: [value]
        
        3. Problem: [description]
        Points: [number]
        Input: [example]
        Output: [value]`;
      }

      const result = await askPrompt(prompt);
      if (result.success) {
        const generatedQuestions = parseQuestions(
          result.data.data,
          questionType
        );
        setQuestions(generatedQuestions);
      } else {
        toast.error("Failed to generate questions");
        setQuestions([
          { error: "Failed to generate questions. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate questions");
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuestions = (response, type) => {
    if (type === "multiple_choice") {
      const quizRegex =
        /(\d+)\. Question: (.*?)\s+Points: (\d+)\s+A\) (.*?)\s+B\) (.*?)\s+C\) (.*?)\s+D\) (.*?)\s+Answer: (.*?)(?=\s+\d+\. Question:|$)/gs;
      const matches = [...response.matchAll(quizRegex)];
      return matches.map((match) => ({
        type: "multiple_choice",
        text: match[2].trim(),
        points: parseInt(match[3]) || 1,
        options: [
          { letter: "A", text: match[4].trim() },
          { letter: "B", text: match[5].trim() },
          { letter: "C", text: match[6].trim() },
          { letter: "D", text: match[7].trim() },
        ],
        answer: match[8].trim(),
      }));
    } else {
      const programmingRegex =
        /(\d+)\. Problem: (.*?)\s+Points: (\d+)\s+Input: (.*?)\s+Output: (.*?)(?=\s+\d+\. Problem:|$)/gs;
      const matches = [...response.matchAll(programmingRegex)];
      return matches.map((match) => ({
        type: "programming",
        text: `${match[2].trim()} (Input: ${match[4].trim()})`,
        points: parseInt(match[3]) || 1,
        expectedOutput: match[5].trim(),
      }));
    }
  };

  const renderQuestion = (question, index) => {
    if (question.error) {
      return (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 bg-red-50"
        >
          <p className="text-red-600">{question.error}</p>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="border border-gray-200 rounded-lg p-3 bg-gray-50 mb-3"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">
            {question.type === "multiple_choice" ? "Question" : "Problem"} #
            {index + 1}
          </h4>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {question.points} point{question.points !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-gray-700 mb-2">{question.text}</p>

        {question.type === "multiple_choice" ? (
          <div className="space-y-2 mt-3">
            {question.options.map((option) => (
              <div
                key={option.letter}
                className={`p-2 border rounded ${
                  question.answer === option.letter
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <span className="font-medium mr-2">{option.letter})</span>
                {option.text}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700">
              Expected Output:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
              {question.expectedOutput}
            </pre>
          </div>
        )}

        <button
          onClick={() => onSelectQuestion(question)}
          className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Use This Question
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {questionType === "multiple_choice"
            ? "Multiple Choice"
            : "Programming"}{" "}
          Questions
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">AI Suggestions</h4>
          <button
            onClick={generateQuestions}
            disabled={isLoading}
            className="cursor-pointer flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FiRefreshCw
              className={`mr-1 ${isLoading ? "animate-spin" : ""}`}
              size={16}
            />
            Regenerate
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal;
