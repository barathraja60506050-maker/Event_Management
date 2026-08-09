import axios from 'axios';

// A single configured axios instance so every service module shares the
// same base URL, auth header injection, and error normalization.
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('em_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    if (status === 401) {
      // Token invalid/expired: clear local session so the UI doesn't sit
      // in a half-authenticated state.
      localStorage.removeItem('em_token');
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
