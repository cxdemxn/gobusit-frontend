import { api } from './api'

export const userService = {
  getAll: async (page = 1) => {
    return await api.get(`/api/admin/users?page=${page}`)
  },

  getById: async (id) => {
    return await api.get(`/api/admin/users/${id}`)
  },

  updateRole: async (id, role) => {
    return await api.patch(`/api/admin/users/${id}/roles`, { role })
  },

  enable: async (id) => {
    return await api.patch(`/api/admin/users/${id}/enable`)
  },

  disable: async (id) => {
    return await api.patch(`/api/admin/users/${id}/disable`)
  }
}
