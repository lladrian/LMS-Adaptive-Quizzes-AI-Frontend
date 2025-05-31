import React, { useEffect, useState } from "react";
import { allClassroomSpecificStudent, joinClassroom } from "../../utils/authService";
import { Link } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";

const ClassesPage = () => {
  const [joinedClassroom, setJoinedClassroom] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [classroomCode, setClassroomCode] = useState("");
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAllClassroomSpecificStudent();
  }, []);

  const fetchAllClassroomSpecificStudent = async () => {
    setIsLoading(true);
    try {
      const result = await allClassroomSpecificStudent(studentId);
      if (result.success) {
        setJoinedClassroom(result.data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      const result = await joinClassroom(classroomCode, studentId);
      if (result.success) {
        toast.success("Successfully joined class!");
        setClassroomCode("");
        setShowModal(false);
        fetchAllClassroomSpecificStudent();
      } else {
        toast.error("Failed to join class");
      }
    } catch (error) {
      console.error("Error joining class:", error);
      toast.error("Error joining class");
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Join New Class
        </button>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Join a Class</h3>
            <form onSubmit={handleJoinClass}>
              <input
                type="text"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                placeholder="Enter Classroom Code"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedClassroom.map((classroom) => (
            <div
              key={classroom?._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {classroom?.classroom_name}
                </h3>
                <p className="text-gray-600 mb-3">
                  {classroom?.classroom_code} • {classroom.instructor?.fullname}
                </p>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>12 Lessons</span>
                  <span>3 Assignments</span>
                </div>

                <div className="flex justify-between w-full">
                  <Link
                    to={`/student/class/${classroom?._id}`}
                    className="px-3 py-1 bg-indigo-600 text-white w-full text-center text-xl rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Class
                  </Link>
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
