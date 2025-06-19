import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import { getAllStudents, addStudentsToClassroom } from "../utils/authService";
import { toast } from "react-toastify";

const AddStudentsModal = ({ isOpen, onClose, classId, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllStudents();
    }
  }, [isOpen]);

  const fetchAllStudents = async () => {
    setIsLoading(true);
    try {
      const result = await getAllStudents();
      if (result.success) {
        // Filter out students who are already in this classroom
        const filteredStudents = result.data.data.filter(
          (student) => !student.joined_classroom?.includes(classId)
        );
        setStudents(filteredStudents);
      } else {
        toast.error(result.error || "Failed to fetch students");
      }
    } catch (error) {
      toast.error("An error occurred while fetching students");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setIsSubmitting(true);

    try {
      let successCount = 0;
      let failedStudents = [];

      for (const studentId of selectedStudents) {
        try {
          const result = await addStudentsToClassroom(classId, [studentId]);
          if (result.success) {
            successCount++;
          } else {
            failedStudents.push(studentId);
          }
        } catch (err) {
          failedStudents.push(studentId);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} student(s) added successfully`);
        onSuccess();
      }

      if (failedStudents.length > 0) {
        toast.error(`Failed to add ${failedStudents.length} student(s)`);
      }

      onClose();
    } catch (error) {
      toast.error("An error occurred while adding students");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id_number.toString().includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Add Students</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name, email or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.student_id_number}
                    className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${
                      selectedStudents.includes(student.student_id_number)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      toggleStudentSelection(student.student_id_number)
                    }
                  >
                    <div>
                      <h4 className="font-medium">{student.fullname}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      {student.student_id_number && (
                        <p className="text-xs text-gray-500">
                          ID: {student.student_id_number}
                        </p>
                      )}
                    </div>
                    {selectedStudents.includes(student.student_id_number) && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <FiCheck size={16} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedStudents.length === 0}
            className={`cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
              (isSubmitting || selectedStudents.length === 0) &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Selected Students"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsModal;
