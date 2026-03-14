import { api } from './api'

export const busService = {
  getAll: async () => {
    return await api.get('/api/admin/buses')
  },

  getById: async (id) => {
    return await api.get(`/api/admin/buses/${id}`)
  },

  create: async (busData) => {
    return await api.post('/api/admin/buses', busData)
  },

  update: async (id, busData) => {
    return await api.put(`/api/admin/buses/${id}`, busData)
  },

  delete: async (id) => {
    return await api.delete(`/api/admin/buses/${id}`)
  }
}
