import React from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { updateActivity } from "../utils/authService";

const EditActivityModal = ({
  isOpen,
  onClose,
  activity,
  onUpdateSuccess,
  classId,
}) => {
  const [activityToEdit, setActivityToEdit] = React.useState(() => {
    // Initialize with proper correct option mapping
    if (activity?.question) {
      const questions = activity.question.map((q) => {
        if (q.answer_type === "options" && q.correct_option) {
          h;
          // Find which option key contains the correct answer
          const optionKey =
            Object.entries(q.options || {}).find(
              ([_, value]) => value === q.correct_option
            )?.[0] || q.correct_option;
          return {
            ...q,
            correct_option: optionKey,
          };
        }
        return q;
      });
      return { ...activity, question: questions };
    }
    return activity;
  });

  const handleOptionChange = (questionIndex, optionKey, value) => {
    const updatedQuestions = [...activityToEdit.question];
    updatedQuestions[questionIndex].options[optionKey] = value;
    setActivityToEdit((prev) => ({ ...prev, question: updatedQuestions }));
  };

  const handleCorrectOptionChange = (questionIndex, optionKey) => {
    const updatedQuestions = [...activityToEdit.question];
    updatedQuestions[questionIndex].correct_option = optionKey;
    setActivityToEdit((prev) => ({ ...prev, question: updatedQuestions }));
  };

  const handleExpectedOutputChange = (questionIndex, value) => {
    const updatedQuestions = [...activityToEdit.question];
    updatedQuestions[questionIndex].expected_output = value;
    setActivityToEdit((prev) => ({ ...prev, question: updatedQuestions }));
  };

  const handleEditActivity = async () => {
    try {
      if (!activityToEdit) {
        toast.error("No activity data to update");
        return;
      }

      // Debug: Log current state to check values
      console.log("Current activity state:", {
        classId,
        title: activityToEdit.title,
        description: activityToEdit.description,
        grading_breakdown: activityToEdit.grading_breakdown,
        submission_time: activityToEdit.submission_time,
        type: activityToEdit.type,
        questions: activityToEdit.question,
      });

      // Validate required fields with more specific checks
      const missingFields = [];
      if (!classId) missingFields.push("classroom_id");
      if (!activityToEdit.title?.trim()) missingFields.push("title");
      if (!activityToEdit.description?.trim())
        missingFields.push("description");
      if (!activityToEdit.grading_breakdown?.trim())
        missingFields.push("grading_breakdown");
      if (!activityToEdit.submission_time) missingFields.push("time_limit");
      if (!activityToEdit.question?.length) missingFields.push("questions");

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      // Validate each question
      const questionErrors = [];
      activityToEdit.question.forEach((q, index) => {
        if (!q.text?.trim()) questionErrors.push(`Question ${index + 1} text`);
        if (!q.points) questionErrors.push(`Question ${index + 1} points`);
        if (!q.answer_type)
          questionErrors.push(`Question ${index + 1} answer type`);

        if (q.answer_type === "options") {
          if (!q.options || Object.keys(q.options).length === 0) {
            questionErrors.push(`Question ${index + 1} options`);
          }
          if (!q.correct_option) {
            questionErrors.push(`Question ${index + 1} correct option`);
          }
        } else if (
          q.answer_type === "programming" &&
          !q.expected_output?.trim()
        ) {
          questionErrors.push(`Question ${index + 1} expected output`);
        }
      });

      if (questionErrors.length > 0) {
        toast.error(`Missing question fields: ${questionErrors.join(", ")}`);
        return;
      }

      // Prepare payload with correct field names
      const payload = {
        classroom_id: classId,
        question: activityToEdit.question.map((q) => ({
          text: q.text.trim(),
          points: Number(q.points),
          answer_type: q.answer_type,
          ...(q.answer_type === "options"
            ? {
                options: q.options,
                correct_option:
                  q.options?.[q.correct_option] || q.correct_option,
              }
            : {
                expected_output: q.expected_output.trim(),
              }),
        })),
        time_limit: Number(activityToEdit.submission_time),
        title: activityToEdit.title.trim(),
        description: activityToEdit.description.trim(),
        grading_breakdown: activityToEdit.grading_breakdown.trim(),
      };

      console.log("Payload being sent:", payload); // Debug log

      const result = await updateActivity(activityToEdit._id, payload);

      if (result.success) {
        toast.success("Activity updated successfully");
        onClose();
        onUpdateSuccess();
      } else {
        toast.error(result.error || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error(error.message || "An error occurred while updating");
    }
  };

  if (!isOpen || !activityToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit {activityToEdit.type}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={activityToEdit.title || ""}
                onChange={(e) =>
                  setActivityToEdit((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={activityToEdit.description || ""}
                onChange={(e) =>
                  setActivityToEdit((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={activityToEdit.submission_time || 0}
                onChange={(e) =>
                  setActivityToEdit((prev) => ({
                    ...prev,
                    submission_time: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grading Breakdown
              </label>
              <input
                type="text"
                value={activityToEdit.grading_breakdown || ""}
                onChange={(e) =>
                  setActivityToEdit((prev) => ({
                    ...prev,
                    grading_breakdown: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            {activityToEdit.question?.map((q, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div className="mb-4">
                  <span className="font-medium">Question {index + 1}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    (
                    {q.answer_type === "options"
                      ? "Multiple Choice"
                      : "Programming"}
                    )
                  </span>
                </div>

                <textarea
                  value={q.text || ""}
                  onChange={(e) => {
                    const updatedQuestions = [...activityToEdit.question];
                    updatedQuestions[index].text = e.target.value;
                    setActivityToEdit((prev) => ({
                      ...prev,
                      question: updatedQuestions,
                    }));
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 resize-none overflow-hidden"
                  rows={6}
                  style={{ minHeight: "40px" }}
                />

                {q.answer_type === "options" ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options (Select the correct answer)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(q.options || {}).map(([key, value]) => {
                        const isCorrect = q.correct_option === key;
                        return (
                          <div key={key} className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-option-${index}`}
                              checked={isCorrect}
                              onChange={() =>
                                handleCorrectOptionChange(index, key)
                              }
                              className="mr-2"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleOptionChange(index, key, e.target.value)
                              }
                              className={`w-full border rounded-md px-3 py-1 ${
                                isCorrect
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expected Output
                    </label>
                    <textarea
                      value={q.expected_output || ""}
                      onChange={(e) =>
                        handleExpectedOutputChange(index, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                    />
                  </div>
                )}

                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Points:</span>
                  <input
                    type="number"
                    value={q.points || 0}
                    onChange={(e) => {
                      const updatedQuestions = [...activityToEdit.question];
                      updatedQuestions[index].points = parseInt(e.target.value);
                      setActivityToEdit((prev) => ({
                        ...prev,
                        question: updatedQuestions,
                      }));
                    }}
                    className="w-20 border border-gray-300 rounded-md px-3 py-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditActivity}
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;
