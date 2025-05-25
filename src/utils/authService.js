import axios from 'axios';

const BASE_URL = 'http://localhost:4000/students';

export const loginStudent = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login_student`, {
      email,
      password,
    });

    if (response.data && response.data._id) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Invalid credentials or server error.' };
    }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed.' };
  }
};

export const registerStudent = async (fullname, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/add_student`, {
      fullname,
      email,
      password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Registration failed.' };
  }
};
