export type Period = 'day' | 'week' | 'month' | 'year'

export interface User {
  id?: string
  name?: string
  email?: string
  photoUrl?: string
}

export interface MealEntry {
  id: string
  name: string
  calories: number
  emoji?: string
  consumedAt: string
}

export interface MealInput {
  name: string
  calories?: number
  emoji?: string
  consumedAt?: string
}

export interface MealResponse {
  meal: MealEntry
  message: string
}

export interface StatsResponse {
  period: Period
  totalCalories: number
  goalCalories?: number
  meals: MealEntry[]
  breakdown?: Array<{
    label: string
    calories: number
  }>
}

export interface LoginResponse {
  token: string
  user?: User
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  age: string
  height: string
  weight: string
  sex: string
  workoutDays: string
  goal: string
  referralSource: string
}

export interface RegisterResponse extends LoginResponse {
  message?: string
}
