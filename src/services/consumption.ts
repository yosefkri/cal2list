import api from './api'
import type { MealInput, MealResponse } from '../types'

export const createMealEntry = async (payload: MealInput, email?: string) => {
  const requestPayload = email ? { ...payload, email } : payload
  const { data } = await api.post<MealResponse>('/api/consumption', requestPayload)
  return data
}
