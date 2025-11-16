import type { ReactElement, SyntheticEvent } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EventIcon from '@mui/icons-material/Event'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import TodayIcon from '@mui/icons-material/Today'
import { Stack, Tab, Tabs, Typography } from '@mui/material'

import type { Period } from '../types'

interface PeriodTabsProps {
  period: Period
  onChange: (period: Period) => void
}

const periodOptions: Array<{ value: Period; label: string; icon: ReactElement }> = [
  { value: 'day', label: 'יום', icon: <TodayIcon /> },
  { value: 'week', label: 'שבוע', icon: <EventIcon /> },
  { value: 'month', label: 'חודש', icon: <CalendarMonthIcon /> },
  { value: 'year', label: 'שנה', icon: <HistoryEduIcon /> },
]

const PeriodTabs = ({ period, onChange }: PeriodTabsProps) => {
  const handleChange = (_: SyntheticEvent, newValue: Period) => {
    onChange(newValue)
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
        בחרו תקופה
      </Typography>
      <Tabs
        value={period}
        onChange={handleChange}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTabs-flexContainer': {
            gap: 1,
          },
          '& .MuiTab-root': {
            borderRadius: 999,
            minHeight: 48,
            px: 3,
            backgroundColor: 'rgba(63,181,114,0.08)',
          },
          '& .Mui-selected': {
            backgroundColor: 'primary.main',
            color: '#fff !important',
          },
        }}
      >
        {periodOptions.map((option) => (
          <Tab
            key={option.value}
            value={option.value}
            icon={option.icon}
            iconPosition="start"
            label={option.label}
          />
        ))}
      </Tabs>
    </Stack>
  )
}

export default PeriodTabs

