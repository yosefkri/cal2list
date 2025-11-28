import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import FireplaceIcon from '@mui/icons-material/Fireplace'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'

import type { StatsResponse } from '../types'

interface StatsSummaryProps {
  stats: StatsResponse
}

const StatsSummary = ({ stats }: StatsSummaryProps) => {
  const goal = stats.goalCalories ?? 2000
  const progress = Math.min((stats.totalCalories / goal) * 100, 150)
  const remaining = Math.max(goal - stats.totalCalories, 0)

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={700}>
                סך הקלוריות לתקופה
              </Typography>
              <Typography color="text.secondary">איזון יומי מושלם מתחיל כאן 🥗</Typography>
            </Stack>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={1.5}
              borderRadius={3}
              bgcolor="rgba(63,181,114,0.12)"
              color="primary.main"
            >
              <FireplaceIcon fontSize="large" />
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="h3" fontWeight={800} color="primary.main">
                {stats.totalCalories.toLocaleString('he-IL')} קלו״ר
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                יעד: {goal.toLocaleString('he-IL')} קלו״ר
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 12,
                borderRadius: 999,
                backgroundColor: 'rgba(63,181,114,0.16)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  backgroundImage: 'linear-gradient(90deg,#3fb572,#2a9d8f)',
                },
              }}
            />
            {progress > 100 && (
              <Stack direction="row" spacing={1} alignItems="center" color="error.main">
                <TrendingDownIcon />
                <Typography variant="body2">שימו לב לעודף קלוריות, איזון זה הכל!</Typography>
              </Stack>
            )}
          </Stack>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              background: 'rgba(255,179,71,0.12)',
              borderColor: 'rgba(255,179,71,0.32)',
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmojiEventsIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    נשארו {remaining.toLocaleString('he-IL')} קלוריות עד היעד
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    המשיכו בתזונה מאוזנת ותזכו בתחושת ניצחון מתוקה 🍯
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default StatsSummary


