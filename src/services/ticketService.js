import { api } from './api'

export const ticketService = {
  // Admin endpoints
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status)
    if (filters.scheduleId) params.append('scheduleId', filters.scheduleId)
    if (filters.userId) params.append('userId', filters.userId)
    if (filters.page) params.append('page', filters.page - 1)
    
    const query = params.toString()
    return await api.get(`/api/admin/tickets${query ? '?' + query : ''}`)
  },

  getById: async (id) => {
    return await api.get(`/api/admin/tickets/${id}`)
  },

  cancel: async (id) => {
    return await api.patch(`/api/admin/tickets/${id}/cancel`)
  },

  // Passenger endpoints
  getMyTickets: async () => {
    return await api.get('/api/passenger/tickets')
  },

  getMyTicketById: async (id) => {
    return await api.get(`/api/passenger/tickets/${id}`)
  },

  bookTicket: async (ticketData) => {
    return await api.post('/api/passenger/tickets', ticketData)
  },

  cancelMyTicket: async (id) => {
    return await api.patch(`/api/passenger/tickets/${id}/cancel`)
  }
}
