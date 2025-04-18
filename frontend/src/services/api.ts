import axios from 'axios';
import { AuthToken, UserLogin, UserRegister, UserUpdate, PasswordChange, YAMLContent, ValidationResult } from '../types';

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: `http://${window.location.hostname}:8000`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.url, 'Token exists:', !!token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  login: async (credentials: UserLogin): Promise<AuthToken> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<AuthToken>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData: UserRegister) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateCurrentUser: async (userData: UserUpdate) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  changePassword: async (passwordData: PasswordChange) => {
    const response = await api.post('/users/me/change-password', passwordData);
    return response.data;
  },
};

// API de administración (solo para admins)
export const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId: number) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: number, userData: UserUpdate) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getUserFiles: async (userEmail: string) => {
    const response = await api.get(`/admin/users/${userEmail}/files`);
    return response.data;
  },
};

// API de archivos YAML
export const yamlAPI = {
  getYAMLFiles: async () => {
    const response = await api.get('/yaml-files');
    return response.data;
  },

  getYAMLFile: async (filename: string) => {
    const response = await api.get(`/yaml-files/${filename}`);
    return response.data;
  },

  saveYAMLFile: async (filename: string, content: YAMLContent) => {
    const response = await api.post(`/yaml-files/${filename}`, content);
    return response.data;
  },

  deleteYAMLFile: async (filename: string) => {
    const response = await api.delete(`/yaml-files/${filename}`);
    return response.data;
  },

  validateYAML: async (content: YAMLContent): Promise<ValidationResult> => {
    const response = await api.post('/validate-yaml', content);
    return response.data;
  },

  createNewYAMLFile: async (filename: string, mode: 'simple' | 'advanced') => {
    const url = `/yaml-files-new?filename=${filename}&mode=${mode}`;
    const response = await api.get(url);
    return response.data;
  },

  getYAMLFileForEditing: async (filename: string, mode: 'simple' | 'advanced') => {
    const response = await api.get(`/yaml-files-edit/${filename}?mode=${mode}`);
    return response.data;
  },
};

// API de esquema
export const schemaAPI = {
  getSchema: async () => {
    const response = await api.get('/schema');
    return response.data;
  },

  getFieldsList: async (category?: string) => {
    const url = category ? `/schema/fields-list?category=${category}` : '/schema/fields-list';
    const response = await api.get(url);
    return response.data;
  },
};

// API de historial
export const historyAPI = {
  getHistory: async (params?: { filename?: string; action?: string; user?: string; limit?: number; offset?: number }) => {
    const response = await api.get('/history', { params });
    return response.data;
  },

  getHistoryDetail: async (historyId: number) => {
    const response = await api.get(`/history/${historyId}`);
    return response.data;
  },
};

export default api;
