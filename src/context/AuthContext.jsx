import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const authData = localStorage.getItem('authData')
      if (authData) {
        try {
          const { token, user, roles } = JSON.parse(authData)
          // Include roles in the user object for route guards
          setUser({ ...user, roles })
          setRoles(roles)
        } catch (error) {
          // Invalid auth data, remove it
          console.error('Invalid auth data, removing:', error)
          localStorage.removeItem('authData')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // --- Replace these stubs with real API calls when wiring to Spring Boot ---

  const login = async (phoneNumber, password) => {
    console.log('Login called with:', { phoneNumber, password })
    try {
      const response = await api.post('/auth/login', { phoneNumber, password })
      const { token, user, roles } = response
      
      // Include roles in user object and store full auth response
      const userWithRoles = { ...user, roles }
      localStorage.setItem('authData', JSON.stringify({ token, user: userWithRoles, roles }))
      setUser(userWithRoles)
      setRoles(roles)
      return roles
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (data) => {
    try {
      const response = await api.post('/auth/register', data)
      const { token, user, roles } = response
      
      // Include roles in user object and store full auth response
      const userWithRoles = { ...user, roles }
      localStorage.setItem('authData', JSON.stringify({ token, user: userWithRoles, roles }))
      setUser(userWithRoles)
      return userWithRoles
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('authData')
    setUser(null)
    setRoles(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, roles, setRoles, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
