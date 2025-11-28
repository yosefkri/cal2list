import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'

import type { MealEntry } from '../types'

interface MealListProps {
  meals: MealEntry[]
  isEmptyMessage?: string
}

const MealList = ({ meals, isEmptyMessage = 'עוד לא נרשמו ארוחות לתקופה זו' }: MealListProps) => {
  if (!meals.length) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <EmojiFoodBeverageIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={600}>
              {isEmptyMessage}
            </Typography>
            <Typography color="text.secondary">
              הוסיפו את הארוחה הבאה שלכם ותנו לנו לעזור לשמור על איזון 🍽️
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            ארוחות שנרשמו
          </Typography>
          <List disablePadding>
            {meals.map((meal, index) => (
              <Stack key={meal.id} spacing={2}>
                <ListItem
                  disableGutters
                  secondaryAction={
                    <Chip
                      label={`${meal.calories.toLocaleString('he-IL')} קלו״ר`}
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: index % 2 === 0 ? 'secondary.main' : 'primary.main',
                        color: '#fff',
                      }}
                    >
                      {meal.emoji ?? <RestaurantIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {meal.name}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WatchLaterIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(meal.consumedAt).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < meals.length - 1 && <Divider variant="middle" flexItem />}
              </Stack>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MealList


