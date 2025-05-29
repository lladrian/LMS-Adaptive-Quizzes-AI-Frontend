import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiDownload,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiPlay,
  FiCheck,
  FiX,
} from "react-icons/fi";
import CodeEditor from "../../components/CodeEditor";
import {specificClassroom, 
allAnswerExamSpecificStudentSpecificClassroom,
allAnswerQuizSpecificStudentSpecificClassroom
} from "../../utils/authService";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState("lessons");
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [materials, setMaterial] = useState([]);
  const [assignments, setAssignment] = useState([]);
  const [answers, setAnswer] = useState([]);
  const [students, setStudent] = useState([]);
  const studentId = localStorage.getItem("userId");
//   not yet  // student hasn't opened the exam
// ongoing  // student started, not yet submitted
// pending  // student submitted, not yet graded
// graded // student submitted, yet graded


  useEffect(() => {
      fetchSpecificClassroom();
  }, []);
  
  const fetchSpecificClassroom = async () => {
      setIsLoading(true);
      try {
        const result = await specificClassroom(classId);
        const result2 = await allAnswerExamSpecificStudentSpecificClassroom(classId, studentId);
        const result3 = await allAnswerQuizSpecificStudentSpecificClassroom(classId, studentId);

        if (result.success && result2.success && result3.success) {
          setClassroom(result.data.data);
          setMaterial(result.data.data.materials);
          setStudent(result.data.data.students);
          setAssignment(
            [
              ...(result.data.data.exams || []),
              ...(result.data.data.quizzes || [])
            ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // sort ascending by date
          );
          setAnswer(
            [
              ...(result2.data.data || []),
              ...(result3.data.data || [])
            ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // sort ascending by date
          );

          console.log( 
            [
              ...(result2.data.data || []),
              ...(result3.data.data || [])
            ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // sort ascending by date
          )
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {classroom?.classroom.classroom_name}
        </h2>
      </header>

      <div className="p-6 space-y-6">
        {/* Class Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {classroom?.classroom.classroom_name}
              </h1>
              <p className="text-gray-600">
                {classroom?.classroom.subject_code} • {classroom?.classroom.instructor.fullname}
              </p>
              <p className="mt-2 text-gray-700">{classroom?.classroom.description}</p>
            </div>
         
          </div>
        </div>

        {/* Class Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`px-6 py-3 font-medium ${
                activeTab === "lessons"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Lessons
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-6 py-3 font-medium ${
                activeTab === "assignments"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`px-6 py-3 font-medium ${
                activeTab === "grades"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Grades
            </button>
            <button
              onClick={() => setActiveTab("classroom_details")}
              className={`px-6 py-3 font-medium ${
                activeTab === "classroom_details"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Classroom Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "lessons" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Class Materials</h2>
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div
                      key={material._id}
                      className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow overflow-hidden"
                    >
                       <div
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedLesson(
                            expandedLesson === material._id ? null : material._id
                          )
                        }
                      >
                        <div>
                          <h3 className="font-medium">{material.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                              Material
                            </span>
                            <span>Posted: {material.created_at}</span>
                          </div>
                        </div>
                        {expandedLesson === material._id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </div>

                      {expandedLesson === material._id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Lesson Content</h4>
                            <p className="text-gray-700">{material.description}</p>
                            <button className="mt-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm">
                              <FiDownload className="mr-2" /> Download Materials
                            </button>
                          </div>

                          {material && (
                            <div className="mt-4 border-t pt-4">
                              <Link
                                to={`/student/class/${classId}/lesson/${material._id}/practice`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                              >
                                <FiCode className="mr-2" /> Start Practice
                                Exercises
                              </Link>
                            </div>
                          )}
                        </div>
                      )}  
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Assignments</h2>
                <div>
                  {assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow w-full"
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedAssignment(
                            expandedAssignment === assignment._id ? null : assignment._id
                          )
                        }
                      >

              

                        <div className="flex justify-center items-center w-full">
                            <div className="flex-2 overflow-hidden">
                              <span
                                className={`pl-2 py-2 pr-4 rounded-full text-xs capitalize 
                                  ${assignment.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${assignment.type === 'exam' ? 'bg-green-100 text-green-800 ' : ''}
                                `}
                              >
                                {assignment.type}
                              </span>
                              <h3 className="font-medium text-base">
                                {assignment.title}
                              </h3>
                              <div className="mt-1">
                                <p className="text-sm italic text-gray-700 whitespace-pre-wrap break-words">
                                  {assignment.description} 
                                </p>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-2">
                                <FiClock  />
                                <span className="ml-3">
                                  Submission Time: {assignment.submission_time} minutes
                                </span>
                              </div>
                              <div>
                                 <span>Posted: {assignment.created_at}</span>
                              </div>
                            </div>

                            <div className="ml-4 mt-1 shrink-0">
                              {expandedAssignment === assignment._id ? (
                                <FiChevronUp className="text-gray-500" />
                              ) : (
                                <FiChevronDown className="text-gray-500" />
                              )}
                            </div>
                          </div>
                      </div>

                        {expandedAssignment === assignment._id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {(assignment.type === 'quiz' || assignment.type === 'exam') && (
                          <div className="mt-4 border-t pt-4">
                            <Link
                              to={`/student/class/${classId}/${assignment._id}/answer`}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                              {assignment.type === 'quiz' ? (
                                <>
                                  <FiCode className="mr-2" />
                                  Take Quiz
                                </>
                              ) : (
                                <>
                                  <FiCode className="mr-2" />
                                  Take Exam
                                </>
                              )}
                            </Link>
                            </div>
                          )}

                        </div>
                      )}  

                    </div>
                  ))}
                </div>
              </div>
            )}


          

            {activeTab === "grades" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Grades</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {answers.map((answer) => (
                        <tr key={answer._id}>
                          {/* <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {answer.quiz?.type || answer.exam?.type}
                          </td> */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            {(() => {
                              const type = (answer.quiz?.type || answer.exam?.type || '').toUpperCase();
                              const isQuiz = type === 'QUIZ';
                              const isExam = type === 'EXAM';

                              const bgColor = isQuiz ? 'bg-yellow-100' : isExam ? 'bg-green-100' : 'bg-gray-100';
                              const textColor = isQuiz ? 'text-yellow-800' : isExam ? 'text-green-800' : 'text-gray-800';

                              return (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
                                  {type}
                                </span>
                              );
                            })()}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {answer.quiz?.title || answer.exam?.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {answer.quiz?.submission_time || answer.exam?.submission_time} minutes
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {answer.points}/{(answer.quiz?.question || answer.exam?.question)?.reduce((acc, q) => acc + (q.points || 0), 0)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="px-4 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-150 text-xs font-semibold shadow-sm">
                              VIEW
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

           {activeTab === "classroom_details" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Classroom Details</h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Students</h3>
                  <p className="text-2xl font-bold">{classroom.students.length}</p>
                </div>

                <div className="bg-cyan-100 text-cyan-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Assignments</h3>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>

       
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Quizzes</h3>
                  <p className="text-2xl font-bold">{classroom.quizzes.length}</p>
                </div>
       
                <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Exams</h3>
                  <p className="text-2xl font-bold">{classroom.exams.length}</p>
                </div> 

                  <div className="bg-fuchsia-100 text-fuchsia-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Materials</h3>
                  <p className="text-2xl font-bold">{classroom.exams.length}</p>
                </div> 
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Students</h3>
                <ul className="bg-white border rounded-lg divide-y">
                  {students.map((student) => (
                    <li key={student._id} className="p-2">
                      {student.fullname}
                    </li>
                  ))}
                </ul>
              </div>
 
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                <ul className="bg-white border rounded-lg divide-y">
                    <li className="p-2">
                      {classroom.classroom.instructor.fullname}
                    </li>
                </ul>
              </div> 
            </div>
          )}

          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetailPage;
