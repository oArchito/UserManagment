import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT token into requests
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

// Optional interceptor to handle 401s (token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403 && error.response.data?.message?.includes('inactive'))) {
      // Clear token and redirect to login if unauthorized or inactive
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register/forgot-password/reset-password pages
      const path = window.location.pathname;
      if (!['/login', '/register', '/forgot-password'].some(p => path.startsWith(p)) && !path.includes('/reset-password')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
