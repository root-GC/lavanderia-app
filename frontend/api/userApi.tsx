import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.63.190.155:8000/api'; // o teu servidor Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercetador para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};

export default api;