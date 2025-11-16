import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchStats } from '../services/stats'
import type { Period, StatsResponse } from '../types'
import { useAuth } from './useAuth'

interface UseCalorieStatsResult {
  data: StatsResponse | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export const useCalorieStats = (period: Period): UseCalorieStatsResult => {
  const { token } = useAuth()
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const refresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setData(null)
      return
    }

    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const stats = await fetchStats(period)
        if (!cancelled) {
          setData(stats)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'התרחשה שגיאה בטעינת הנתונים')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      cancelled = true
    }
  }, [period, refreshIndex, token])

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
    }),
    [data, error, loading, refresh],
  )
}


