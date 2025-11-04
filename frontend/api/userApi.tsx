import axios from 'axios';

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

const API_URL = 'http://10.71.7.155:8000/api'; // ajusta conforme o teu servidor Laravel

export const registerUser = async (data: UserRegistrationData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};