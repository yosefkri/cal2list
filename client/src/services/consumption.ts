import api from './api'
import type { MealInput, MealResponse } from '../types'

export const createMealEntry = async (payload: MealInput) => {
  const { data } = await api.post<MealResponse>('/api/consumption', payload)
  return data
}


