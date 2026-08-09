import api from './api';

export const organizerService = {
  requestOrganizer: (payload) => api.post('/organizer-requests', payload).then((r) => r.data.data),
  getMyRequest: () => api.get('/organizer-requests/me').then((r) => r.data.data),
};
