import axios from "axios";
import { BASE_URL } from "./config";

/* LOGIN */

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/logins/login_user`, {
      email,
      password,
    });

    if (response.data && response.data?.data._id) {
      return { success: true, data: response.data };
    } else if (response.data?.message) {
      return { success: false, error: response.data.message };
    } else {
      return {
        success: false,
        error: "Invalid credentials or unexpected server response.",
      };
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message); // More helpful error logging
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Login failed due to a network or server error.",
    };
  }
};

/* STUDENT */

export const registerStudent = async (
  fullname,
  email,
  password,
  student_id_number
) => {
  try {
    const response = await axios.post(`${BASE_URL}/students/add_student`, {
      fullname,
      email,
      password,
      student_id_number,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed.",
    };
  }
};
export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/students/get_all_student`);

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed fetch all students .",
    };
  }
};
export const updateStudent = async (id, email, fullname, student_id_number) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/students/update_student/${id}`,
      { email, fullname, student_id_number }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update specific student.",
    };
  }
};
export const updateStudentPassword = async (id, password) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/students/update_student_password/${id}`,
      { password }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update student password.",
    };
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/students/delete_student/${id}`
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to delete specific student.",
    };
  }
};


export const getAllActivitiesSpecificStudentSpecificClassroom = async (
  classroom_id,
  student_id
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/classrooms/get_all_activities_specific_student_specific_classroom/${classroom_id}/${student_id}`
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed add student in classroom.",
    };
  }
};

export const addStudentsToClassroom = async (
  classroom_id,
  student_id_number
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/classrooms/add_student_classroom/${classroom_id}/${student_id_number}`
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed add student in classroom.",
    };
  }
};

/* INSTRUCTOR */

export const registerInstructor = async (fullname, email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/instructors/add_instructor`,
      {
        fullname,
        email,
        password,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed.",
    };
  }
};

export const updateInstructor = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/instructors/update_instructor/${id}`,
      {
        fullname: data.fullname,
        email: data.email,
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update instructor",
    };
  }
};

export const updateInstructorPassword = async (id, password) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/instructors/update_instructor_password/${id}`,
      {
        password,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update instructor password",
    };
  }
};

export const getAllInstructors = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/instructors/get_all_instructor`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch instructor data.",
    };
  }
};

export const getSpecificInstructor = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/instructors/get_specific_instructor/${id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch instructor data",
    };
  }
};

export const deleteInstructor = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/instructors/delete_instructor/${id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete instructor",
    };
  }
};

/* ADMIN */

export const getAllAdmins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admins/get_all_admin`);

    return {
      success: true,
      data: response.data, // This will contain your admin list or response data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch admin data.",
    };
  }
};

export const getSpecificAdmin = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admins/get_specific_admin/${id}`
    );

    return {
      success: true,
      data: response.data, // This will contain your admin list or response data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch admin data.",
    };
  }
};

export const registerAdmin = async (fullname, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/admins/add_admin`, {
      fullname,
      email,
      password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to register admin",
    };
  }
};

export const updateAdmin = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/admins/update_admin/${id}`, {
      fullname: data.fullname,
      email: data.email,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update admin",
    };
  }
};

export const updateAdminPassword = async (id, password) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admins/update_admin_password/${id}`,
      {
        password,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to change admin password",
    };
  }
};
export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admins/delete_admin/${id}`
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete admin",
    };
  }
};

export const examAnswer = async (exam_id, student_id, array_answers) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer_exams/add_answer/${exam_id}/${student_id}`,
      {
        array_answers,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create answer",
    };
  }
};

export const quizAnswer = async (quiz_id, student_id, array_answers) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer_quizzes/add_answer/${quiz_id}/${student_id}`,
      {
        array_answers,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create answer",
    };
  }
};

export const askAI = async (ask) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai/ask`, {
      ask,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to run code",
    };
  }
};

export const compilerRunCode = async (language, version, code) => {
  try {
    const response = await axios.post(`${BASE_URL}/compilers/run_code`, {
      language,
      version,
      code,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to run code",
    };
  }
};

export const specificExamAnswer = async (answer_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_exams/get_specific_answer/${answer_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific answer",
    };
  }
};

export const specificQuizAnswer = async (answer_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_quizzes/get_specific_answer/${answer_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific answer",
    };
  }
};

export const takeQuiz = async (quiz_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_quizzes/take_quiz/${quiz_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to take quiz",
    };
  }
};

export const takeExam = async (exam_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_exams/take_exam/${exam_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to take exam",
    };
  }
};

export const specificExam = async (exam_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/exams/get_specific_exam/${exam_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific exam",
    };
  }
};

export const specificQuiz = async (quiz_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/quizzes/get_specific_quiz/${quiz_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific quiz",
    };
  }
};

export const specificActivitySpecificAnswer = async (
  activity_id,
  student_id
) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/activities/get_specific_activity_specific_answer/${activity_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific activity",
    };
  }
};

export const specificExamSpecificAnswer = async (exam_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/exams/get_specific_exam_specific_answer/${exam_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific quiz",
    };
  }
};

export const specificQuizSpecificAnswer = async (quiz_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/quizzes/get_specific_quiz_specific_answer/${quiz_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get specific quiz",
    };
  }
};

export const allLanguage = async () => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/languages/get_all_language`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get all languages",
    };
  }
};

export const allAnswerQuizSpecificStudentSpecificClassroom = async (
  classroom_id,
  student_id
) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_quizzes/get_all_answer_specific_student_specific_classroom/${classroom_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get all answers",
    };
  }
};

export const allAnswerActivitySpecificStudentSpecificClassroom = async (
  classroom_id,
  student_id
) => {
  try {
    const response = await axios.get(`
      
      ${BASE_URL}/answer_activities/get_all_answer_specific_student_specific_classroom/${classroom_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get all answers",
    };
  }
};

export const allAnswerExamSpecificStudentSpecificClassroom = async (
  classroom_id,
  student_id
) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_exams/get_all_answer_specific_student_specific_classroom/${classroom_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get all answers",
    };
  }
};

/* CLASSROOM */
export const addClassroom = async (
  classroom_name,
  subject_code,
  instructor,
  classroom_code,
  description,
  programming_language
) => {
  try {
    const response = await axios.post(`${BASE_URL}/classrooms/add_classroom`, {
      classroom_name,
      subject_code,
      instructor,
      classroom_code,
      description,
      programming_language,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add new classroom",
    };
  }
};

export const joinClassroom = async (classroom_code, student_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/classrooms/student_join_classroom`,
      { classroom_code, student_id }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to join classroom",
    };
  }
};

export const removeStudentClassroom = async (classroom_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/remove_student_classroom/${classroom_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to remove student from classroom",
    };
  }
};

export const leaveClassroom = async (classroom_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/student_leave_classroom/${classroom_id}/${student_id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to leave classroom",
    };
  }
};

export const allClassrooms = async () => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_all_classroom`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch all classrooms",
    };
  }
};

export const specificClassroom = async (classId) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_specific_classroom/${classId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch specific classroom",
    };
  }
};

export const allClassroomStudent = async (roomId) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_all_classroom_student/${roomId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch all classroom",
    };
  }
};
export const allClassroomSpecificStudent = async (studentId) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_all_classroom_specific_student/${studentId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch all classroom",
    };
  }
};

export const allClassroomSpecificInstructor = async (instructorId) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_all_classroom_specific_instructor/${instructorId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch all classroom",
    };
  }
};

export const classroomOverviewSpecificInstructor = async (instructorId) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/classrooms/get_all_classroom_overview_specific_instructor/${instructorId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch all classroom",
    };
  }
};

export const updateClassroom = async (
  roomId,
  classroom_name,
  subject_code,
  description,
  programming_language,
  grading_system
) => {
  try {
    const response = await axios.put(
      `
      ${BASE_URL}/classrooms/update_classroom/${roomId}`,
      {
        classroom_name,
        subject_code,
        description,
        programming_language,
        grading_system,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update classroom",
    };
  }
};



export const getAllStudentGradeSpecificClassroom = async (classroom_id) => {
  try {
    const response = await axios.get(
      `
      ${BASE_URL}/grades/get_all_Student_grade_specific_classroom/${classroom_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to archive classroom",
    };
  }
};

export const computeStudentGrade = async (classroom_id, student_id) => {
  try {
    const response = await axios.get(
      `
      ${BASE_URL}/grades/compute_grade/${classroom_id}/${student_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to archive classroom",
    };
  }
};

export const hideClassroom = async (roomId) => {
  try {
    const response = await axios.get(
      `
      ${BASE_URL}/classrooms/hide_classroom/${roomId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to archive classroom",
    };
  }
};

export const unHideClassroom = async (roomId) => {
  try {
    const response = await axios.get(
      `
      ${BASE_URL}/classrooms/unhide_classroom/${roomId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to unarchive classroom",
    };
  }
};

/* MATERIALS */
export const addMaterial = async (file, classroom_id, description, title) => {
  try {
    const formData = new FormData();
    formData.append("file_uploaded", file);
    formData.append("classroom_id", classroom_id);
    formData.append("description", description);
    formData.append("title", title);

    const response = await axios.post(
      `${BASE_URL}/materials/add_material`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.response?.data?.message || "Error adding material",
    };
  }
};

export const specificActivity = async (activity_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/activities/get_specific_activity/${activity_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching materials",
    };
  }
};

export const specificMaterial = async (materialId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/materials/get_specific_material/${materialId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching materials",
    };
  }
};

export const extractMaterialData = async (materialId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/materials/extract_material/${materialId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error extracting materials data",
    };
  }
};

export const allMaterialsSpecificClass = async (classId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/materials/get_all_material_specific_classroom/${classId}`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching  materials",
    };
  }
};

export const updateMaterial = async (
  materialId,
  classroomId,
  file,
  description,
  title
) => {
  try {
    const formData = new FormData();
    formData.append("file_uploaded", file);
    formData.append("classroom_id", classroomId);
    formData.append("description", description);
    formData.append("title", title);

    const response = await axios.put(
      `${BASE_URL}/materials/update_material/${materialId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Material added:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update material.",
    };
  }
};

export const deleteMaterial = async (materialId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/materials/delete_material/${materialId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete material.",
    };
  }
};

/* ACTIVITIES */
export const addActivity = async (
  classId,
  questions,
  timeLimit,
  title,
  description,
  type = "quiz",
  grading_breakdown
) => {
  try {
    let response;

    if (type === "quiz") {
      response = await axios.post(`${BASE_URL}/quizzes/add_quiz`, {
        classroom_id: classId,
        question: questions.map((q) => ({
          text: q.text,
          options:
            q.type === "multiple_choice"
              ? {
                  option_1: q.options[0]?.text || "",
                  option_2: q.options[1]?.text || "",
                  option_3: q.options[2]?.text || "",
                  option_4: q.options[3]?.text || "",
                }
              : undefined,
          correct_option:
            q.type === "multiple_choice"
              ? q.options.find((opt) => opt.letter === q.answer)?.text || ""
              : undefined,
          points: Number(q.points),
          answer_type: q.type === "multiple_choice" ? "options" : "programming",
        })),
        time_limit: Number(timeLimit),
        title,
        description,
      });
    } else if (type === "activity") {
      response = await axios.post(`${BASE_URL}/activities/add_activity`, {
        classroom_id: classId,
  
        question: questions.map((q) => ({
          text: q.text,
          expected_output: q.expectedOutput,
      
          points: Number(q.points),
          answer_type: q.type === "multiple_choice" ? "options" : "programming",
        })),


        title,
        description,
      });
    } else {
      response = await axios.post(`${BASE_URL}/exams/add_exam`, {
        classroom_id: classId,
        question: questions.map((q) => ({
          text: q.text,
          expected_output: q.expectedOutput,
          options:
            q.type === "multiple_choice"
              ? {
                  option_1: q.options[0]?.text || "",
                  option_2: q.options[1]?.text || "",
                  option_3: q.options[2]?.text || "",
                  option_4: q.options[3]?.text || "",
                }
              : undefined,
          correct_option:
            q.type === "multiple_choice"
              ? q.options.find((opt) => opt.letter === q.answer)?.text || ""
              : undefined,
          points: Number(q.points),
          answer_type: q.type === "multiple_choice" ? "options" : "programming",
        })),
        time_limit: Number(timeLimit),
        title,
        description,
        grading_breakdown,
      });
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to add activity",
    };
  }
};

export const updateActivity = async (activityId, activityType, data) => {
  try {
    let response;
    if (activityType === "quiz") {
      response = await axios.put(
        `${BASE_URL}/quizzes/update_quiz/${activityId}`,
        data
      );
    }
    
    if (activityType === "exam") {
      response = await axios.put(
        `${BASE_URL}/exams/update_exam/${activityId}`,
        data
      );
    }

    if (activityType === "activity") {
      response = await axios.put(
        `${BASE_URL}/activities/update_activity/${activityId}`,
        data
      );
    }

    return { success: true, data: response?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const deleteActivity = async (activityId, activityType) => {
  try {
    let response;
    if (activityType === "quiz") {
      response = await axios.delete(
        `${BASE_URL}/quizzes/delete_quiz/${activityId}`
      );
    }if (activityType === "activity") {
      response = await axios.delete(
        `${BASE_URL}/activities/delete_activity/${activityId}`
      );
    } else {
      response = await axios.delete(
        `${BASE_URL}/exams/delete_exam/${activityId}`
      );
    }

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/* ANSWER ACTIVITY */

export const allStudentMissingAnswerSpecificQuiz = async (quizId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_quizzes/get_all_student_missing_answer_specific_quiz/${quizId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Failed to get the students missing quiz answers",
    };
  }
};


export const allStudentMissingAnswerSpecificActivity = async (activity_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_activities/get_all_student_missing_answer_specific_activity/${activity_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Failed to get the students missing exam answers",
    };
  }
};

export const allStudentMissingAnswerSpecificExam = async (examId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_exams/get_all_student_missing_answer_specific_exam/${examId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "Failed to get the students missing exam answers",
    };
  }
};


export const allAnswerSpecificActivity = async (activity_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_activities/get_all_answer_specific_activity/${activity_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get the quiz answers",
    };
  }
};

export const allAnswerSpecificQuiz = async (quizId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_quizzes/get_all_answer_specific_quiz/${quizId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get the quiz answers",
    };
  }
};
export const allAnswerSpecificExam = async (examId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_exams/get_all_answer_specific_exam/${examId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get the exam answers",
    };
  }
};

/* OTP */

export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/add_otp`, {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to join classroom",
    };
  }
};

export const verifyEmailOTP = async (otp_code, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/otp_verification_email_verification`,
      {
        otp_code,
        email,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to join classroom",
    };
  }
};
export const recoveryOTP = async (otp_code, email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/otp_verification_password`,
      {
        otp_code,
        email,
        password,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to recover password",
    };
  }
};

export const specificActivityAnswer = async (answer_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/answer_activities/get_specific_answer/${answer_id}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get the exam answers",
    };
  }
};

export const activityAnswer = async (
  activity_id,
  student_id,
  array_answers
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/answer_activities/add_answer/${activity_id}/${student_id}`,
      {
        array_answers,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to join classroom",
    };
  }
};

/* AI PROMPT */

export const askPrompt = async (prompt) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai/ask`, {
      ask: prompt,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to ask assistant",
    };
  }
};

/* PROMOTE ROLE */
export const checkPromotedUser = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/promotes/check_user/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response?.data?.message || "Failed to check promoted user",
    };
  }
};
export const promoteUser = async (id, role_name) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/promotes/promote_user/${id}`,
      {
        role_name,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response?.data?.message || "Failed to promote specific user",
    };
  }
};

/* UPDATE PROFILE */
