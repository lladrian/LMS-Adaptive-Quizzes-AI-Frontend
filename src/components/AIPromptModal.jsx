import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiX, FiRefreshCw, FiCheck } from "react-icons/fi";
import {
  askPrompt,
  allMaterialsSpecificClass,
  specificMaterial,
  extractMaterialData,
} from "../utils/authService";

const AIPromptModal = ({
  isOpen,
  onClose,
  onSelectQuestions,
  progLanguage,
  questionType,
  classId,
}) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialContent, setMaterialContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMaterials, setIsFetchingMaterials] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
      setStep(1);
      setSelectedMaterial(null);
      setMaterialContent("");
      setQuestions([]);
      setSelectedQuestions([]);
    }
  }, [isOpen, classId]);

  const fetchMaterials = async () => {
    setIsFetchingMaterials(true);
    try {
      const result = await allMaterialsSpecificClass(classId);
      if (result.success) {
        setMaterials(result.data.data || []);
      } else {
        toast.error(result.error || "Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Failed to fetch materials");
    } finally {
      setIsFetchingMaterials(false);
    }
  };

  const handleMaterialSelect = async (material) => {
    setIsLoading(true);
    try {
      const materialResult = await specificMaterial(material._id);
      if (!materialResult.success) {
        throw new Error(materialResult.error);
      }

      const contentResult = await extractMaterialData(material._id);
      if (!contentResult.success) {
        throw new Error(contentResult.error);
      }

      setSelectedMaterial(materialResult.data.data);
      setMaterialContent(contentResult?.data.data || "");
      setStep(2);
    } catch (error) {
      console.error("Error loading material:", error);
      toast.error(error.message || "Failed to load material content");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionSelection = (question) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.some((q) => q.text === question.text);
      if (isSelected) {
        return prev.filter((q) => q.text !== question.text);
      } else {
        return [...prev, question];
      }
    });
  };

  const generateQuestions = async () => {
    if (!materialContent) {
      toast.warning("No material content available to generate questions");
      return;
    }

    setIsLoading(true);
    setQuestions([]);
    setSelectedQuestions([]);

    try {
      let prompt = "";
      const topic = selectedMaterial?.title || progLanguage || "the material";

      if (questionType === "multiple_choice") {
        prompt = `Based on the following material about ${topic}, generate 5 multiple choice questions:
        
        Material Title: ${selectedMaterial?.title || "Untitled"}
        Material Description: ${
          selectedMaterial?.description || "No description"
        }
        
        Content Excerpt:
        ${materialContent.substring(0, 1000)}${
          materialContent.length > 1000 ? "..." : ""
        }

        Requirements:
        - Each question must directly relate to the material content
        - Include 1 correct answer and 3 plausible distractors
        - Format exactly like this example:

        1. Question: [question text]
        Points: 1
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]

        2. Question: [question text]
        Points: 1
        A) [option 1]
        B) [option 2]
        C) [option 3]
        D) [option 4]
        Answer: [correct letter]`;
      } else {
        prompt = `Based on the following programming material, generate 5 coding problems:
        
        Material Title: ${selectedMaterial?.title || "Untitled"}
        Programming Language: ${progLanguage || "general"}
        
        Content Excerpt:
        ${materialContent.substring(0, 1000)}${
          materialContent.length > 1000 ? "..." : ""
        }

        Requirements:
        - Each problem should be a clear, practical coding task from the material
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
        throw new Error(result.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error(error.message || "Failed to generate questions");
      setQuestions([
        {
          error:
            error.message || "Failed to generate questions. Please try again.",
          type: questionType,
        },
      ]);
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

  const handleAddSelectedQuestions = () => {
    if (selectedQuestions.length === 0) {
      toast.warning("Please select at least one question");
      return;
    }
    onSelectQuestions(selectedQuestions);
    onClose();
  };

  const renderMaterialSelection = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Select Material to Base Questions On</h4>

      {isFetchingMaterials ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : materials.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No materials available for this class
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {materials.map((material) => (
            <div
              key={material._id}
              onClick={() => handleMaterialSelect(material)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedMaterial?._id === material._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex">
                  <h5 className="text-sm font-medium mr-2">Title:</h5>
                  <p className="text-sm text-gray-700 truncate">
                    {material.title}
                  </p>
                </div>
                {selectedMaterial?._id === material._id && (
                  <FiCheck className="text-blue-600" />
                )}
              </div>
              <div className="flex justify-base items-center">
                <h5 className="text-sm font-medium mr-2">Description:</h5>
                <span className="text-sm text-gray-700 truncate">
                  {material.description}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(material.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={onClose}
          className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!selectedMaterial}
          className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${
            selectedMaterial
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderQuestionGeneration = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium mb-1">Generating Questions From:</h4>
          <div className="flex">
            <h5 className="text-sm font-medium mr-2">Title:</h5>
            <p className="text-sm text-gray-700 truncate">
              {selectedMaterial?.title}
            </p>
          </div>
          <div className="flex">
            <h5 className="text-sm font-medium mr-2">Description:</h5>
            <p className="text-xs text-gray-500 truncate">
              {selectedMaterial?.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep(1)}
          className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
        >
          Change Material
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <h5 className="text-sm font-medium mb-1">Material Preview:</h5>
        <p className="text-sm text-gray-600 line-clamp-3">
          {materialContent.substring(0, 300)}
          {materialContent.length > 300 ? "..." : ""}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
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
          {questions.length > 0 ? "Regenerate" : "Generate"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>
      )}

      {questions.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            {selectedQuestions.length} question(s) selected
          </div>
          <button
            onClick={handleAddSelectedQuestions}
            disabled={selectedQuestions.length === 0}
            className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${
              selectedQuestions.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add Selected Questions
          </button>
        </div>
      )}
    </div>
  );

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

    const isSelected = selectedQuestions.some((q) => q.text === question.text);

    return (
      <div
        key={index}
        className={`border rounded-lg p-3 mb-3 cursor-pointer transition-all ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={() => toggleQuestionSelection(question)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${
                isSelected
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {isSelected && <FiCheck className="text-white" size={14} />}
            </div>
            <h4 className="font-medium">
              {question.type === "multiple_choice" ? "Question" : "Problem"} #
              {index + 1}
            </h4>
          </div>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {question.points} point{question.points !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-gray-700 mb-2 ml-7">{question.text}</p>

        {question.type === "multiple_choice" ? (
          <div className="space-y-2 mt-3 ml-7">
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
          <div className="mt-3 ml-7">
            <p className="text-sm font-medium text-gray-700">
              Expected Output:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm mt-1 whitespace-pre-wrap">
              {question.expectedOutput}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {step === 1 ? "Select Material" : "Generate Questions"}
        </h3>
        <button
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="p-4">
        {step === 1 ? renderMaterialSelection() : renderQuestionGeneration()}
      </div>
    </div>
  );
};

export default AIPromptModal;
