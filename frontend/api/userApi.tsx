import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.224.125.155:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 🔐 Interceptor — injeta token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------- AUTH ----------------

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post('/login', data);
  const { token, user } = res.data;
  if (token) await AsyncStorage.setItem('token', token);
  return { token, user };
};

export const logoutUser = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};

export const getUser = async () => {
  const res = await api.get('/user');
  return res.data;
};

// ---------------- PEDIDOS ----------------

// 🧺 Criar pedido — envia imagem via FormData
export const criarPedido = async (formData: FormData) => {
  const res = await api.post('/pedidos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};



// 📄 Buscar pedidos do usuário autenticado
export const getPedidos = async () => {
  const res = await api.get('/pedidos');
  return res.data; // espera { pedidos: [...] }
};

// ❌ Apagar pedido
export const deletePedido = async (id: number) => {
  const res = await api.delete(`/pedidos/${id}`);
  return res.data;
};

export default api;
