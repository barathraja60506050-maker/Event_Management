import api from './api';

export const adminService = {
  getUsers: () => api.get('/admin/users').then((r) => r.data.data),
  getRegistrations: () => api.get('/registrations').then((r) => r.data.data),
  getPayments: () => api.get('/payments').then((r) => r.data.data),
  getCertificates: () => api.get('/certificates').then((r) => r.data.data),
  getOrganizerRequests: () => api.get('/admin/organizer-requests').then((r) => r.data.data),
  updateOrganizerRequestStatus: (id, status) =>
    api.patch(`/admin/organizer-requests/${id}/status`, { status }).then((r) => r.data.data),
};
