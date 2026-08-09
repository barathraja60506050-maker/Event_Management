import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  logout: () => api.post('/auth/logout').then((r) => r.data.data),
  getMe: () => api.get('/auth/me').then((r) => r.data.data),
  updateProfile: (formData) =>
    api
      .patch('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),
  updatePassword: (payload) => api.patch('/auth/update-password', payload).then((r) => r.data.data),
};
