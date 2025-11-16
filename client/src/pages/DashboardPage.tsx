import { useState } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'

import AddMealForm from '../components/AddMealForm'
import CalorieChart from '../components/CalorieChart'
import MealList from '../components/MealList'
import MotivationCard from '../components/MotivationCard'
import PeriodTabs from '../components/PeriodTabs'
import StatsSummary from '../components/StatsSummary'
import { useCalorieStats } from '../hooks/useCalorieStats'
import type { Period } from '../types'

const DashboardPage = () => {
  const [period, setPeriod] = useState<Period>('day')
  const { data, loading, error, refresh } = useCalorieStats(period)

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          היומן הבריא שלכם 🥑
        </Typography>
        <Typography color="text.secondary">
          עקבו אחרי הקלוריות היומיות, השבועיות, החודשיות והשנתיות – והרגישו את ההתקדמות.
        </Typography>
      </Stack>

      <PeriodTabs period={period} onChange={setPeriod} />

      {loading && (
        <Stack alignItems="center" spacing={2} py={4}>
          <CircularProgress color="primary" />
          <Typography color="text.secondary">טוען נתונים בריאים...</Typography>
        </Stack>
      )}

      {error && (
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      )}

      {!loading && !data && !error && (
        <Alert severity="info" color="success">
          הנתונים עדיין לא זמינים. הוסיפו ארוחה ראשונה ותתחילו את המסע הבריא שלכם! 🌟
        </Alert>
      )}

      {data && (
        <Stack spacing={4}>
          <Box
            display="grid"
            gap={3}
            gridTemplateColumns={{ xs: '1fr', md: 'repeat(12, minmax(0, 1fr))' }}
            alignItems="stretch"
          >
            <Box gridColumn={{ xs: 'span 12', md: 'span 7' }}>
              <StatsSummary stats={data} />
            </Box>
            <Box gridColumn={{ xs: 'span 12', md: 'span 5' }}>
              <MotivationCard
                totalCalories={data.totalCalories}
                goalCalories={data.goalCalories ?? 2000}
              />
            </Box>
            <Box gridColumn={{ xs: 'span 12', md: 'span 7' }}>
              <CalorieChart stats={data} />
            </Box>
            <Box gridColumn={{ xs: 'span 12', md: 'span 5' }}>
              <AddMealForm onSuccess={refresh} />
            </Box>
          </Box>
          <MealList meals={data.meals} />
        </Stack>
      )}
    </Stack>
  )
}

export default DashboardPage

