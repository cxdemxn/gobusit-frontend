import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // --- Replace these stubs with real API calls when wiring to Spring Boot ---

  const login = async (phone, password) => {
    // TODO: POST /api/auth/login { phone, password }
    // Returns { token, user: { id, firstName, lastName, email, phone, role } }
    // Store token (localStorage), set user state, return user
    throw new Error('Not implemented')
  }

  const register = async (data) => {
    // TODO: POST /api/auth/register { firstName, lastName, email, phone, password }
    // Auto-login on success
    throw new Error('Not implemented')
  }

  const logout = () => {
    // TODO: clear localStorage token
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
