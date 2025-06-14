import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate  } from "react-router-dom";
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
  FiLogOut, 
} from "react-icons/fi";
import CodeEditor from "../../components/CodeEditor";
import {specificClassroom, 
allAnswerExamSpecificStudentSpecificClassroom,
allAnswerQuizSpecificStudentSpecificClassroom,
allAnswerActivitySpecificStudentSpecificClassroom,
leaveClassroom,
compute_grade
} from "../../utils/authService";
import { BASE_URL } from "../../utils/config";
import Modal from '../../components/Modal'; // Adjust the path as necessary
import { toast } from "react-toastify";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("lessons");
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [materials, setMaterial] = useState([]);
  const [grades, setGrade] = useState([]);
  const [assignments, setAssignment] = useState([]);
  const [answers, setAnswer] = useState([]);
  const [students, setStudent] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
        const result4 = await allAnswerActivitySpecificStudentSpecificClassroom(classId, studentId);
        const result5 = await compute_grade(classId, studentId);
   

      

        if (result.success && result2.success && result3.success && result4.success && result5.success) {
          setClassroom(result.data.data);
          setMaterial(result.data.data.materials);
          setStudent(result.data.data.students);
          setGrade(result5.data.data)
          setAssignment(
            [
              ...(result.data.data.exams || []),
              ...(result.data.data.quizzes || []),
              ...(result.data.data.activities || [])
            ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // sort ascending by date
          );
          setAnswer(
            [
              ...(result2.data.data || []),
              ...(result3.data.data || []),
              ...(result4.data.data || [])
            ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // sort ascending by date
          );
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      } finally {
        setIsLoading(false);
      }
    };


  const filterAssignments = () => {
    return assignments.filter((assignment) => {

      const isAnswered = answers.some(
        (ans) => ans?.quiz?._id === assignment?._id || ans?.exam?._id === assignment?._id || ans?.activity?._id === assignment?._id && ans?.submitted_at
      );

      const isOngoing= answers.some(
        (ans) => ans?.quiz?._id === assignment?._id || ans?.exam?._id === assignment?._id || ans?.activity?._id === assignment?._id && ans?.opened_at
      );

      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'not yet') return !isAnswered && !isOngoing;
      if (selectedStatus === 'ongoing') return isOngoing && !isAnswered;
      if (selectedStatus === 'completed') return isAnswered;

      return true;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(classroom?.classroom.classroom_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };
  const leaveClassroomFunction = async () => {
      try {
        const result = await leaveClassroom(classId, studentId);
        toast.success(result.data);
        navigate("/student/classes");
      } catch (error) {
        toast.error("Failed to leave classroom");
      } 
   };

    const handleLeaveClass = () => {
        leaveClassroomFunction();
        // Logic to leave the classroom goes here
        console.log("Leaving the classroom...");
        setIsModalOpen(false); // Close the modal after confirming
    };

  return (
    <>
      

      <div className="p-6 space-y-6">
        {/* Class Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
             
            <div>
              <div>
                  <button 
                    onClick={() => setIsModalOpen(true)} // Open the modal on button click
                    className="flex items-center bg-red-200 text-black hover:text-white font-semibold py-1 px-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                  >
                    <FiLogOut className="mr-2" />
                    Leave Class
                  </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-800">
                {classroom?.classroom.classroom_name}
              </h1>
              <p className="text-gray-600">
                {classroom?.classroom?.subject_code} • {classroom?.classroom?.instructor?.fullname}
              </p>
              <p className="mt-2 text-gray-700">{classroom?.classroom.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-700">
                    <span className="italic">                    
                      Classroom Code: 
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-sm hover:bg-gray-400 hover:text-white px-2 py-1 rounded"
                    >
                      {copied ? `Copied` : `${classroom?.classroom.classroom_code}`}
                    </button>
                </p>
              </div>
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
              onClick={() => setActiveTab("practice_with_ai")}
              className={`px-6 py-3 font-medium ${
                activeTab === "practice_with_ai"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Practice With AI
            </button>
            <button
              onClick={() => setActiveTab("classroom_overview")}
              className={`px-6 py-3 font-medium ${
                activeTab === "classroom_overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Classroom Overview
            </button>
          </div>

          <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleLeaveClass} 
          />

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
                            <Link
                                to={`${BASE_URL}/uploads/${material.material}`}
                            >
                              <button className="mt-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm">
                                <FiDownload className="mr-2" /> Download Materials
                              </button>
                            </Link>
                          </div>

                          {material && (
                            <div className="mt-4 border-t pt-4">
                              <Link
                                to={`/student/class/${classId}/${material._id}/practice_with_lesson`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                              >
                                <FiCode className="mr-2" /> 
                                Start Practice Exercises
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

        {/* Filter Dropdown */}
        <div className="mb-4">
          {/* <label className="mr-2 font-medium">Filter:</label> */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="all">All</option>
            <option value="not yet">Not Yet</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          
          {/* {assignments.map((assignment) => ( */}
          {filterAssignments().map((assignment) => (
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
                        ${assignment.type === 'exam' ? 'bg-green-100 text-green-800' : ''}
                        ${assignment.type === 'activity' ? 'bg-blue-100 text-blue-800' : ''}
                      `}
                    >
                      {assignment.type} - {assignment?.grading_breakdown}
                    </span>
              
                    <h3 className="font-medium text-base">{assignment.title}</h3>
                    <div className="mt-1">
                      <p className="text-sm italic text-gray-700 whitespace-pre-wrap break-words">
                        {assignment.description}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <FiClock />
                      <span className="ml-3">
                        Submission Time: {assignment.submission_time || 0} minutes
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
                        to={`/student/class/${classId}/${assignment._id}/${assignment.type}/answer`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <FiCode className="mr-2" />
                        {assignment.type === 'quiz' ? 'Take Quiz' : 'Take Exam'}
                      </Link>
                    </div>
                  )}

                  {(assignment.type === 'activity') && (
                    <div className="mt-4 border-t pt-4">
                      <Link
                        to={`/student/class/${classId}/${assignment._id}/${assignment.type}/answer`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <FiCode className="mr-2" />
                        Take Activity
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
                {/* <h2 className="text-xl font-semibold">Grades</h2> */}
                <div className="bg-white p-6 rounded shadow-md">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Your Grades</h2>
                  <div className="space-y-2 text-lg font-semibold text-gray-700">
                    {/* <div>📘 Quiz: {"120 / 120 * 20 = " + 120 / 120 * 20}/{classroom.classroom.grading_system.quiz}</div>
                    <div>📝 Midterm:  {"120 / 120 * 30 = " + 120 / 120 * 30}/{classroom.classroom.grading_system.midterm}</div>
                    <div>📚 Final:  {"120 / 120 * 30 = " + 120 / 120 * 30}/{classroom.classroom.grading_system.final}</div>
                    <div>🎯 Activity:  {"120 / 120 * 20 = " + 120 / 120 * 20}/{classroom.classroom.grading_system.activity}</div> */}
                    <div>
                      📘 Quiz: {
                        grades.quiz.totalPoints > 0
                          ? (grades.quiz.earnedPoints / grades.quiz.totalPoints * classroom.classroom.grading_system.quiz).toFixed(1)
                          : 0
                      } / {classroom.classroom.grading_system.quiz}
                    </div>
                   <div>
                      📝 Midterm: {
                        grades.midterm.totalPoints > 0
                          ? (grades.midterm.earnedPoints / grades.midterm.totalPoints * classroom.classroom.grading_system.midterm).toFixed(1)
                          : 0
                      } / {classroom.classroom.grading_system.midterm}
                    </div>

                    <div>
                      📚 Final: {
                        grades.final.totalPoints > 0
                          ? (grades.final.earnedPoints / grades.final.totalPoints * classroom.classroom.grading_system.final).toFixed(1)
                          : 0
                      } / {classroom.classroom.grading_system.final}
                    </div>

                    <div>
                      🎯 Activity: {
                        grades.activity.totalPoints > 0
                          ? (grades.activity.earnedPoints / grades.activity.totalPoints * classroom.classroom.grading_system.activity).toFixed(1)
                          : 0
                      } / {classroom.classroom.grading_system.activity}
                    </div>

                    <div className="mt-4 border-t pt-2 text-blue-600 font-bold text-xl">
                        🔢 Total: {
                          (
                            (grades.quiz.totalPoints > 0
                              ? (grades.quiz.earnedPoints / grades.quiz.totalPoints) * classroom.classroom.grading_system.quiz
                              : 0) +
                            (grades.midterm.totalPoints > 0
                              ? (grades.midterm.earnedPoints / grades.midterm.totalPoints) * classroom.classroom.grading_system.midterm
                              : 0) +
                            (grades.final.totalPoints > 0
                              ? (grades.final.earnedPoints / grades.final.totalPoints) * classroom.classroom.grading_system.final
                              : 0) +
                            (grades.activity.totalPoints > 0
                              ? (grades.activity.earnedPoints / grades.activity.totalPoints)
                               * classroom.classroom.grading_system.activity
                              : 0)
                          ).toFixed(1)
                        } / 100
                      </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grading Breakdown
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
                        {answers.map((answer) =>
                          answer.submitted_at && (
                            <tr key={answer._id}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                {(() => {
                                  const type = (answer.quiz?.type || answer.exam?.type || answer.activity?.type || '').toUpperCase();
                                  const isQuiz = type === 'QUIZ';
                                  const isExam = type === 'EXAM';
                                  const isActivity = type === 'ACTIVITY';

                                 const bgColor = isQuiz
                                  ? 'bg-yellow-100'
                                  : isExam
                                  ? 'bg-green-100'
                                  : isActivity
                                  ? 'bg-blue-100'
                                  : 'bg-gray-100';

                                const textColor = isQuiz
                                  ? 'text-yellow-800'
                                  : isExam
                                  ? 'text-green-800'
                                  : isActivity
                                  ? 'text-blue-800'
                                  : 'text-gray-800';

                                  return (
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
                                      {type}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {(answer.quiz?.grading_breakdown || answer.exam?.grading_breakdown || answer.activity?.grading_breakdown)?.toUpperCase()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {answer.quiz?.title || answer.exam?.title || answer.activity?.title}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {answer.quiz?.submission_time || answer.exam?.submission_time || 0} minutes
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(answer.answers || []).reduce((acc, q) => acc + (q.points || 0), 0)}/
                                {(answer.quiz?.question || answer.exam?.question || answer.activity?.question || []).reduce((acc, q) => acc + (q.points || 0), 0)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {answer.exam?.type === 'exam' ? (
                                <Link
                                  to={`/student/class/${classId}/${answer.exam._id}/exam/view_answer`}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                >
                                  VIEW
                                </Link>
                              ) : answer.quiz?.type === 'quiz' ? (
                                <Link
                                  to={`/student/class/${classId}/${answer.quiz._id}/quiz/view_answer`}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                >
                                  VIEW
                                </Link>
                              ) : answer.activity?.type === 'activity' ? (
                                <Link
                                  to={`/student/class/${classId}/${answer.activity._id}/activity/view_answer`}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                >
                                  VIEW
                                </Link>
                              ) : null}
                              </td>
                            </tr>
                          )
                        )}

                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "practice_with_ai" && (
              <div className="space-y-6">
                {/* <h2 className="text-2xl font-semibold">Practice With AI</h2> */}
                <div className="w-full">
                  <Link
                      to={`/student/class/${classId}/practice_with_ai`}
                  >
                      <button
                        className="bg-blue-600 hover:bg-blue-700  text-white font-medium w-full py-2 px-4 rounded"
                      >
                          Practice with AI
                      </button>      
                  </Link>
                </div>
              </div>
            )}


           {activeTab === "classroom_overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Classroom Overview</h2>

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
                  <p className="text-2xl font-bold">{classroom.materials.length}</p>
                </div> 

                 <div className="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium">Total Activities</h3>
                  <p className="text-2xl font-bold">{classroom.activities.length}</p>
                </div> 
              </div>

             <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Grading System</h2>
                <div className="space-y-2 text-lg font-semibold text-gray-700">
                  <div>📘 Quiz: {classroom.classroom.grading_system.quiz}%</div>
                  <div>📝 Midterm: {classroom.classroom.grading_system.midterm}%</div>
                  <div>📚 Final: {classroom.classroom.grading_system.final}%</div>
                  <div>🎯 Activity: {classroom.classroom.grading_system.activity}%</div>
                  <div className="mt-4 border-t pt-2 text-blue-600 font-bold text-xl">
                    🔢 Total: {classroom.classroom.grading_system.quiz +
                              classroom.classroom.grading_system.midterm +
                              classroom.classroom.grading_system.final +
                              classroom.classroom.grading_system.activity}%
                  </div>
                </div>
              </div>


              {/* <div>
                <h3 className="text-lg font-semibold mb-2">Students</h3>
                <ul className="bg-white border rounded-lg divide-y">
                  {students.map((student) => (
                    <li key={student._id} className="p-2">
                      {student.fullname}
                    </li>
                  ))}
                </ul>
              </div> */}

              <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-2">Students</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students?.length > 0 ? (
                    students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.fullname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              bg-green-100 text-green-800
            `}
                          >
                            active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No students in this classroom
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {classroom.classroom.instructor.fullname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classroom.classroom.instructor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              bg-green-100 text-green-800
            `}
                          >
                            active
                          </span>
                        </td>
                      </tr>
                </tbody>
              </table>
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
