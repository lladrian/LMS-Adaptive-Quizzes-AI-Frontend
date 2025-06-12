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
  questionType, // Add this prop to know which type is currently selected
}) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateQuestions();
    }
  }, [isOpen, activityType, questionType]); // Add questionType to dependencies

  const generateQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);

    try {
      let prompt = "";
      const topic = progLanguage || "programming"; // fallback if not defined

      if (activityType === "quiz") {
        prompt = `Generate 3 multiple choice quiz questions about ${topic} with these requirements:
        - Each question should have 1 correct answer and 3 incorrect answers
        - Format exactly like this:

        1. Question: [question text]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]

        2. Question: [question text]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]

        3. Question: [question text]
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]`;
      } else if (activityType === "programming") {
        prompt = `Generate 3 concise programming questions with these requirements:
        - Each question should be one clear sentence
        - Include one sample input in parentheses
        - Only provide the output value in the output field
        - Format exactly like this:
        
        1. Problem: [description] (Input: [example])
        Output: [value]
        
        2. Problem: [description] (Input: [example])
        Output: [value]
        
        3. Problem: [description] (Input: [example])
        Output: [value]`;
      } else if (activityType === "exam") {
        // Focus on the selected question type when in exam mode
        if (questionType === "multiple_choice") {
          prompt = `Generate 3 multiple choice exam questions about ${topic} with these requirements:
          - Each question should have 1 correct answer and 3 incorrect answers
          - Questions should be exam-level difficulty
          - Format exactly like this:

          1. Question: [question text]
          A) [option 1]
          B) [option 2]
          C) [option 3]
          D) [option 4]
          Answer: [correct letter]

          2. Question: [question text]
          A) [option 1]
          B) [option 2]
          C) [option 3]
          D) [option 4]
          Answer: [correct letter]

          3. Question: [question text]
          A) [option 1]
          B) [option 2]
          C) [option 3]
          D) [option 4]
          Answer: [correct letter]`;
        } else if (questionType === "programming") {
          prompt = `Generate 3 programming exam questions with these requirements:
          - Each question should be one clear sentence
          - Include one sample input in parentheses
          - Only provide the output value in the output field
          - Questions should be exam-level difficulty
          - Format exactly like this:
          
          1. Problem: [description] (Input: [example])
          Output: [value]
          
          2. Problem: [description] (Input: [example])
          Output: [value]
          
          3. Problem: [description] (Input: [example])
          Output: [value]`;
        } else {
          // Default to mixed types if no specific type is selected
          prompt = `Generate 3 questions with mixed types (programming and multiple choice) for an exam:
          - For programming questions: include sample input in parentheses and just the output value
          - For multiple choice: make sure the question is related to the topic: "${topic}"
          - Format exactly like this:
          
          1. [PROGRAMMING] Problem: [description] (Input: [example])
          Output: [value]
          
          2. [MULTIPLE CHOICE] Question: [question text]
          A) [option 1]
          B) [option 2]
          C) [option 3]
          D) [option 4]
          Answer: [correct letter]
          
          3. [PROGRAMMING] Problem: [description] (Input: [example])
          Output: [value]`;
        }
      }

      const result = await askPrompt(prompt);
      if (result.success) {
        const generatedQuestions = parseQuestions(
          result.data.data,
          activityType,
          questionType // Pass questionType to parser
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

  const parseQuestions = (response, type, currentQuestionType) => {
    if (
      type === "quiz" ||
      (type === "exam" && currentQuestionType === "multiple_choice")
    ) {
      const quizRegex =
        /(\d+)\. Question: (.*?)\s+A\) (.*?)\s+B\) (.*?)\s+C\) (.*?)\s+D\) (.*?)\s+Answer: (.*?)(?=\s+\d+\. Question:|$)/gs;
      const matches = [...response.matchAll(quizRegex)];
      return matches.map((match) => ({
        type: "multiple_choice",
        question: match[2].trim(),
        options: [
          { letter: "A", text: match[3].trim() },
          { letter: "B", text: match[4].trim() },
          { letter: "C", text: match[5].trim() },
          { letter: "D", text: match[6].trim() },
        ],
        answer: match[7].trim(),
      }));
    } else if (
      type === "programming" ||
      (type === "exam" && currentQuestionType === "programming")
    ) {
      const programmingRegex =
        /(\d+)\. Problem: (.*?)\s+Output: (.*?)(?=\s+\d+\. Problem:|$)/gs;
      const matches = [...response.matchAll(programmingRegex)];
      return matches.map((match) => ({
        type: "programming",
        problem: match[2].trim(),
        output: match[3].trim(),
      }));
    } else if (type === "exam") {
      // Only parse mixed types if no specific questionType was provided
      const examRegex =
        /(\d+)\. \[(PROGRAMMING|MULTIPLE CHOICE)\] (.*?)(?:\s+Output: (.*?)|(?:\s+A\) (.*?)\s+B\) (.*?)\s+C\) (.*?)\s+D\) (.*?)\s+Answer: (.*?)))(?=\s+\d+\. \[|$)/gs;
      const matches = [...response.matchAll(examRegex)];
      const questions = [];

      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        if (match[2] === "PROGRAMMING") {
          questions.push({
            type: "programming",
            problem: match[3].trim(),
            output: match[4].trim(),
          });
        } else {
          questions.push({
            type: "multiple_choice",
            question: match[3].trim(),
            options: [
              { letter: "A", text: match[5].trim() },
              { letter: "B", text: match[6].trim() },
              { letter: "C", text: match[7].trim() },
              { letter: "D", text: match[8].trim() },
            ],
            answer: match[9].trim(),
          });
        }
      }
      return questions;
    }

    return [];
  };

  const handleSelectQuestion = (question) => {
    if (question.type === "multiple_choice") {
      onSelectQuestion({
        text: question.question,
        options: question.options,
        answer: question.answer,
        points: 1,
        type: "multiple_choice",
      });
    } else {
      onSelectQuestion({
        text: question.problem,
        expectedOutput: question.output,
        points: 1,
        type: "programming",
      });
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

    if (question.type === "multiple_choice") {
      return (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 bg-gray-50"
        >
          <p className="font-medium mb-1">{question.question}</p>
          <div className="space-y-1 mt-2">
            {question.options.map((option) => (
              <div key={option.letter} className="flex items-center">
                <span className="font-medium mr-2">{option.letter})</span>
                <span>{option.text}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-green-600 mt-2">
            Correct answer: {question.answer}
          </p>
          <button
            onClick={() => handleSelectQuestion(question)}
            className="cursor-pointer mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Select
          </button>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 bg-gray-50"
        >
          <p className="font-medium mb-1">{question.problem}</p>
          <div className="text-sm">
            <div>
              <span className="text-gray-500">Expected output:</span>
              <p className="font-mono bg-white p-1 rounded mt-1">
                {question.output}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelectQuestion(question)}
            className="cursor-pointer mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Select
          </button>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Generate{" "}
          {activityType === "quiz"
            ? "Quiz"
            : activityType === "exam"
            ? questionType === "multiple_choice"
              ? "Multiple Choice Exam"
              : questionType === "programming"
              ? "Programming Exam"
              : "Exam"
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
            {questions.map((question, index) =>
              renderQuestion(question, index)
            )}
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
