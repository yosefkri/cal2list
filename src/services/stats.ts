import api from './api'
import type { Period, StatsResponse } from '../types'

export const fetchStats = async (period: Period, email?: string) => {
  const { data } = await api.get<StatsResponse>('/api/stats', {
    params: { 
      period,
      ...(email && { email })
    },
  })
  return data
}
