import { api } from './api'

export const scheduleTemplateService = {
  getAll: async () => api.get('/api/admin/schedule-templates'),
  getById: async (id) => api.get(`/api/admin/schedule-templates/${id}`),
  create: async (data) => api.post('/api/admin/schedule-templates', data),
  activate: async (id) => api.patch(`/api/admin/schedule-templates/${id}/activate`),
  deactivate: async (id) => api.patch(`/api/admin/schedule-templates/${id}/deactivate`),
  delete: async (id) => api.delete(`/api/admin/schedule-templates/${id}`),
}
