import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { setAuthToken } from '../services/api'
import { loginRequest, registerRequest } from '../services/auth'
import type { LoginResponse, RegisterResponse, User } from '../types'

interface AuthContextValue {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  register: (registerData: Omit<import('../types').RegisterInput, 'password'> & { password: string }) => Promise<RegisterResponse>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'calorie-diary-token'
const USER_STORAGE_KEY = 'calorie-diary-user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  })
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) {
      return null
    }
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const persistSession = useCallback((newToken: string, newUser: User | null) => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    setToken(newToken)
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
      setUser(null)
    }
  }, [])

  const clearSession = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const response = await loginRequest(email, password)
        persistSession(response.token, response.user ?? null)
        return response
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    clearSession()
    setAuthToken(null)
  }, [clearSession])

  const register = useCallback(
    async (registerData: Omit<import('../types').RegisterInput, 'password'> & { password: string }) => {
      setLoading(true)
      try {
        const response = await registerRequest(registerData as import('../types').RegisterInput)
        // Only persist session if we have a token AND it's not a 201 status
        if (response.token && (response as any).status !== 201) {
          persistSession(response.token, response.user ?? null)
        }
        return response
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      register,
    }),
    [loading, login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext חייב לפעול בתוך AuthProvider')
  }
  return context
}
