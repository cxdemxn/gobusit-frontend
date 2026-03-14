import { api } from './api'

export const scheduleService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.routeId) params.append('routeId', filters.routeId)
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status)
    if (filters.date) params.append('date', filters.date)
    if (filters.page) params.append('page', filters.page - 1)
    
    const query = params.toString()
    return await api.get(`/api/admin/schedules${query ? '?' + query : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/api/admin/schedules/${id}`)
  },

  create: async (scheduleData) => {
    return await api.post('/api/admin/schedules', scheduleData)
  },

  update: async (id, scheduleData) => {
    return await api.put(`/api/admin/schedules/${id}`, scheduleData)
  },

  delete: async (id) => {
    return await api.delete(`/api/admin/schedules/${id}`)
  },

  cancel: async (id) => {
    return await api.patch(`/api/admin/schedules/${id}/cancel`)
  }
}
