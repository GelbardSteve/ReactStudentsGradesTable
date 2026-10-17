import axios from 'axios';

// Single place for the API base URL; set REACT_APP_API_URL in .env
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://node-4-pdlj.onrender.com',
});

// Server unreachable or offline: there is no HTTP response at all
export const isNetworkError = (error) => !error?.response;
