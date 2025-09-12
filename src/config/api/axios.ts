import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return error.response;
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          // localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('❌ Access forbidden');
          break;
        case 404:
          // Not found
          console.error('❌ Resource not found');
          break;
        case 422:
          // Validation error
          console.error('❌ Validation error:', data);
          break;
        case 500:
          // Server error
          console.error('❌ Server error');
          break;
        default:
          console.error(`❌ API Error ${status}:`, data);
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          data,
          message: error.message,
        });
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }

    return error.response;
  }
);

export default apiClient;
