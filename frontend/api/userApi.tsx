// userApi.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.71.7.155:8000/api'; // o teu servidor Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🔐 Intercetador para adicionar token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📦 Registo de novo utilizador
export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/users', data);
  console.log("Resposta do servidor:", response.data);
  return response.data;
};

// 🔑 Login
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/login', data);
  console.log("Resposta do servidor:", response.data);

  // guarda o token no AsyncStorage
  const { token, user } = response.data;
  if (token) {
    await AsyncStorage.setItem('token', token);
  }

  // devolve ambos (para uso no frontend)
  return { token, user };
};

// 🚪 Logout
export const logoutUser = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};

// 👤 Buscar utilizador autenticado
export const getUser = async () => {
  const response = await api.get('/user');
  return response.data;
};

// 🧺 Criar pedido
export const criarPedido = async (data: {
  user_id: number;
  imagem: string;
  servicos_adicionais: string[];
  tipo: string;
  peso: number;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
}) => {
  const response = await api.post('/pedidos', data);
  return response.data;
};

export default api;