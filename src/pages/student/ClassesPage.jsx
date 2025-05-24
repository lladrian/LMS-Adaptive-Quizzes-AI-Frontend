import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiMessageSquare } from 'react-icons/fi';

const ClassesPage = () => {
  const enrolledClasses = [
    { id: 1, name: 'Advanced Programming', code: 'CS401', instructor: 'Dr. Smith' },
    { id: 2, name: 'Data Structures', code: 'CS301', instructor: 'Prof. Lee' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Join New Class
        </button>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledClasses.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{cls.name}</h3>
                <p className="text-gray-600 mb-3">{cls.code} • {cls.instructor}</p>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>12 Lessons</span>
                  <span>3 Assignments</span>
                </div>

                <div className="flex justify-between">
                  <Link 
                    to={`/student/class/${cls.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Class
                  </Link>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <FiMessageSquare className="mr-1" /> Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClassesPage;