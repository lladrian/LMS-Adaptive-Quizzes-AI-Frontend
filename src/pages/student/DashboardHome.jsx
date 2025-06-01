import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBook, FiClock, FiAward, FiBookOpen, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {allClassroomSpecificStudent} from "../../utils/authService";

const DashboardHome = () => {
  const [hiddenClassrooms, setHiddenClassrooms] = useState([]);
  const [unhiddenClassrooms, setUnHiddenClassrooms] = useState([]);
  const [joinedClassroom, setJoinedClassroom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const studentId = localStorage.getItem("userId");

  const upcomingAssignments = [
    { id: 1, title: "Algorithm Quiz", class: "CS401", due: "2023-06-10" },
    { id: 2, title: "Final Project", class: "CS301", due: "2023-06-15" },
  ];

  const recentGrades = [
    { id: 1, title: "Sorting Assignment", class: "CS401", score: "85/100" },
    { id: 2, title: "Midterm Exam", class: "CS301", score: "92/100" },
  ];



    useEffect(() => {
      fetchAllClassroomSpecificStudent();
    }, []);
  
    const fetchAllClassroomSpecificStudent = async () => {
      setIsLoading(true);
      try {
        const result = await allClassroomSpecificStudent(studentId);
        if (result.success) {
          const all = result.data.data || [];

          const hidden = all.filter(item => item.is_hidden === 1);
          const unhidden = all.filter(item => item.is_hidden === 0);

          setHiddenClassrooms(hidden);
          setUnHiddenClassrooms(unhidden);
          setJoinedClassroom(all);
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
  
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Enrolled Classes</p>
                  <p className="text-2xl font-semibold mt-1">{joinedClassroom?.length}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-indigo-100 text-indigo-600`}
                >
                  <FiBookOpen className="text-xl" />
                </div>
              </div>
            </div>
  
              <div
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Enrolled Classes</p>
                  <p className="text-2xl font-semibold mt-1">{unhiddenClassrooms?.length}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-indigo-100 text-indigo-600`}
                >
                  <FiCheckCircle className="text-xl" />
                </div>
              </div>
            </div>

              <div
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inactive Enrolled Classes</p>
                  <p className="text-2xl font-semibold mt-1">{hiddenClassrooms?.length}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-indigo-100 text-indigo-600`}
                >
                  <FiXCircle className="text-xl" />
                </div>
              </div>
            </div>

             {/* <div
              className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Assignments</p>
                  <p className="text-2xl font-semibold mt-1">{2}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-yellow-100 text-yellow-600`}
                >
                  <FiClock className="text-xl" />
                </div>
              </div>
            </div> */}


        </div>
{/* 

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
            <Link
              to="/student/classes"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {assignment.class} • Due: {assignment.due}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Quiz
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}

{/*   
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Grades</h3>
            <Link
              to="/student/grades"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentGrades.map((grade) => (
              <div
                key={grade.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{grade.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{grade.class}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{grade.score}</span>
                    <span className="block text-xs text-green-600">Graded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

      </div>
    </>
  );
};

export default DashboardHome;
