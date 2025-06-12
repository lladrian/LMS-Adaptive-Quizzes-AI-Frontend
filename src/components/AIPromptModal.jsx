import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiX, FiRefreshCw, FiCopy, FiCheck } from "react-icons/fi";
import { askPrompt } from "../utils/authService";

const AIPromptModal = ({ isOpen, onClose, onSelectQuestion }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState({
    text: "",
    expectedOutput: "",
  });

  useEffect(() => {
    if (isOpen) {
      generateQuestions();
    }
  }, [isOpen]);

  const generateQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);

    try {
      const prompt = `Generate 3 concise programming questions with these requirements:
      - Each question should be one clear sentence
      - Include one sample input and output
      - No explanations needed
      
      Format exactly like this:
      
      1. Problem: [description]
      Input: [example]
      Output: [example]
      
      2. Problem: [description]
      Input: [example]
      Output: [example]
      
      3. Problem: [description]
      Input: [example]
      Output: [example]`;

      const result = await askPrompt(prompt);
      if (result.success) {
        const generatedQuestions = parseQuestions(result.data.data);
        setQuestions(generatedQuestions);
      } else {
        toast.error("Failed to generate questions");
        setQuestions([
          {
            problem: "Error generating questions",
            input: "Try again",
            output: "or enter manually",
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate questions");
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuestions = (response) => {
    const questionRegex =
      /\d+\. Problem: (.*?)\s+Input: (.*?)\s+Output: (.*?)(?=\s+\d+\. Problem:|$)/gs;
    const matches = [...response.matchAll(questionRegex)];
    return matches.map((match) => ({
      problem: match[1].trim(),
      input: match[2].trim(),
      output: match[3].trim(),
    }));
  };

  const handleSelectQuestion = (question) => {
    onSelectQuestion({
      text: question.problem,
      expectedOutput: `Input: ${question.input}\nOutput: ${question.output}`,
    });
  };

  const handleUseCustomQuestion = () => {
    if (customQuestion.text.trim()) {
      onSelectQuestion(customQuestion);
    } else {
      toast.error("Please enter a question");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Generate Questions</h3>
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
            className="cursor-pointer flex items-center text-sm text-blue-600"
          >
            <FiRefreshCw
              className={`mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Regenerate
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <p className="font-medium mb-1">{q.problem}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Input:</span>
                    <p className="font-mono">{q.input}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Output:</span>
                    <p className="font-mono">{q.output}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectQuestion(q)}
                  className="cursor-pointer mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border border-gray-300 bg-gray-100 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal;
