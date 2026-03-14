// API service for connecting to Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Get token from authData
  let token = null
  try {
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      token = parsed.token
    }
  } catch (error) {
    // Invalid auth data, ignore
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status)
    }

    // Handle 204 No Content and other empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : null
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError('Network error occurred')
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
}

export { ApiError }
