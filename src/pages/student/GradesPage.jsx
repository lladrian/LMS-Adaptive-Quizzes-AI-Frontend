import React from "react";
import { FiAward, FiDownload } from "react-icons/fi";

const GradesPage = () => {
  const classes = [
    {
      id: 1,
      name: "Advanced Programming",
      code: "CS401",
      average: "85.6%",
      assignments: [
        { id: 1, title: "Sorting Quiz", due: "2023-05-10", score: "85/100" },
        { id: 2, title: "Midterm Exam", due: "2023-05-24", score: "88/100" },
      ],
    },
    {
      id: 2,
      name: "Data Structures",
      code: "CS301",
      average: "89.2%",
      assignments: [
        { id: 1, title: "Linked Lists", due: "2023-05-05", score: "92/100" },
        {
          id: 2,
          title: "Trees Assignment",
          due: "2023-05-19",
          score: "87/100",
        },
      ],
    },
  ];

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">My Grades</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <FiDownload className="mr-2" /> Download Report
        </button>
      </header>

      <div className="p-6 space-y-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">
                {cls.name} ({cls.code})
              </h3>
              <div className="flex items-center">
                <FiAward className="text-yellow-500 mr-2" />
                <span className="font-medium">Average: {cls.average}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cls.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {assignment.due}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{assignment.score}</span>
                      <span className="block text-xs text-green-600">
                        Graded
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GradesPage;
