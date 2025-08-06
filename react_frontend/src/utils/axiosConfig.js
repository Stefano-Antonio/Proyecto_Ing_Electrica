import axios from 'axios';

// Crea instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // ⏱️ opcional, tiempo límite de respuesta
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes manejar errores 401, mostrar toasts, etc.
    if (error.response?.status === 401) {
      console.warn('Token inválido o expirado');
      // Aquí podrías redirigir, borrar token, mostrar alerta, etc.
    }
    return Promise.reject(error);
  }
);

export default apiClient;