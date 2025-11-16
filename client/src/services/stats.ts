import api from './api'
import type { Period, StatsResponse } from '../types'

export const fetchStats = async (period: Period) => {
  const { data } = await api.get<StatsResponse>('/api/stats', {
    params: { period },
  })
  return data
}


