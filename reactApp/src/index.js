import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on network errors to prevent infinite loops
        if (error.code === 'NETWORK_ERROR' || 
            error.message?.includes('Network Error') || 
            error.code === 'ERR_NETWORK' ||
            !error.response) {
          return false;
        }
        // Only retry once for other errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on network errors
        if (error.code === 'NETWORK_ERROR' || 
            error.message?.includes('Network Error') || 
            error.code === 'ERR_NETWORK' ||
            !error.response) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
