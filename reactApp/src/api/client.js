import axios from 'axios';
import { clearSession, getToken } from '../features/auth/session';

// Single place for the API base URL; set REACT_APP_API_URL in .env
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://node-4-pdlj.onrender.com',
});

// Every request carries the admin's token; the server scopes all data to that admin
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or revoked session sends the admin back to the login page.
// /auth/login answers 401 for wrong credentials, which the form handles itself.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/login')) {
      clearSession();
      window.location.hash = '#/';
    }
    return Promise.reject(error);
  }
);

// Server unreachable or offline: there is no HTTP response at all
export const isNetworkError = (error) => !error?.response;

// The server's own error message when it sent one, otherwise a fallback
export const getErrorMessage = (error, fallback) => error?.response?.data?.error || fallback;
