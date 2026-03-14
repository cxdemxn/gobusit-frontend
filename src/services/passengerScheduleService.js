import { api } from './api'

export const passengerScheduleService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.originName) params.append('originName', filters.originName)
    if (filters.destinationName) params.append('destinationName', filters.destinationName)
    if (filters.date) params.append('date', filters.date)
    
    const query = params.toString()
    return await api.get(`/api/passenger/schedules${query ? '?' + query : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/api/passenger/schedules/${id}`)
  }
}
