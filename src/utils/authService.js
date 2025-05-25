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

/* CLASSROOM */
export const addClassroom = async (
  classroom_name,
  subject_code,
  instructor,
  classroom_code
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/classrooms/classrooms/add_classroom`,
      {
        classroom_name,
        subject_code,
        instructor,
        classroom_code,
      }
    );

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
      `${BASE_URL}/classrooms/classrooms/student_join_classroom`,
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
      error: error.response?.data?.message || "Failed to fetch all classroom",
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

export const updateClassroom = async (roomId, classroom_name, subject_code) => {
  try {
    const response = await axios.put(
      `
      ${BASE_URL}/classrooms/update_classroom/${roomId}`,
      {
        classroom_name,
        subject_code,
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
export const deleteClassroom = async (roomId) => {
  try {
    const response = await axios.put(
      `
      ${BASE_URL}/classrooms/delete_classroom/${roomId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete classroom",
    };
  }
};

/* QUIZ/EXAM */
