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

export const registerStudent = async (fullname, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/students/add_student`, {
      fullname,
      email,
      password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed.",
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
      password
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


export const examAnswer = async (
  exam_id,
  student_id,
  array_answers
) => {
  try {
    const response = await axios.post(`${BASE_URL}/answer_exams/add_answer/${exam_id}/${student_id}`, {
      array_answers
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create answer",
    };
  }
};


export const quizAnswer = async (
  quiz_id,
  student_id,
  array_answers
) => {
  try {
    const response = await axios.post(`${BASE_URL}/answer_quizzes/add_answer/${quiz_id}/${student_id}`, {
      array_answers
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create answer",
    };
  }
};

export const askAI = async (
  ask
) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai/ask`, {
      ask
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to run code",
    };
  }
};

export const compilerRunCode = async (
  language,
  version,
  code
) => {
  try {
    const response = await axios.post(`${BASE_URL}/compilers/run_code`, {
      language,
      version,
      code
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

export const allAnswerQuizSpecificStudentSpecificClassroom = async (classroom_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_quizzes/get_all_answer_specific_user_specific_classroom/${classroom_id}/${student_id}`);

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

export const allAnswerExamSpecificStudentSpecificClassroom = async (classroom_id, student_id) => {
  try {
    const response = await axios.get(`
      ${BASE_URL}/answer_exams/get_all_answer_specific_user_specific_classroom/${classroom_id}/${student_id}`);

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
  description
) => {
  try {
    const response = await axios.post(`${BASE_URL}/classrooms/add_classroom`, {
      classroom_name,
      subject_code,
      instructor,
      classroom_code,
      description,
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

export const updateClassroom = async (
  roomId,
  classroom_name,
  subject_code,
  description
) => {
  try {
    const response = await axios.put(
      `
      ${BASE_URL}/classrooms/update_classroom/${roomId}`,
      {
        classroom_name,
        subject_code,
        description,
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

    console.log("Material added:", response.data);

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

export const addQuiz = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/quizzes/add_quiz`, {});

    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to add quiz.",
    };
  }
};
