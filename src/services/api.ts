import axios from 'axios';

// Permitir alternar entre Node (5000) e FastAPI (8000) via variável de ambiente
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios com URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Serviços de usuário
export const userService = {
  updateProfile: async (name: string, email: string) => {
    const response = await api.put('/users/profile', { name, email });
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/users');
    return response.data;
  },
};

// Serviços de pegada de carbono
export interface TransportationData {
  carKm: number;
  publicTransportKm: number;
  flightKm: number;
}

export interface EnergyData {
  electricityKwh: number;
  gasConsumption: number;
}

export interface FoodData {
  meatConsumption: number;
  dairyConsumption: number;
  locallySourced: boolean;
}

export interface WasteData {
  recyclingPercentage: number;
  wasteProduced: number;
}

export interface CarbonFootprintData {
  transportation: TransportationData;
  energy: EnergyData;
  food: FoodData;
  waste: WasteData;
}

export const carbonService = {
  addFootprint: async (data: CarbonFootprintData) => {
    const response = await api.post('/carbon', data);
    return response.data;
  },
  
  getUserFootprints: async () => {
    const response = await api.get('/carbon');
    return response.data;
  },
  
  getFootprintById: async (id: string) => {
    const response = await api.get(`/carbon/${id}`);
    return response.data;
  },
  
  updateFootprint: async (id: string, data: CarbonFootprintData) => {
    const response = await api.put(`/carbon/${id}`, data);
    return response.data;
  },
  
  deleteFootprint: async (id: string) => {
    const response = await api.delete(`/carbon/${id}`);
    return response.data;
  },
  
  getFootprintSummary: async () => {
    const response = await api.get('/carbon/summary');
    return response.data;
  },
};

export default api;