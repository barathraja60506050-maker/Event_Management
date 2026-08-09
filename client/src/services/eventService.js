import api from './api';

export const eventService = {
  list: (params) => api.get('/events', { params }).then((r) => r.data.data),
  getBySlug: (slug) => api.get(`/events/${slug}`).then((r) => r.data.data),
  create: (formData) =>
    api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data),
  update: (id, formData) =>
    api
      .patch(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),
  remove: (id) => api.delete(`/events/${id}`).then((r) => r.data.data),
  mine: () => api.get('/events/mine').then((r) => r.data.data),
};

export const registrationService = {
  register: (payload) => api.post('/registrations', payload).then((r) => r.data.data),
  cancel: (id) => api.patch(`/registrations/${id}/cancel`).then((r) => r.data.data),
  myRegistrations: () => api.get('/registrations/mine').then((r) => r.data.data),
  getById: (id) => api.get(`/registrations/${id}`).then((r) => r.data.data),
};

export const paymentService = {
  pay: (payload) => api.post('/payments', payload).then((r) => r.data.data),
  receipt: (id) => api.get(`/payments/${id}/receipt`).then((r) => r.data.data),
};

export const certificateService = {
  mine: () => api.get('/certificates/mine').then((r) => r.data.data),
  upload: (formData) =>
    api
      .post('/certificates', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),
};

export const dashboardService = {
  summary: () => api.get('/dashboard/summary').then((r) => r.data.data),
  adminAnalytics: () => api.get('/dashboard/admin-analytics').then((r) => r.data.data),
};
