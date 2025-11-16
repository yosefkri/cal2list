import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Card, CardContent, Stack, Typography } from '@mui/material'

interface MotivationCardProps {
  totalCalories: number
  goalCalories: number
}

const getMessage = (ratio: number) => {
  if (ratio < 0.6) {
    return 'איזה יופי! נשאר לכם עוד מקום לפינוק בריא 🍓'
  }
  if (ratio < 1) {
    return 'איזון מושלם! המשיכו בבחירות הטובות 🍽️'
  }
  return 'עצרו לנשום. בחרו בארוחה קלה יותר בהמשך היום 🫶'
}

const MotivationCard = ({ totalCalories, goalCalories }: MotivationCardProps) => {
  const ratio = totalCalories / goalCalories

  return (
    <Card
      sx={{
        background: 'linear-gradient(120deg, rgba(63,181,114,0.12), rgba(47,128,237,0.12))',
        border: '1px solid rgba(63,181,114,0.16)',
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <AutoAwesomeIcon color="primary" fontSize="large" />
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              מילות השראה להמשך הדרך ✨
            </Typography>
            <Typography color="text.secondary">{getMessage(ratio)}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MotivationCard


