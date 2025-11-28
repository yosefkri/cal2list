import { Card, CardContent, Stack, Typography } from '@mui/material'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { StatsResponse } from '../types'

interface CalorieChartProps {
  stats: StatsResponse
}

const CalorieChart = ({ stats }: CalorieChartProps) => {
  const chartData =
    stats.breakdown ??
    stats.meals.map((meal, index) => ({
      label: meal.name,
      calories: meal.calories,
      index: index + 1,
    }))

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(140deg, rgba(63,181,114,0.18), rgba(255,179,71,0.18))',
        border: '1px solid rgba(63,181,114,0.16)',
      }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Stack spacing={2} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              מגמת קלוריות
            </Typography>
            <Typography variant="body2" color="text.secondary">
              היעדים שלכם בתנועה מתמדת 📈
            </Typography>
          </Stack>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3fb572" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#3fb572" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#2a9d8f', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#2a9d8f', fontSize: 12 }}
                width={70}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString('he-IL')} קלוריות`, 'סה״כ']}
                labelFormatter={(label: string) => `פריט: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#2a9d8f"
                fill="url(#colorCalories)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CalorieChart


