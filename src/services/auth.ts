import api from './api'
import type { LoginResponse, RegisterInput, RegisterResponse } from '../types'

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/api/login', {
    email,
    password,
  })
  return data
}

export const registerRequest = async (payload: RegisterInput) => {
  const response = await api.post<RegisterResponse>('/api/register', payload)
  return { ...response.data, status: response.status }
}
