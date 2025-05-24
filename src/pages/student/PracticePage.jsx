import React from "react";
import { FiCode } from "react-icons/fi";

const PracticePage = () => {
  const practiceQuizzes = [
    {
      id: 1,
      title: "Python Basics",
      category: "Beginner",
      questions: 10,
      progress: 25,
    },
    {
      id: 2,
      title: "Algorithms",
      category: "Advanced",
      questions: 15,
      progress: 60,
    },
  ];

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Practice Coding</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            My Progress
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {quiz.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {quiz.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {quiz.questions} questions
                </p>

                <div className="flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${quiz.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {quiz.progress}% solved
                  </span>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  <FiCode className="mr-2" /> Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PracticePage;
