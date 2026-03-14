import { api } from './api'

export const routeService = {
  getAll: async () => {
    return await api.get('/api/admin/routes')
  },

  getById: async (id) => {
    return await api.get(`/api/admin/routes/${id}`)
  },

  create: async (routeData) => {
    return await api.post('/api/admin/routes', routeData)
  },

  update: async (id, routeData) => {
    return await api.put(`/api/admin/routes/${id}`, routeData)
  },

  delete: async (id) => {
    return await api.delete(`/api/admin/routes/${id}`)
  },

  // Route points
  getPoints: async (routeId) => {
    return await api.get(`/api/admin/routes/${routeId}/points`)
  },

  addPoint: async (routeId, pointData) => {
    return await api.post(`/api/admin/routes/${routeId}/points`, pointData)
  },

  updatePoint: async (routeId, pointId, pointData) => {
    return await api.put(`/api/admin/routes/${routeId}/points/${pointId}`, pointData)
  },

  deletePoint: async (routeId, pointId) => {
    return await api.delete(`/api/admin/routes/${routeId}/points/${pointId}`)
  }
}
